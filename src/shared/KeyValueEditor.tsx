import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface KeyValueEditorProps {
  label?: string;
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}

export const KeyValueEditor: React.FC<KeyValueEditorProps> = ({ label, value, onChange }) => {
  const [entries, setEntries] = useState<Array<{ key: string; value: string }>>(
    Object.entries(value || {}).map(([key, val]) => ({ key, value: val }))
  );

  const handleAddField = () => {
    const newEntries = [...entries, { key: '', value: '' }];
    setEntries(newEntries);
  };

  const handleRemoveField = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
    
    const newValue = newEntries.reduce((acc, entry) => {
      if (entry.key) {
        acc[entry.key] = entry.value;
      }
      return acc;
    }, {} as Record<string, string>);
    
    onChange(newValue);
  };

  const handleKeyChange = (index: number, newKey: string) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], key: newKey };
    setEntries(newEntries);
  };

  const handleValueChange = (index: number, newValue: string) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], value: newValue };
    setEntries(newEntries);
    
    const obj = newEntries.reduce((acc, entry) => {
      if (entry.key) {
        acc[entry.key] = entry.value;
      }
      return acc;
    }, {} as Record<string, string>);
    
    onChange(obj);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div key={index} className="space-y-2">
            {/* Key input */}
            <input
              type="text"
              placeholder="Key"
              value={entry.key}
              onChange={(e) => handleKeyChange(index, e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {/* Value input with delete button */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Value"
                value={entry.value}
                onChange={(e) => handleValueChange(index, e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => handleRemoveField(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded flex-shrink-0"
                title="Remove field"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddField}
        className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        <Plus className="w-4 h-4" />
        Add Field
      </button>
    </div>
  );
};
