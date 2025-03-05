import * as diff from 'diff';
import { GitDiffInput } from '@/types';

/**
 * Parse a git diff string into a structured format
 * @param diffInput The git diff content
 * @returns Parsed diff structure
 */
export const parseDiff = (diffInput: GitDiffInput): any => {
  const { diffContent } = diffInput;
  
  // Use the diff library to parse the diff content
  // This will give us a structured representation of the diff
  try {
    // Parse the diff content
    // The diff library can parse unified diffs
    const parsedDiff = diff.parsePatch(diffContent);
    
    return {
      success: true,
      data: parsedDiff,
    };
  } catch (error) {
    console.error('Error parsing diff:', error);
    return {
      success: false,
      error: 'Failed to parse the git diff. Please ensure it is in a valid format.',
    };
  }
};

/**
 * Validate if the input is a valid git diff format
 * @param diffContent The git diff content to validate
 * @returns Boolean indicating if the diff is valid
 */
export const isValidDiff = (diffContent: string): boolean => {
  if (!diffContent || diffContent.trim() === '') {
    return false;
  }
  
  // Basic validation - check for common git diff patterns
  const diffPatterns = [
    /^diff --git/m,       // Git diff header
    /^index [0-9a-f]+\.\.\.[0-9a-f]+/m, // Git index line
    /^\+\+\+ [a-zA-Z0-9\/.\-_]+/m,  // Added file marker
    /^--- [a-zA-Z0-9\/.\-_]+/m,     // Removed file marker
    /^@@ -\d+,\d+ \+\d+,\d+ @@/m   // Hunk header
  ];
  
  // Check if at least one pattern matches
  return diffPatterns.some(pattern => pattern.test(diffContent));
};
