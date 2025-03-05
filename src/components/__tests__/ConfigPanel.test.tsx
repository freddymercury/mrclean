import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfigPanel from '../ConfigPanel';
import { LLMConfig } from '@/types';

describe('ConfigPanel Component', () => {
  const mockOnConfigChange = jest.fn();
  const defaultConfig: LLMConfig = {
    provider: 'openai',
    apiKey: '',
    model: ''
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders closed panel correctly', () => {
    render(<ConfigPanel onConfigChange={mockOnConfigChange} currentConfig={defaultConfig} />);
    
    expect(screen.getByText('LLM Configuration')).toBeInTheDocument();
    // Panel is closed initially, so the form elements shouldn't be visible
    expect(screen.queryByText('API Key')).not.toBeInTheDocument();
  });
  
  test('opens panel when button is clicked', () => {
    render(<ConfigPanel onConfigChange={mockOnConfigChange} currentConfig={defaultConfig} />);
    
    const toggleButton = screen.getByText('LLM Configuration');
    fireEvent.click(toggleButton);
    
    // Now the panel should be open with form elements visible
    expect(screen.getByText('LLM Provider')).toBeInTheDocument();
    expect(screen.getByText('API Key')).toBeInTheDocument();
    expect(screen.getByText('Model (Optional)')).toBeInTheDocument();
  });
  
  test('displays current config values', () => {
    const customConfig: LLMConfig = {
      provider: 'anthropic',
      apiKey: 'test-api-key',
      model: 'test-model'
    };
    
    render(<ConfigPanel onConfigChange={mockOnConfigChange} currentConfig={customConfig} />);
    
    const toggleButton = screen.getByText('LLM Configuration');
    fireEvent.click(toggleButton);
    
    // Get the select element and check its value
    const providerSelect = screen.getByRole('combobox') as HTMLSelectElement;
    expect(providerSelect.value).toBe('anthropic');
    
    // Get the input elements and check their values
    const apiKeyInput = screen.getByPlaceholderText('Enter your API key') as HTMLInputElement;
    expect(apiKeyInput.value).toBe('test-api-key');
    
    const modelInput = screen.getByRole('textbox') as HTMLInputElement;
    expect(modelInput.value).toBe('test-model');
  });
  
  test('updates config values and submits correctly', () => {
    render(<ConfigPanel onConfigChange={mockOnConfigChange} currentConfig={defaultConfig} />);
    
    const toggleButton = screen.getByText('LLM Configuration');
    fireEvent.click(toggleButton);
    
    // Change provider
    const providerSelect = screen.getByRole('combobox');
    fireEvent.change(providerSelect, { target: { value: 'anthropic' } });
    
    // Add API key
    const apiKeyInput = screen.getByPlaceholderText('Enter your API key');
    fireEvent.change(apiKeyInput, { target: { value: 'new-api-key' } });
    
    // Add model
    const modelInput = screen.getByRole('textbox');
    fireEvent.change(modelInput, { target: { value: 'claude-3' } });
    
    // Submit form
    const saveButton = screen.getByText('Save Configuration');
    fireEvent.click(saveButton);
    
    // Verify onConfigChange was called with updated values
    expect(mockOnConfigChange).toHaveBeenCalledWith({
      provider: 'anthropic',
      apiKey: 'new-api-key',
      model: 'claude-3'
    });
    
    // Panel should be closed after saving
    expect(screen.queryByText('API Key')).not.toBeInTheDocument();
  });
  
  test('closes panel without saving when cancel is clicked', () => {
    render(<ConfigPanel onConfigChange={mockOnConfigChange} currentConfig={defaultConfig} />);
    
    const toggleButton = screen.getByText('LLM Configuration');
    fireEvent.click(toggleButton);
    
    // Change some values
    const apiKeyInput = screen.getByPlaceholderText('Enter your API key');
    fireEvent.change(apiKeyInput, { target: { value: 'test-key' } });
    
    // Click cancel
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    // Panel should be closed
    expect(screen.queryByText('API Key')).not.toBeInTheDocument();
    
    // onConfigChange should not have been called
    expect(mockOnConfigChange).not.toHaveBeenCalled();
  });
  
  // Negative test: empty API key
  test('allows submission with empty API key', () => {
    render(<ConfigPanel onConfigChange={mockOnConfigChange} currentConfig={defaultConfig} />);
    
    const toggleButton = screen.getByText('LLM Configuration');
    fireEvent.click(toggleButton);
    
    // Change provider only
    const providerSelect = screen.getByRole('combobox');
    fireEvent.change(providerSelect, { target: { value: 'anthropic' } });
    
    // Submit form
    const saveButton = screen.getByText('Save Configuration');
    fireEvent.click(saveButton);
    
    // Should still call onConfigChange with empty API key
    expect(mockOnConfigChange).toHaveBeenCalledWith({
      provider: 'anthropic',
      apiKey: '',
      model: ''
    });
  });
});
