import React from 'react';
import { SearchResults as SearchResultsType } from '../types';
import { PerformanceMetrics } from './PerformanceMetrics';

interface SearchResultsProps {
  results: SearchResultsType[];
}

export function SearchResults({ results }: SearchResultsProps) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">نتائج البحث</h2>
      {results.length === 0 ? (
        <p className="text-gray-500">لا توجد نتائج حتى الآن</p>
      ) : (
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="border rounded-md p-4">
              <div className="text-sm text-gray-500 mb-2">{result.timestamp}</div>
              <PerformanceMetrics performance={result.performance} />
              <div className="mt-4">
                <h3 className="font-semibold mb-2">العناوين المكتشفة:</h3>
                <div className="space-y-2">
                  {result.results.map((item, i) => (
                    <div key={i} className="bg-gray-50 p-2 rounded">
                      <p className="text-sm font-mono">العنوان: {item.address}</p>
                      <p className="text-sm font-mono">المفتاح الخاص: {item.privateKey}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}