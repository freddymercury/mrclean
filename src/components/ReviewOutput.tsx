import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface ReviewOutputProps {
  markdown: string;
  isLoading: boolean;
}

export const ReviewOutput: React.FC<ReviewOutputProps> = ({ markdown, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full p-6 border border-gray-300 rounded-md">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-lg">Generating code review...</span>
        </div>
      </div>
    );
  }

  if (!markdown) {
    return (
      <div className="w-full p-6 border border-gray-300 rounded-md">
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>Submit a git diff to see the code review results here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-2">Code Review Results</h2>
      <div className="p-6 border border-gray-300 rounded-md bg-white">
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ReviewOutput;
