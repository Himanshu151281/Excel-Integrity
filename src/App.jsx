import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataTable } from './components/DataTable';
import { ErrorModal } from './components/ErrorModal';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';

function App() {
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const handleFileSelect = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setSheets(result.sheets);
      setSelectedSheet(result.sheets[0]?.name || '');
      
      if (result.sheets.some(sheet => sheet.errors.length > 0)) {
        setShowErrors(true);
      }
    } catch (error) {
      toast.error('Failed to upload file');
    }
  };

  const handleDeleteRow = async (id) => {
    if (!window.confirm('Are you sure you want to delete this row?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/rows/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete row');
      }

      setSheets(sheets.map(sheet => ({
        ...sheet,
        data: sheet.data.filter(row => row.id !== id)
      })));

      toast.success('Row deleted successfully');
    } catch (error) {
      toast.error('Failed to delete row');
    }
  };

  const handleImport = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sheets })
      });

      if (!response.ok) {
        throw new Error('Failed to import data');
      }

      toast.success('Data imported successfully');
    } catch (error) {
      toast.error('Failed to import data');
    }
  };

  const currentSheet = sheets.find(s => s.name === selectedSheet);
  const allErrors = sheets.flatMap(s => s.errors);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Excel File Upload</h1>
          <FileUpload onFileSelect={handleFileSelect} />
        </div>

        {sheets.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <select
                  value={selectedSheet}
                  onChange={(e) => setSelectedSheet(e.target.value)}
                  className="rounded border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  {sheets.map(sheet => (
                    <option key={sheet.name} value={sheet.name}>
                      {sheet.name}
                    </option>
                  ))}
                </select>
                {allErrors.length > 0 && (
                  <button
                    onClick={() => setShowErrors(true)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    View Errors ({allErrors.length})
                  </button>
                )}
              </div>
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Import Data</span>
              </button>
            </div>

            {currentSheet && (
              <DataTable
                data={currentSheet.data}
                onDeleteRow={handleDeleteRow}
              />
            )}
          </div>
        )}

        <ErrorModal
          isOpen={showErrors}
          onClose={() => setShowErrors(false)}
          errors={allErrors}
        />
      </div>
    </div>
  );
}

export default App;