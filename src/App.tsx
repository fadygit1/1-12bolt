import React, { useState } from 'react';
import { SearchForm } from './components/SearchForm';
import { SearchResults } from './components/SearchResults';
import { SearchSettings } from './types';
import { useSearch } from './hooks/useSearch';

const INITIAL_RANGE = {
  start: "00000000001011afdacdba123456789a123cacacadefffe125051528a5e42a25",
  end: "0000000000f011afdacdba123456789a123cacacadefffe12505153204039d39"
};

function App() {
  const { isSearching, results, startSearch, stopSearch } = useSearch();
  const [settings, setSettings] = useState<SearchSettings>({
    range: INITIAL_RANGE,
    outputFilePath: 'results.json',
    autoSaveInterval: 5,
    iterations: 4,
    processingUnits: {
      cpu: true,
      gpu: false
    },
    cpuThreads: navigator.hardwareConcurrency || 4,
    targetAddresses: []
  });

  const handleStartSearch = async () => {
    if (settings.targetAddresses.length === 0) {
      alert('الرجاء إدخال عنوان واحد على الأقل للبحث عنه');
      return;
    }

    if (!settings.processingUnits.cpu && !settings.processingUnits.gpu) {
      alert('الرجاء اختيار وحدة معالجة واحدة على الأقل (CPU أو GPU)');
      return;
    }

    await startSearch(settings);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">نظام البحث المتقدم</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">إعدادات البحث</h2>
              <SearchForm
                settings={settings}
                onSettingsChange={setSettings}
                onStartSearch={handleStartSearch}
                onStopSearch={stopSearch}
                isSearching={isSearching}
              />
            </div>
            
            <div>
              <SearchResults results={results} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;