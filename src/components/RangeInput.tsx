import React from 'react';
import { SearchRange } from '../types';

interface RangeInputProps {
  range: SearchRange;
  onChange: (range: SearchRange) => void;
  disabled?: boolean;
}

export function RangeInput({ range, onChange, disabled }: RangeInputProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">بداية النطاق</label>
        <input
          type="text"
          value={range.start}
          onChange={(e) => onChange({ ...range, start: e.target.value })}
          className="w-full p-2 border rounded-md text-left font-mono text-sm"
          dir="ltr"
          placeholder="0x000000..."
          disabled={disabled}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">نهاية النطاق</label>
        <input
          type="text"
          value={range.end}
          onChange={(e) => onChange({ ...range, end: e.target.value })}
          className="w-full p-2 border rounded-md text-left font-mono text-sm"
          dir="ltr"
          placeholder="0xFFFFFF..."
          disabled={disabled}
        />
      </div>
    </div>
  );
}