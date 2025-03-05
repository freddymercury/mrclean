import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { generateCodeReview } from '@/services/llmService';

// Mock the components that use problematic dependencies
jest.mock('@/components/ReviewOutput', () => {
  return function MockReviewOutput({ markdown, isLoading }: { markdown: string; isLoading: boolean }) {
    return (
      <div>
        <h2>Review Output</h2>
        {isLoading ? <div>Loading...</div> : <div>{markdown}</div>}
      </div>
    );
  };
});

// Mock the llmService
jest.mock('@/services/llmService', () => ({
  generateCodeReview: jest.fn().mockResolvedValue({ markdown: 'Mocked review content' }),
}));

// Import the Home component after mocking its dependencies
import Home from '../page';

describe('Home Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders the page with all components', () => {
    render(<Home />);
    
    // Check for main elements
    expect(screen.getByText('Git Diff Code Review')).toBeInTheDocument();
    expect(screen.getByText('Paste a git diff and get an AI-powered code review with inline comments.')).toBeInTheDocument();
    
    // Check for the main components
    expect(screen.getByText('LLM Configuration')).toBeInTheDocument(); // ConfigPanel
    expect(screen.getByText('Git Diff Input')).toBeInTheDocument(); // DiffInput
    expect(screen.getByText('Review Directives (Optional)')).toBeInTheDocument(); // DirectiveInput
    expect(screen.getByText('Review Output')).toBeInTheDocument(); // ReviewOutput
  });

  it('calls generateCodeReview when diff is submitted', async () => {
    render(<Home />);
    
    // Find the diff textarea and submit button
    const diffTextarea = screen.getByPlaceholderText('Paste your git diff here...');
    const submitButton = screen.getByRole('button', { name: 'Submit Diff' });
    
    // Enter diff content and submit
    fireEvent.change(diffTextarea, { target: { value: 'Test diff content' } });
    fireEvent.click(submitButton);
    
    // Check if generateCodeReview was called with the right parameters
    await waitFor(() => {
      expect(generateCodeReview).toHaveBeenCalledWith(
        expect.objectContaining({ provider: 'openai' }),
        { diffContent: 'Test diff content' },
        undefined
      );
    });
    
    // Check if the review result is displayed
    await waitFor(() => {
      expect(screen.getByText('Mocked review content')).toBeInTheDocument();
    });
  });

  it('includes directive when provided', async () => {
    render(<Home />);
    
    // Find the diff textarea, directive textarea, and submit buttons
    const diffTextarea = screen.getByPlaceholderText('Paste your git diff here...');
    const diffSubmitButton = screen.getByRole('button', { name: 'Submit Diff' });
    const directiveTextarea = screen.getByLabelText('Review directives');
    const directiveSubmitButton = screen.getByRole('button', { name: 'Apply Directives' });
    
    // Enter diff content and submit
    fireEvent.change(diffTextarea, { target: { value: 'Test diff content' } });
    fireEvent.click(diffSubmitButton);
    
    // Enter directive and submit
    fireEvent.change(directiveTextarea, { target: { value: 'Test directive' } });
    fireEvent.click(directiveSubmitButton);
    
    // Check if generateCodeReview was called with the right parameters including the directive
    await waitFor(() => {
      expect(generateCodeReview).toHaveBeenCalledWith(
        expect.objectContaining({ provider: 'openai' }),
        { diffContent: 'Test diff content' },
        { directive: 'Test directive' }
      );
    });
  });
});
