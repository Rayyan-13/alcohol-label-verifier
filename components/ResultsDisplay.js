import React from 'react';

export default function ResultsDisplay({ results, onReset }) {
  if (!results) return null;

  const { overallMatch, checks } = results;

  return (
    <div className="mt-8 w-full max-w-4xl">
      {/* Overall Status */}
      <div className={`p-6 rounded-lg ${overallMatch ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`text-4xl ${overallMatch ? 'text-green-600' : 'text-red-600'}`}>
              {overallMatch ? '✓' : '✗'}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {overallMatch ? 'Label Approved' : 'Label Verification Failed'}
              </h2>
              <p className="text-gray-700">
                {overallMatch 
                  ? 'The label matches the form data. All required information is consistent.'
                  : 'The label does not match the form data. Please review the discrepancies below.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Checks */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Verification Details</h3>
        <div className="space-y-4">
          {checks.map((check, index) => (
            <div key={index} className="border-l-4 pl-4 py-2" style={{
              borderColor: check.match ? '#10b981' : '#ef4444'
            }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl ${check.match ? 'text-green-600' : 'text-red-600'}`}>
                      {check.match ? '✓' : '✗'}
                    </span>
                    <h4 className="font-semibold text-lg">{check.field}</h4>
                  </div>
                  <div className="mt-2 ml-8 space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Expected:</span> {check.expected || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Found on Label:</span>{' '}
                      <span className={check.match ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                        {check.found === true ? 'Yes' : check.found === false ? 'No' : check.found || 'Not found'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extracted Text Preview */}
      {results.extractedText && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <details className="cursor-pointer">
            <summary className="font-semibold text-gray-700 mb-2">
              View Extracted Text from Label (OCR Output)
            </summary>
            <pre className="text-xs bg-white p-4 rounded border border-gray-200 mt-2 overflow-auto max-h-64 whitespace-pre-wrap">
              {results.extractedText}
            </pre>
          </details>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Verify Another Label
        </button>
      </div>
    </div>
  );
}

