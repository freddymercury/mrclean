import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DirectiveInput from '../DirectiveInput';

describe('DirectiveInput Component', () => {
  const mockOnDirectiveSubmit = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders correctly with all elements', () => {
    render(<DirectiveInput onDirectiveSubmit={mockOnDirectiveSubmit} />);
    
    expect(screen.getByText('Review Directives (Optional)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter specific review directives or focus areas/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply Directives' })).toBeInTheDocument();
  });
  
  test('handles input change correctly', () => {
    render(<DirectiveInput onDirectiveSubmit={mockOnDirectiveSubmit} />);
    
    const textarea = screen.getByPlaceholderText(/Enter specific review directives or focus areas/);
    fireEvent.change(textarea, { target: { value: 'Focus on security issues' } });
    
    expect(textarea).toHaveValue('Focus on security issues');
  });
  
  test('submits directive content successfully', () => {
    render(<DirectiveInput onDirectiveSubmit={mockOnDirectiveSubmit} />);
    
    const textarea = screen.getByPlaceholderText(/Enter specific review directives or focus areas/);
    const submitButton = screen.getByRole('button', { name: 'Apply Directives' });
    
    fireEvent.change(textarea, { target: { value: 'Focus on security issues' } });
    fireEvent.click(submitButton);
    
    expect(mockOnDirectiveSubmit).toHaveBeenCalledWith('Focus on security issues');
  });
  
  // Test with empty directive (edge case, not negative)
  test('submits empty directive successfully', () => {
    render(<DirectiveInput onDirectiveSubmit={mockOnDirectiveSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: 'Apply Directives' });
    
    fireEvent.click(submitButton);
    
    // Should still call the submit function with empty string
    expect(mockOnDirectiveSubmit).toHaveBeenCalledWith('');
  });
});
