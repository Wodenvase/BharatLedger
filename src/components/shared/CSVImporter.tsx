import React, { useState } from 'react';
import { Transaction } from '../../types';
import parseBankCSV from '../../utils/csvParser';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface Props {
  onImport: (txs: Transaction[]) => void;
}

const CSVImporter: React.FC<Props> = ({ onImport }) => {
  const [count, setCount] = useState<number | null>(null);
  const [preview, setPreview] = useState<Transaction[]>([]);

  function handleFile(f: File | null) {
    if (!f) return;
    console.log('[CSVImporter] File selected:', { name: f.name, size: f.size });
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? '');
      console.log('[CSVImporter] File loaded, parsing CSV:', { fileLength: text.length, lines: text.split(/\r?\n/).length });
      const parsed = parseBankCSV(text);
      console.log('[CSVImporter] CSV parsed:', { count: parsed.length, firstTx: parsed?.[0] });
      setCount(parsed.length);
      setPreview(parsed.slice(0, 5));
      onImport(parsed);
    };
    reader.readAsText(f);
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700">Import bank CSV</label>
      <div className="mt-1 flex items-center gap-4">
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => handleFile(e.target.files ? e.target.files[0] : null)}
          className="block"
        />
        {count !== null && <span className="text-sm text-gray-600">Imported: {count}</span>}
      </div>

      {preview.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="font-medium text-gray-900 mb-2">Preview ({count} transactions)</div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {preview.map((p) => (
              <div key={p.id} className="flex justify-between items-center text-xs p-2 bg-white rounded border border-gray-200">
                <div className="flex-1">
                  <div className="text-gray-900 font-medium">{p.description}</div>
                  <div className="text-gray-500 text-xs">{formatDate(p.date)} • {p.category}</div>
                </div>
                <div className={`font-medium ${p.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {p.type === 'credit' ? '+' : '-'}{formatCurrency(p.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVImporter;
