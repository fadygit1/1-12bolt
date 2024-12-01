import { expose } from 'comlink';
import { isValidPrivateKey, privateKeyToAddress, isInRange } from '../utils/bitcoin';

interface SearchParams {
  start: string;
  end: string;
  targetAddresses: string[];
  iterations: number;
}

function generateRandomPrivateKey(start: string, end: string): string {
  const startNum = BigInt(`0x${start}`);
  const endNum = BigInt(`0x${end}`);
  const range = endNum - startNum;
  const random = BigInt(Math.floor(Math.random() * Number(range)));
  return (startNum + random).toString(16).padStart(64, '0');
}

let shouldStop = false;

self.onmessage = (event) => {
  if (event.data.type === 'STOP') {
    shouldStop = true;
  }
};

const searchWorker = {
  async search({ start, end, targetAddresses, iterations }: SearchParams) {
    shouldStop = false;
    const results = new Set<{ privateKey: string; address: string }>();
    let processedAddresses = 0;
    const startTime = Date.now();
    let lastUpdateTime = startTime;

    while (!shouldStop) {
      for (let i = 0; i < iterations; i++) {
        if (shouldStop) break;

        const privateKey = generateRandomPrivateKey(start, end);
        
        if (!isValidPrivateKey(privateKey) || !isInRange(privateKey, start, end)) {
          continue;
        }

        const address = privateKeyToAddress(privateKey);
        processedAddresses++;

        if (targetAddresses.includes(address)) {
          results.add({ privateKey, address });
        }
      }

      const currentTime = Date.now();
      const elapsedTime = (currentTime - startTime) / 1000;
      const timeSinceLastUpdate = (currentTime - lastUpdateTime) / 1000;

      // Update progress every second
      if (timeSinceLastUpdate >= 1) {
        const speed = processedAddresses / elapsedTime;
        const foundCount = results.size;
        
        const progress = {
          results: Array.from(results),
          performance: {
            speed,
            processedAddresses,
            estimatedTimeRemaining: foundCount > 0 
              ? (targetAddresses.length - foundCount) * (elapsedTime / foundCount)
              : Infinity
          }
        };

        // Post progress update
        self.postMessage({ type: 'PROGRESS', payload: progress });
        lastUpdateTime = currentTime;
      }
    }

    if (shouldStop) {
      throw new Error('Search aborted');
    }
  }
};

expose(searchWorker);