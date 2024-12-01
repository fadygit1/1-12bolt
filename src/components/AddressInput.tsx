import React, { useState } from 'react';

interface AddressInputProps {
  addresses: string[];
  onChange: (addresses: string[]) => void;
  disabled?: boolean;
}

export function AddressInput({ addresses, onChange, disabled }: AddressInputProps) {
  const [newAddress, setNewAddress] = useState('');

  const handleAddAddress = () => {
    if (newAddress && !addresses.includes(newAddress)) {
      onChange([...addresses, newAddress]);
      setNewAddress('');
    }
  };

  const handleRemoveAddress = (index: number) => {
    onChange(addresses.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">العناوين المستهدفة</label>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          className="flex-1 p-2 border rounded-md"
          placeholder="أدخل عنواناً"
          disabled={disabled}
        />
        <button
          onClick={handleAddAddress}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          disabled={disabled || !newAddress}
        >
          إضافة
        </button>
      </div>

      <div className="mt-2 space-y-2">
        {addresses.map((address, index) => (
          <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
            <span className="flex-1 font-mono text-sm">{address}</span>
            <button
              onClick={() => handleRemoveAddress(index)}
              className="text-red-600 hover:text-red-700 disabled:text-gray-400"
              disabled={disabled}
            >
              حذف
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}