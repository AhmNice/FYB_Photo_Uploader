import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Loader2, X, Check, User, Smile } from 'lucide-react';

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState({ message: '', isError: false });
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nickname: ''
  });
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    validateFile(file);
  };

  const validateFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadStatus({ message: 'Please upload an image file only', isError: true });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus({ message: 'File size exceeds 10MB limit', isError: true });
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    setSelectedFile(file);
    setUploadStatus({ message: '', isError: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setUploadStatus({ message: 'Please select an image first', isError: true });
      return;
    }

    if (!formData.name.trim()) {
      setUploadStatus({ message: 'Please enter your name', isError: true });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus({ message: 'Uploading your profile...', isError: false });

    // Simulate upload with progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);

  try {
    const formPayload = new FormData();
    formPayload.append('image', selectedFile);
    formPayload.append('name', formData.name);
    formPayload.append('nickname', formData.nickname);

    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/upload`, {
      method: 'POST',
      body: formPayload
    });

    const data = await response.json();

    if (data.success) {
      setUploadProgress(100);
      setUploadStatus({
        message: data.message,
        isError: false
      });
      // Reset form
      setFormData({ name: '', nickname: '' });
      setSelectedFile(null);
      setPreviewUrl('');
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    setUploadStatus({ message: error.message, isError: true });
  } finally {
    setIsUploading(false);
  }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    validateFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadStatus({ message: '', isError: false });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">FYB File Upload</h2>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your full name"
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Smile className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
              placeholder="Nickname (optional)"
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-700 mb-3">Profile Picture</h3>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          } mb-6`}
        >
          {previewUrl ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-32 h-32 mb-3 overflow-hidden rounded-md">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-medium text-gray-700 truncate max-w-xs">{selectedFile.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="mt-3 text-red-500 hover:text-red-700 flex items-center text-sm"
              >
                <X className="w-4 h-4 mr-1" /> Remove
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <p className="text-gray-600 font-medium">Drag & drop an image here</p>
              <p className="text-gray-500 text-sm mt-1">or click to browse</p>
              <p className="text-xs text-gray-400 mt-3">(Max 10MB, images only)</p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={!selectedFile || isUploading || !formData.name}
            className={`w-full py-2 px-4 rounded-md font-medium flex items-center justify-center ${
              !selectedFile || isUploading || !formData.name
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </button>

          {isUploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <motion.div
                  className="bg-blue-600 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">
                {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      </form>

      {uploadStatus.message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-3 rounded-md flex items-center ${
            uploadStatus.isError
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {uploadStatus.isError ? (
            <X className="w-4 h-4 mr-2" />
          ) : (
            <Check className="w-4 h-4 mr-2" />
          )}
          <span className="text-sm">{uploadStatus.message}</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FileUploader;