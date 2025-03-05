import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DiffInput from '../DiffInput';
import { isValidDiff } from '@/utils/diffParser';

// Mock the diffParser utility
jest.mock('@/utils/diffParser', () => ({
  isValidDiff: jest.fn(),
}));

describe('DiffInput Component', () => {
  const mockOnDiffSubmit = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders correctly with all elements', () => {
    render(<DiffInput onDiffSubmit={mockOnDiffSubmit} />);
    
    expect(screen.getByText('Git Diff Input')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Paste your git diff here...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit Diff' })).toBeInTheDocument();
  });
  
  test('handles input change correctly', () => {
    render(<DiffInput onDiffSubmit={mockOnDiffSubmit} />);
    
    const textarea = screen.getByPlaceholderText('Paste your git diff here...');
    fireEvent.change(textarea, { target: { value: 'Test diff content' } });
    
    expect(textarea).toHaveValue('Test diff content');
  });
  
  test('submits valid diff content successfully', () => {
    // Mock isValidDiff to return true
    (isValidDiff as jest.Mock).mockReturnValue(true);
    
    render(<DiffInput onDiffSubmit={mockOnDiffSubmit} />);
    
    const textarea = screen.getByPlaceholderText('Paste your git diff here...');
    const submitButton = screen.getByRole('button', { name: 'Submit Diff' });
    
    fireEvent.change(textarea, { target: { value: 'Valid diff content' } });
    fireEvent.click(submitButton);
    
    expect(isValidDiff).toHaveBeenCalledWith('Valid diff content');
    expect(mockOnDiffSubmit).toHaveBeenCalledWith('Valid diff content');
  });
  
  // Negative test case: empty input
  test('shows error for empty diff content', () => {
    render(<DiffInput onDiffSubmit={mockOnDiffSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: 'Submit Diff' });
    
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Please enter a git diff')).toBeInTheDocument();
    expect(mockOnDiffSubmit).not.toHaveBeenCalled();
  });
  
  // Negative test case: invalid diff format
  test('shows error for invalid diff format', () => {
    // Mock isValidDiff to return false
    (isValidDiff as jest.Mock).mockReturnValue(false);
    
    render(<DiffInput onDiffSubmit={mockOnDiffSubmit} />);
    
    const textarea = screen.getByPlaceholderText('Paste your git diff here...');
    const submitButton = screen.getByRole('button', { name: 'Submit Diff' });
    
    fireEvent.change(textarea, { target: { value: 'Invalid diff content' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Invalid git diff format. Please check your input.')).toBeInTheDocument();
    expect(mockOnDiffSubmit).not.toHaveBeenCalled();
  });
});
