import React, { useState } from 'react';

interface DirectiveInputProps {
  onDirectiveSubmit: (directive: string) => void;
}

export const DirectiveInput: React.FC<DirectiveInputProps> = ({ onDirectiveSubmit }) => {
  const [directive, setDirective] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDirectiveSubmit(directive);
  };

  return (
    <div className="w-full mb-6">
      <h2 className="text-xl font-semibold mb-2">Review Directives (Optional)</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-md font-sans text-sm"
            placeholder="Enter specific review directives or focus areas (e.g., 'Focus on security issues' or 'Check for performance optimizations')..."
            value={directive}
            onChange={(e) => setDirective(e.target.value)}
            aria-label="Review directives"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Apply Directives
        </button>
      </form>
    </div>
  );
};

export default DirectiveInput;
