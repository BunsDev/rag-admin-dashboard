"use client";

import React, { useState, useEffect } from 'react';
import { Trash2, Search, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FileUploadComponent from './FileUploadComponent';

const AdminDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDocumentsOverview = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/documents');
      if (!response.ok) throw new Error('Failed to fetch documents overview');
      const result = await response.json();
      // add a formatted date to each document
      const docsWithFormattedDate = result.results.map(doc => ({
        ...doc,
        formatted_date: new Date(doc.created_at).toLocaleDateString()
      }));
      setDocuments(docsWithFormattedDate);
    } catch (error) {
      console.error('Documents overview error:', error);
      setError('Failed to load documents. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    getDocumentsOverview();
  }, []);

  useEffect(() => {
    if (!showUploadModal) {
      getDocumentsOverview();
    }
  }, [showUploadModal]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/documents/${documentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete document');
      }

      // Update the documents list locally instead of refetching
      setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentId));
      setNotification('Document deleted successfully');
      
    } catch (error) {
      console.error('Delete document error:', error);
      setNotification(error.message);
    }
  };

  const handleUploadComplete = () => {
    setShowUploadModal(false);
    getDocumentsOverview(); // Refresh the document list after upload
    setNotification('Document uploaded successfully');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Document Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Notification Alert */}
          {notification && (
            <Alert className="mb-4">
              <AlertDescription>{notification}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search documents..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Button 
              onClick={() => setShowUploadModal(true)} 
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Document
            </Button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading documents...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* File Upload Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg w-full max-w-2xl">
                <FileUploadComponent onUploadComplete={handleUploadComplete} />
                <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowUploadModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Document List */}
          {!isLoading && !error && (
            <div className="space-y-4">
              {filteredDocs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No documents found matching your search.' : 'No documents available.'}
                </div>
              ) : (
                filteredDocs.map(doc => (
                  <Card key={doc.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        <p className="text-sm text-gray-500">Added: {doc.formatted_date}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteDocument(doc.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
