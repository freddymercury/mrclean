import React from 'react';
import { render, screen } from '@testing-library/react';
import ReviewOutput from '../ReviewOutput';

// Mock the react-markdown component
jest.mock('react-markdown', () => {
  return function MockMarkdown({ children }: { children: string }) {
    return <div data-testid="markdown-content">{children}</div>;
  };
});

// Mock the plugins
jest.mock('remark-gfm', () => () => {});
jest.mock('rehype-raw', () => () => {});
jest.mock('rehype-sanitize', () => () => {});

describe('ReviewOutput Component', () => {
  test('renders loading state correctly', () => {
    render(<ReviewOutput markdown="" isLoading={true} />);
    
    expect(screen.getByText('Generating code review...')).toBeInTheDocument();
    expect(screen.queryByTestId('markdown-content')).not.toBeInTheDocument();
  });
  
  test('renders empty state correctly', () => {
    render(<ReviewOutput markdown="" isLoading={false} />);
    
    expect(screen.getByText('Submit a git diff to see the code review results here.')).toBeInTheDocument();
    expect(screen.queryByTestId('markdown-content')).not.toBeInTheDocument();
  });
  
  test('renders markdown content correctly', () => {
    const mockMarkdown = '# Code Review\n\nThis is a test review';
    render(<ReviewOutput markdown={mockMarkdown} isLoading={false} />);
    
    expect(screen.getByText('Code Review Results')).toBeInTheDocument();
    const markdownElement = screen.getByTestId('markdown-content');
    expect(markdownElement).toBeInTheDocument();
    expect(markdownElement.textContent).toBe(mockMarkdown);
  });
  
  // Negative test: passing null markdown
  test('handles null markdown gracefully', () => {
    // @ts-ignore - intentionally testing incorrect usage
    render(<ReviewOutput markdown={null} isLoading={false} />);
    
    // Should show the empty state message
    expect(screen.getByText('Submit a git diff to see the code review results here.')).toBeInTheDocument();
  });
  
  // Edge case: passing very long markdown
  test('renders long markdown content correctly', () => {
    const longMarkdown = '#'.repeat(100) + ' Very long content';
    render(<ReviewOutput markdown={longMarkdown} isLoading={false} />);
    
    const markdownElement = screen.getByTestId('markdown-content');
    expect(markdownElement).toBeInTheDocument();
    expect(markdownElement.textContent).toBe(longMarkdown);
  });
});
