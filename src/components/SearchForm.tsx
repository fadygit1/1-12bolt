import React from 'react';
import { SearchSettings } from '../types';
import { RangeInput } from './RangeInput';
import { AddressInput } from './AddressInput';
import { ProcessingUnitsSelector } from './ProcessingUnitsSelector';

interface SearchFormProps {
  settings: SearchSettings;
  onSettingsChange: (settings: SearchSettings) => void;
  onStartSearch: () => void;
  onStopSearch: () => void;
  isSearching: boolean;
}

export function SearchForm({
  settings,
  onSettingsChange,
  onStartSearch,
  onStopSearch,
  isSearching
}: SearchFormProps) {
  const handleSettingChange = (key: keyof SearchSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const addresses = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      handleSettingChange('targetAddresses', addresses);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('حدث خطأ أثناء قراءة الملف');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <RangeInput
          range={settings.range}
          onChange={(range) => handleSettingChange('range', range)}
          disabled={isSearching}
        />

        <AddressInput
          addresses={settings.targetAddresses}
          onChange={(addresses) => handleSettingChange('targetAddresses', addresses)}
          disabled={isSearching}
        />

        <div>
          <label className="block text-sm font-medium mb-2">تحميل ملف العناوين</label>
          <input
            type="file"
            onChange={handleFileUpload}
            className="w-full p-2 border rounded-md"
            accept=".txt,.csv"
            disabled={isSearching}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">مسار حفظ النتائج</label>
          <input
            type="text"
            value={settings.outputFilePath}
            onChange={(e) => handleSettingChange('outputFilePath', e.target.value)}
            className="w-full p-2 border rounded-md text-left"
            dir="ltr"
            placeholder="results.json"
            disabled={isSearching}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">مدة الحفظ التلقائي (بالدقائق)</label>
          <input
            type="number"
            value={settings.autoSaveInterval}
            onChange={(e) => handleSettingChange('autoSaveInterval', parseInt(e.target.value))}
            className="w-full p-2 border rounded-md"
            min="1"
            disabled={isSearching}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">عدد التكرارات المتتالية</label>
          <input
            type="number"
            value={settings.iterations}
            onChange={(e) => handleSettingChange('iterations', parseInt(e.target.value))}
            className="w-full p-2 border rounded-md"
            min="1"
            disabled={isSearching}
          />
        </div>

        <ProcessingUnitsSelector
          settings={settings}
          onChange={onSettingsChange}
          disabled={isSearching}
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={isSearching ? onStopSearch : onStartSearch}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            isSearching
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSearching ? 'إيقاف البحث' : 'بدء البحث'}
        </button>
      </div>
    </div>
  );
}