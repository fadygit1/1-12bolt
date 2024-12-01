export interface SearchRange {
  start: string;
  end: string;
}

export interface SearchSettings {
  range: SearchRange;
  outputFilePath: string;
  autoSaveInterval: number;
  iterations: number;
  processingUnits: {
    cpu: boolean;
    gpu: boolean;
  };
  cpuThreads: number;
  targetAddresses: string[];
}

export interface SearchResult {
  address: string;
  privateKey: string;
}

export interface PerformanceData {
  cpu?: {
    speed: number;
    processedAddresses: number;
  };
  gpu?: {
    speed: number;
    processedAddresses: number;
  };
  totalSpeed: number;
  estimatedTimeRemaining: number;
  processedAddresses: number;
}

export interface SearchResults {
  timestamp: string;
  results: SearchResult[];
  performance: PerformanceData;
}