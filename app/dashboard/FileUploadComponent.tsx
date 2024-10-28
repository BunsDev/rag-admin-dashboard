import React, { useState, useCallback } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FileUploadComponent = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState(null);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFiles = [...e.dataTransfer.files];
    setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
  }, []);

  const removeFile = (fileIndex) => {
    setFiles(files => files.filter((_, index) => index !== fileIndex));
  };

  const handleFileSelect = (e) => {
    const selectedFiles = [...e.target.files];
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);

  };



  const uploadFiles = async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('http://localhost:7272/v2/ingest_files', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      console.log('Upload response:', response);
      
      const result = await response.json();

      setNotification({ type: 'success', message: 'Files uploaded successfully!' });
      setFiles([]); // Clear files after successful upload
    } catch (error) {
      console.error('Upload error:', error);
      setNotification({ type: 'error', message: 'Failed to upload files. Please try again.' });
    } finally {
      setUploading(false);
    }
  };


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Documents</CardTitle>
        
        
      </CardHeader>
      <CardContent>
        {notification && (
          <Alert className={`mb-4 ${notification.type === 'error' ? 'bg-red-50' : 'bg-green-50'}`}>
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        )}


        {/* Drop Zone */}
        <div
          onDragOver={onDragOver}
          onDrop={onDrop}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center hover:border-gray-400 transition-colors"
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-gray-600">
            Drag and drop files here, or{' '}
            <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
              browse
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div className="flex items-center space-x-2">
                  <File className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            <Button
              onClick={uploadFiles}
              disabled={uploading}
              className="w-full mt-4"
            >
              {uploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploadComponent;
