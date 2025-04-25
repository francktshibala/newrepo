import React, { useState } from 'react';
import axios from 'axios';

const MediaUpload = ({ vehicleId, onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [setMainImage, setSetMainImage] = useState(true);
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }
    
    setLoading(true);
    setError(null);
    setProgress(0);
    
    try {
      const formData = new FormData();
      
      // Add all files
      files.forEach(file => {
        formData.append('images', file);
      });
      
      // Add setMainImage flag
      formData.append('setMainImage', setMainImage);
      
      const token = localStorage.getItem('token');
      
      // Upload with progress tracking
      const response = await axios.post(
        `/api/media/upload/${vehicleId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        }
      );
      
      // Clear form
      setFiles([]);
      document.getElementById('imageUpload').value = '';
      
      // Call completion callback
      if (onUploadComplete) {
        onUploadComplete(response.data.media);
      }
    } catch (err) {
      console.error('Error uploading media:', err);
      setError(err.response?.data?.message || 'Failed to upload images');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Upload Vehicle Images</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="imageUpload" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Images (JPG, PNG, GIF, WEBP)
          </label>
          
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-navHoverLink file:text-white
                      hover:file:bg-accent"
          />
        </div>
        
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={setMainImage}
              onChange={(e) => setSetMainImage(e.target.checked)}
              className="rounded text-navHoverLink focus:ring-navHoverLink h-4 w-4"
            />
            <span className="ml-2 text-sm text-gray-700">
              Set first image as main display image
            </span>
          </label>
        </div>
        
        {files.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-700 mb-2">
              {files.length} {files.length === 1 ? 'file' : 'files'} selected
            </p>
            
            <ul className="text-sm text-gray-600 list-disc pl-5">
              {files.map((file, index) => (
                <li key={index}>
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {loading && (
          <div className="mb-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-navHoverLink"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Uploading... {progress}%
            </p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading || files.length === 0}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                     ${loading || files.length === 0
                       ? 'bg-gray-400 cursor-not-allowed'
                       : 'bg-navHoverLink hover:bg-accent'}`}
        >
          {loading ? 'Uploading...' : 'Upload Images'}
        </button>
      </form>
    </div>
  );
};

export default MediaUpload;