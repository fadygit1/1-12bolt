import React from 'react';
import { PerformanceData } from '../types';

interface PerformanceMetricsProps {
  performance: PerformanceData;
}

export function PerformanceMetrics({ performance }: PerformanceMetricsProps) {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatSpeed = (speed: number): string => {
    if (speed >= 1e9) {
      return `${(speed / 1e9).toFixed(2)} مليار/ثانية`;
    } else if (speed >= 1e6) {
      return `${(speed / 1e6).toFixed(2)} مليون/ثانية`;
    } else if (speed >= 1e3) {
      return `${(speed / 1e3).toFixed(2)} ألف/ثانية`;
    }
    return `${speed.toFixed(2)}/ثانية`;
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
      <h3 className="font-semibold text-lg">معلومات الأداء</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {performance.cpu && (
          <div className="bg-white p-3 rounded-md shadow-sm">
            <h4 className="font-medium mb-2">CPU</h4>
            <p className="text-sm">السرعة: {formatSpeed(performance.cpu.speed)}</p>
            <p className="text-sm">العناوين المعالجة: {performance.cpu.processedAddresses.toLocaleString()}</p>
          </div>
        )}
        
        {performance.gpu && (
          <div className="bg-white p-3 rounded-md shadow-sm">
            <h4 className="font-medium mb-2">GPU</h4>
            <p className="text-sm">السرعة: {formatSpeed(performance.gpu.speed)}</p>
            <p className="text-sm">العناوين المعالجة: {performance.gpu.processedAddresses.toLocaleString()}</p>
          </div>
        )}
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">السرعة الإجمالية:</p>
            <p className="font-medium">{formatSpeed(performance.totalSpeed)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">الوقت المتبقي:</p>
            <p className="font-medium">{formatTime(performance.estimatedTimeRemaining)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">إجمالي العناوين المعالجة:</p>
            <p className="font-medium">{performance.processedAddresses.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}