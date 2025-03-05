import { parseDiff, isValidDiff } from '../diffParser';

// Mock the diff library
jest.mock('diff', () => ({
  parsePatch: jest.fn().mockImplementation((content) => {
    if (content.includes('invalid content')) {
      throw new Error('Mock parsing error');
    }
    return [{ hunks: [] }];
  })
}));

describe('diffParser Utility', () => {
  describe('isValidDiff function', () => {
    test('returns true for valid git diff format with diff --git header', () => {
      const validDiff = `diff --git a/file.js b/file.js
index 1234567..abcdefg 100644
--- a/file.js
+++ b/file.js
@@ -1,5 +1,5 @@
-const oldCode = 'old';
+const newCode = 'new';`;
      
      expect(isValidDiff(validDiff)).toBe(true);
    });
    
    test('returns true for valid git diff format with index line', () => {
      const validDiff = `index 1234567..abcdefg 100644
--- a/file.js
+++ b/file.js
@@ -1,5 +1,5 @@
-const oldCode = 'old';
+const newCode = 'new';`;
      
      expect(isValidDiff(validDiff)).toBe(true);
    });
    
    test('returns true for valid git diff format with hunk header', () => {
      const validDiff = `--- a/file.js
+++ b/file.js
@@ -1,5 +1,5 @@
-const oldCode = 'old';
+const newCode = 'new';`;
      
      expect(isValidDiff(validDiff)).toBe(true);
    });
    
    // Negative tests
    test('returns false for empty string', () => {
      expect(isValidDiff('')).toBe(false);
    });
    
    test('returns false for whitespace-only string', () => {
      expect(isValidDiff('   \n\t   ')).toBe(false);
    });
    
    test('returns false for invalid diff format', () => {
      const invalidDiff = `This is not a valid git diff
It's just some random text
without any git diff patterns.`;
      
      expect(isValidDiff(invalidDiff)).toBe(false);
    });
  });
  
  describe('parseDiff function', () => {
    test('successfully parses valid diff content', () => {
      const validDiff = `diff --git a/file.js b/file.js
index 1234567..abcdefg 100644
--- a/file.js
+++ b/file.js
@@ -1,5 +1,5 @@
-const oldCode = 'old';
+const newCode = 'new';`;
      
      const result = parseDiff({ diffContent: validDiff });
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
    
    // Negative test
    test('returns error for invalid diff content', () => {
      // Mock console.error to avoid cluttering test output
      const originalConsoleError = console.error;
      console.error = jest.fn();
      
      try {
        // This should cause the diff library to throw an error
        const result = parseDiff({ diffContent: 'invalid content that will cause parsing error' });
        
        expect(result.success).toBe(false);
        expect(result.error).toBe('Failed to parse the git diff. Please ensure it is in a valid format.');
      } finally {
        // Restore console.error
        console.error = originalConsoleError;
      }
    });
  });
});
