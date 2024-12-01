import { useState, useCallback, useRef } from 'react';
import { wrap } from 'comlink';
import type { SearchSettings, SearchResults, PerformanceData } from '../types';

export function useSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResults[]>([]);
  const workersRef = useRef<Worker[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopSearch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      workersRef.current.forEach(worker => {
        worker.postMessage({ type: 'STOP' });
        worker.terminate();
      });
      workersRef.current = [];
      setIsSearching(false);
    }
  }, []);

  const startSearch = useCallback(async (settings: SearchSettings) => {
    if (isSearching) {
      return;
    }

    try {
      setIsSearching(true);
      abortControllerRef.current = new AbortController();

      const workerCount = settings.processingUnits.cpu ? settings.cpuThreads : 0;
      const workers: Worker[] = [];
      const workerPromises: Promise<void>[] = [];

      const aggregatePerformance: PerformanceData = {
        totalSpeed: 0,
        estimatedTimeRemaining: 0,
        processedAddresses: 0
      };

      if (settings.processingUnits.cpu) {
        for (let i = 0; i < workerCount; i++) {
          const worker = new Worker(
            new URL('../workers/search.worker.ts', import.meta.url),
            { type: 'module' }
          );
          workers.push(worker);
          const workerApi = wrap<any>(worker);

          const promise = workerApi.search({
            start: settings.range.start,
            end: settings.range.end,
            targetAddresses: settings.targetAddresses,
            iterations: settings.iterations
          });

          worker.onmessage = (event) => {
            if (event.data.type === 'PROGRESS') {
              const progress = event.data.payload;
              
              // Update aggregate performance
              if (progress.performance) {
                aggregatePerformance.totalSpeed += progress.performance.speed;
                aggregatePerformance.processedAddresses += progress.performance.processedAddresses;
                aggregatePerformance.estimatedTimeRemaining = Math.max(
                  aggregatePerformance.estimatedTimeRemaining,
                  progress.performance.estimatedTimeRemaining
                );

                if (!aggregatePerformance.cpu) {
                  aggregatePerformance.cpu = {
                    speed: 0,
                    processedAddresses: 0
                  };
                }
                aggregatePerformance.cpu.speed += progress.performance.speed;
                aggregatePerformance.cpu.processedAddresses += progress.performance.processedAddresses;
              }

              // Add new results
              if (progress.results && progress.results.length > 0) {
                setResults(prev => [...prev, {
                  timestamp: new Date().toLocaleString('ar-SA'),
                  results: progress.results,
                  performance: { ...aggregatePerformance }
                }]);
              }
            }
          };

          workerPromises.push(promise);
        }
      }

      workersRef.current = workers;

      // Wait for all workers to complete or be aborted
      await Promise.all(workerPromises).catch((error) => {
        if (error.message === 'Search aborted') {
          console.log('Search was stopped by user');
        } else {
          throw error;
        }
      });

    } catch (error) {
      console.error('Search error:', error);
    } finally {
      workersRef.current.forEach(worker => worker.terminate());
      workersRef.current = [];
      setIsSearching(false);
    }
  }, [isSearching]);

  return {
    isSearching,
    results,
    startSearch,
    stopSearch
  };
}