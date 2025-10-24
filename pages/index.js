import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ResultsDisplay from '../components/ResultsDisplay';

export default function Home() {
  const [formData, setFormData] = useState({
    brandName: '',
    productType: '',
    alcoholContent: '',
    netContents: '',
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }
    
    setImageFile(file);
    setError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e) => {
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

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  // Prevent files from being opened when accidentally dropped outside the drop zone
  useEffect(() => {
    const preventFileDefaults = (e) => {
      // Check if this is a file drag event
      if (e.dataTransfer && e.dataTransfer.types && e.dataTransfer.types.includes('Files')) {
        // Get the drop zone element
        const dropZoneLabel = document.querySelector('label[for="labelImage"]');
        
        // Only prevent default if not dropping on our designated drop zone
        if (!dropZoneLabel || !dropZoneLabel.contains(e.target)) {
          e.preventDefault();
        }
      }
    };

    // Prevent files from opening in browser when dropped outside the drop zone
    document.addEventListener('dragover', preventFileDefaults);
    document.addEventListener('drop', preventFileDefaults);

    return () => {
      document.removeEventListener('dragover', preventFileDefaults);
      document.removeEventListener('drop', preventFileDefaults);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResults(null);

    // Validation
    if (!formData.brandName || !formData.productType || !formData.alcoholContent) {
      setError('Please fill in all required fields (Brand Name, Product Type, and Alcohol Content)');
      return;
    }

    if (!imageFile) {
      setError('Please upload a label image');
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare form data for upload
      const uploadData = new FormData();
      uploadData.append('brandName', formData.brandName);
      uploadData.append('productType', formData.productType);
      uploadData.append('alcoholContent', formData.alcoholContent);
      uploadData.append('netContents', formData.netContents);
      uploadData.append('labelImage', imageFile);

      // Send to API
      const response = await fetch('/api/verify', {
        method: 'POST',
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setResults(data.results);
    } catch (err) {
      setError(err.message || 'An error occurred during verification. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
    setFormData({
      brandName: '',
      productType: '',
      alcoholContent: '',
      netContents: '',
    });
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <Head>
        <title>TTB Label Verifier - Alcohol Label Compliance Checker</title>
        <meta name="description" content="AI-powered alcohol label verification tool simulating TTB approval process" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            TTB Label Verifier
          </h1>
          <p className="text-lg text-gray-600">
            AI-Powered Alcohol Beverage Label Compliance Checker
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Simulates the Alcohol and Tobacco Tax and Trade Bureau (TTB) label approval process
          </p>
        </div>

        {!results ? (
          <div className="bg-white rounded-lg shadow-xl p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column: Form Fields */}
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    Product Information
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Enter the information as it should appear on the label
                  </p>

                  <div className="space-y-5">
                    {/* Brand Name */}
                    <div>
                      <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">
                        Brand Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="brandName"
                        name="brandName"
                        value={formData.brandName}
                        onChange={handleInputChange}
                        placeholder="e.g., Old Tom Distillery"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">The brand under which the product is sold</p>
                    </div>

                    {/* Product Class/Type */}
                    <div>
                      <label htmlFor="productType" className="block text-sm font-medium text-gray-700 mb-1">
                        Product Class/Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="productType"
                        name="productType"
                        value={formData.productType}
                        onChange={handleInputChange}
                        placeholder="e.g., Kentucky Straight Bourbon Whiskey, IPA, Chardonnay"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">The class, type, or style of beverage</p>
                    </div>

                    {/* Alcohol Content */}
                    <div>
                      <label htmlFor="alcoholContent" className="block text-sm font-medium text-gray-700 mb-1">
                        Alcohol Content (ABV %) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="alcoholContent"
                        name="alcoholContent"
                        value={formData.alcoholContent}
                        onChange={handleInputChange}
                        placeholder="e.g., 45"
                        step="0.1"
                        min="0"
                        max="100"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Alcohol by volume percentage (just the number)</p>
                    </div>

                    {/* Net Contents */}
                    <div>
                      <label htmlFor="netContents" className="block text-sm font-medium text-gray-700 mb-1">
                        Net Contents (Optional)
                      </label>
                      <input
                        type="text"
                        id="netContents"
                        name="netContents"
                        value={formData.netContents}
                        onChange={handleInputChange}
                        placeholder="e.g., 750 mL, 12 fl oz"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">The volume of the product</p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Image Upload */}
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    Label Image
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Upload a clear photo of the alcohol label
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label 
                        htmlFor="labelImage" 
                        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                          isDragging 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                        }`}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        {imagePreview ? (
                          <div className="relative w-full h-full">
                            <img 
                              src={imagePreview} 
                              alt="Label preview" 
                              className="w-full h-full object-contain rounded-lg"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className={`w-12 h-12 mb-3 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className={`mb-2 text-sm ${isDragging ? 'text-blue-600' : 'text-gray-500'}`}>
                              <span className="font-semibold">{isDragging ? 'Drop image here' : 'Click to upload'}</span> {!isDragging && 'or drag and drop'}
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 10MB)</p>
                          </div>
                        )}
                        <input 
                          id="labelImage" 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      {imageFile && (
                        <p className="text-sm text-gray-600 mt-2">
                          Selected: {imageFile.name}
                        </p>
                      )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Tips for Best Results
                      </h3>
                      <ul className="text-sm text-blue-900 space-y-1 ml-7">
                        <li>• Use a clear, well-lit photo</li>
                        <li>• Ensure all text is readable</li>
                        <li>• Include the full label in frame</li>
                        <li>• Avoid glare or shadows</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-4 px-6 text-white font-semibold rounded-lg shadow-lg transition-all ${
                    isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Image with AI...
                    </span>
                  ) : (
                    'Verify Label Compliance'
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <ResultsDisplay results={results} onReset={handleReset} />
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            This tool uses OCR (Optical Character Recognition) to extract text from label images and verify compliance with TTB requirements.
          </p>
          <p className="mt-2">
            The verification checks: Brand Name, Product Type, Alcohol Content, Net Contents (optional), and Government Warning Statement.
          </p>
        </div>
      </main>
    </div>
  );
}

