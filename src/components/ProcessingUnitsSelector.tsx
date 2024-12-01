import React from 'react';
import { SearchSettings } from '../types';

interface ProcessingUnitsSelectorProps {
  settings: SearchSettings;
  onChange: (settings: SearchSettings) => void;
  disabled?: boolean;
}

export function ProcessingUnitsSelector({
  settings,
  onChange,
  disabled
}: ProcessingUnitsSelectorProps) {
  const handleUnitChange = (unit: 'cpu' | 'gpu', checked: boolean) => {
    onChange({
      ...settings,
      processingUnits: {
        ...settings.processingUnits,
        [unit]: checked
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium mb-2">وحدات المعالجة</div>
      
      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.processingUnits.cpu}
            onChange={(e) => handleUnitChange('cpu', e.target.checked)}
            disabled={disabled}
            className="w-4 h-4"
          />
          <span>CPU</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.processingUnits.gpu}
            onChange={(e) => handleUnitChange('gpu', e.target.checked)}
            disabled={disabled}
            className="w-4 h-4"
          />
          <span>GPU</span>
        </label>
      </div>

      {settings.processingUnits.cpu && (
        <div>
          <label className="block text-sm font-medium mb-2">عدد مسارات CPU</label>
          <input
            type="number"
            value={settings.cpuThreads}
            onChange={(e) => onChange({
              ...settings,
              cpuThreads: parseInt(e.target.value)
            })}
            className="w-full p-2 border rounded-md"
            min="1"
            max={navigator.hardwareConcurrency}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}