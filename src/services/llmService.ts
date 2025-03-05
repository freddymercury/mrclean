import { LLMConfig, GitDiffInput, ReviewDirective, CodeReviewResult } from '@/types';

/**
 * Generate a code review using the API route
 * @param config LLM configuration
 * @param diffInput The git diff content
 * @param directive Optional review directives
 * @returns Code review result in markdown format
 */
export const generateCodeReview = async (
  config: LLMConfig,
  diffInput: GitDiffInput,
  directive?: ReviewDirective
): Promise<CodeReviewResult> => {
  try {
    const response = await fetch('/api/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        diffInput,
        directive,
        config,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate code review');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating code review:', error);
    throw error;
  }
};
