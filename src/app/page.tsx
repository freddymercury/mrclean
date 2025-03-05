"use client";

import { useState, useEffect } from 'react';
import DiffInput from '@/components/DiffInput';
import DirectiveInput from '@/components/DirectiveInput';
import ReviewOutput from '@/components/ReviewOutput';
import ConfigPanel from '@/components/ConfigPanel';
import { generateCodeReview } from '@/services/llmService';
import { LLMConfig, GitDiffInput, ReviewDirective, CodeReviewResult } from '@/types';

export default function Home() {
  const [diffContent, setDiffContent] = useState<string>('');
  const [directive, setDirective] = useState<string>('');
  const [reviewResult, setReviewResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [llmConfig, setLlmConfig] = useState<LLMConfig>({
    provider: 'openai',
    apiKey: '',
    model: ''
  });

  // Load default config from environment variables on client side
  useEffect(() => {
    // Next.js public environment variables (those prefixed with NEXT_PUBLIC_)
    // would be available here, but we're using server-side env vars for security
    // The API keys will be handled by the server-side code
    setLlmConfig(prevConfig => ({
      ...prevConfig,
      provider: 'openai', // We're only supporting OpenAI in the API route for now
      model: ''
    }));
  }, []);

  const handleDiffSubmit = (diff: string) => {
    setDiffContent(diff);
    if (diff) {
      generateReview();
    }
  };

  const handleDirectiveSubmit = (newDirective: string) => {
    setDirective(newDirective);
    if (diffContent) {
      generateReview();
    }
  };

  const handleConfigChange = (config: LLMConfig) => {
    setLlmConfig(config);
    if (diffContent) {
      generateReview();
    }
  };

  const generateReview = async () => {
    if (!diffContent) {
      return;
    }

    setIsLoading(true);
    try {
      const diffInput: GitDiffInput = { diffContent };
      const directiveInput: ReviewDirective | undefined = directive ? { directive } : undefined;
      
      const result = await generateCodeReview(llmConfig, diffInput, directiveInput);
      setReviewResult(result.markdown);
    } catch (error) {
      console.error('Error generating review:', error);
      setReviewResult(`Error generating review: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Git Diff Code Review</h1>
          <p className="text-gray-600">
            Paste a git diff and get an AI-powered code review with inline comments.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ConfigPanel onConfigChange={handleConfigChange} currentConfig={llmConfig} />
            <DiffInput onDiffSubmit={handleDiffSubmit} />
            <DirectiveInput onDirectiveSubmit={handleDirectiveSubmit} />
          </div>
          <div>
            <ReviewOutput markdown={reviewResult} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
