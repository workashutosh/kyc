import React, { useEffect, useState, useMemo, useContext } from "react";
import { Upload, Check, X, AlertCircle } from "lucide-react";
import Header from "@components/common/Header";
import LoaderComponent from "@components/common/LoaderComponent.jsx";
import { AppContext } from "@context/AppContext";

const SalesDashboard = () => {
  const [loaderActive, setLoaderActive] = useState(false);
  const [files, setFiles] = useState({
    pan: null,
    aadhaar: null
  });
  const [dragActive, setDragActive] = useState({
    pan: false,
    aadhaar: false
  });
  const [uploadStatus, setUploadStatus] = useState({
    loading: false,
    error: null
  });

  const handleDrag = (e, type, isDragging) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: isDragging }));
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0], type);
    }
  };

  const handleFile = (file, type) => {
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus({
        loading: false,
        error: "File size should be less than 10MB"
      });
      return;
    }
    setFiles(prev => ({ ...prev, [type]: file }));
    setUploadStatus({ loading: false, error: null });
  };

  const removeFile = (type) => {
    setFiles(prev => ({ ...prev, [type]: null }));
  };

  const handleSubmit = async () => {
    if (!files.pan || !files.aadhaar) return;
    
    setLoaderActive(true);
    setUploadStatus({ loading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Add your actual upload logic here
      
      setUploadStatus({ loading: false, error: null });
    } catch (error) {
      setUploadStatus({ loading: false, error: "Failed to upload documents. Please try again." });
    } finally {
      setLoaderActive(false);
    }
  };

  const renderUploadBox = (type, title) => (
    <div
      className={`relative rounded-lg border-2 border-dashed p-6 transition-all duration-200 ${
        dragActive[type] 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragEnter={(e) => handleDrag(e, type, true)}
      onDragLeave={(e) => handleDrag(e, type, false)}
      onDragOver={(e) => handleDrag(e, type, true)}
      onDrop={(e) => handleDrop(e, type)}
    >
      {!files[type] ? (
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Drop your {title} here, or{' '}
                <span className="text-blue-600 hover:text-blue-500">browse</span>
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files[0], type)}
              />
            </label>
            <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 10MB</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-600">{files[type].name}</span>
          </div>
          <button
            onClick={() => removeFile(type)}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Header />
      {loaderActive && <LoaderComponent />}
      <main className="bg-gray-50 min-h-screen">
        <section className="container mx-auto p-6">
          {/* Welcome Section */}
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
            <div className="border-b pb-4">
              <h1 className="text-lg font-semibold text-gray-800">
                Welcome to Trade With Market
              </h1>
            </div>
            <div className="mt-4 flex items-center">
              <p className="text-gray-600 font-medium">KYC Status:</p>
              <span className="ml-2 text-green-600 text-sm font-bold">Approved</span>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="bg-white shadow-sm rounded-lg p-6 mt-8 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Documents</h2>
            
            {uploadStatus.error && (
              <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-center text-red-700">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{uploadStatus.error}</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  PAN Card
                </label>
                {renderUploadBox('pan', 'PAN Card')}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Aadhaar Card
                </label>
                {renderUploadBox('aadhaar', 'Aadhaar Card')}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!files.pan || !files.aadhaar || uploadStatus.loading}
              className={`mt-6 w-full sm:w-auto px-4 py-2 rounded-md font-semibold transition-all duration-200 
                ${files.pan && files.aadhaar && !uploadStatus.loading
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              {uploadStatus.loading ? 'Uploading...' : 'Submit Documents To Proceed Further'}
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default SalesDashboard;