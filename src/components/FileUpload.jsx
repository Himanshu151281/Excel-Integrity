import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export function FileUpload({ onFileSelect }) {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    
    if (!file) return;
    
    if (!file.name.endsWith('.xlsx')) {
      toast.error('Please upload only .xlsx files');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }
    
    onFileSelect(file);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize: 2 * 1024 * 1024,
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive ? 
          'Drop the file here...' : 
          'Drag & drop an Excel file here, or click to select'
        }
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Only .xlsx files up to 2MB are supported
      </p>
    </div>
  );
}