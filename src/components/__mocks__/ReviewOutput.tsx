import React from 'react';

interface ReviewOutputProps {
  markdown: string;
  isLoading: boolean;
}

const ReviewOutput: React.FC<ReviewOutputProps> = ({ markdown, isLoading }) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Review Output</h2>
      <div>{markdown}</div>
    </div>
  );
};

export default ReviewOutput;
