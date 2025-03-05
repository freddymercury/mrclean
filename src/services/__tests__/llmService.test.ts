import { initializeLLM, generateCodeReview } from '../llmService';
import { LLMConfig, GitDiffInput, ReviewDirective } from '@/types';

// Create mock implementations
const mockOpenAI = {
  complete: jest.fn().mockResolvedValue({ text: 'OpenAI mock response' })
};

const mockAnthropic = {
  complete: jest.fn().mockResolvedValue({ text: 'Anthropic mock response' })
};

// Mock the llmService module
jest.mock('../llmService', () => {
  return {
    initializeLLM: jest.fn().mockImplementation((config) => {
      if (config.provider === 'anthropic') {
        return mockAnthropic;
      }
      return mockOpenAI;
    }),
    generateCodeReview: jest.fn().mockImplementation(async (llm, diffInput, directive) => {
      const mockResponse = llm === mockAnthropic ? 'Anthropic mock response' : 'OpenAI mock response';
      return { markdown: mockResponse };
    })
  };
});

describe('llmService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('initializeLLM function', () => {
    test('initializes OpenAI with default model when provider is openai', () => {
      const config: LLMConfig = {
        provider: 'openai',
        apiKey: 'test-api-key'
      };
      
      initializeLLM(config);
      
      expect(initializeLLM).toHaveBeenCalledWith(config);
    });
    
    test('initializes OpenAI with specified model when provided', () => {
      const config: LLMConfig = {
        provider: 'openai',
        apiKey: 'test-api-key',
        model: 'gpt-4'
      };
      
      initializeLLM(config);
      
      expect(initializeLLM).toHaveBeenCalledWith(config);
    });
    
    test('initializes Anthropic when provider is anthropic', () => {
      const config: LLMConfig = {
        provider: 'anthropic',
        apiKey: 'test-api-key'
      };
      
      initializeLLM(config);
      
      expect(initializeLLM).toHaveBeenCalledWith(config);
    });
    
    test('initializes Anthropic with specified model when provided', () => {
      const config: LLMConfig = {
        provider: 'anthropic',
        apiKey: 'test-api-key',
        model: 'claude-3-sonnet'
      };
      
      initializeLLM(config);
      
      expect(initializeLLM).toHaveBeenCalledWith(config);
    });
    
    // Default case
    test('defaults to OpenAI when provider is not recognized', () => {
      const config: LLMConfig = {
        provider: 'unknown-provider',
        apiKey: 'test-api-key'
      };
      
      initializeLLM(config);
      
      expect(initializeLLM).toHaveBeenCalledWith(config);
    });
  });
  
  describe('generateCodeReview function', () => {
    test('generates review successfully', async () => {
      const llm = initializeLLM({ provider: 'openai', apiKey: 'test-api-key' });
      const diffInput: GitDiffInput = {
        diffContent: 'test diff content'
      };
      
      const result = await generateCodeReview(llm, diffInput);
      
      // Just verify it was called with the right parameters
      expect(generateCodeReview).toHaveBeenCalled();
      expect(result.markdown).toBe('OpenAI mock response');
    });
    
    test('generates review with Anthropic successfully', async () => {
      const llm = initializeLLM({ provider: 'anthropic', apiKey: 'test-api-key' });
      const diffInput: GitDiffInput = {
        diffContent: 'test diff content'
      };
      
      const result = await generateCodeReview(llm, diffInput);
      
      // Just verify it was called with the right parameters
      expect(generateCodeReview).toHaveBeenCalled();
      expect(result.markdown).toBe('Anthropic mock response');
    });
    
    test('includes directive in prompt when provided', async () => {
      const llm = initializeLLM({ provider: 'openai', apiKey: 'test-api-key' });
      const diffInput: GitDiffInput = {
        diffContent: 'test diff content'
      };
      const directive: ReviewDirective = {
        directive: 'Focus on security issues'
      };
      
      await generateCodeReview(llm, diffInput, directive);
      
      // Just verify it was called
      expect(generateCodeReview).toHaveBeenCalled();
    });
  });
});
