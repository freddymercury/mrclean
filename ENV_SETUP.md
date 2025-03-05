# Environment Variables Setup

## Overview
This application uses environment variables to manage configuration settings, particularly for LLM API keys. This approach enhances security by keeping sensitive information out of the codebase.

## Required Environment Variables

Create a `.env` file in the root directory of the project with the following variables:

```
# LLM API Keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# LLM Model Settings
DEFAULT_LLM_PROVIDER=openai
DEFAULT_LLM_MODEL=gpt-4o
```

## Variable Descriptions

- `OPENAI_API_KEY`: Your OpenAI API key for accessing their models
- `ANTHROPIC_API_KEY`: Your Anthropic API key for accessing Claude models
- `DEFAULT_LLM_PROVIDER`: The default LLM provider to use (options: 'openai' or 'anthropic')
- `DEFAULT_LLM_MODEL`: The default model to use (e.g., 'gpt-4o' for OpenAI or 'claude-3-opus-20240229' for Anthropic)

## Setting Up Environment Variables

1. Create a new file named `.env` in the root directory of the project
2. Copy the template above into the file
3. Replace the placeholder values with your actual API keys
4. Save the file

## Important Notes

- The `.env` file should never be committed to the repository
- Each developer needs to set up their own `.env` file locally
- For production deployment, set environment variables according to your hosting platform's instructions
