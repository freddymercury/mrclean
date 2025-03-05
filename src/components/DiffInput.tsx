import React, { useState } from 'react';
import { isValidDiff } from '@/utils/diffParser';

interface DiffInputProps {
  onDiffSubmit: (diffContent: string) => void;
}

export const DiffInput: React.FC<DiffInputProps> = ({ onDiffSubmit }) => {
  const [diffContent, setDiffContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the diff content
    if (!diffContent.trim()) {
      setError('Please enter a git diff');
      return;
    }
    
    if (!isValidDiff(diffContent)) {
      setError('Invalid git diff format. Please check your input.');
      return;
    }
    
    // Clear any previous errors
    setError(null);
    
    // Submit the diff content to the parent component
    onDiffSubmit(diffContent);
  };

  return (
    <div className="w-full mb-6">
      <h2 className="text-xl font-semibold mb-2">Git Diff Input</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm"
            placeholder="Paste your git diff here..."
            value={diffContent}
            onChange={(e) => setDiffContent(e.target.value)}
            aria-label="Git diff content"
          />
        </div>
        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit Diff
        </button>
      </form>
    </div>
  );
};

export default DiffInput;
