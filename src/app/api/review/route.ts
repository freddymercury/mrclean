import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { GitDiffInput, ReviewDirective, CodeReviewResult } from '@/types';

// Load environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DEFAULT_LLM_MODEL = process.env.DEFAULT_LLM_MODEL || 'gpt-4o';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { diffInput, directive, config } = body;
    
    if (!diffInput || !diffInput.diffContent) {
      return NextResponse.json({ error: 'No diff content provided' }, { status: 400 });
    }
    
    // Use API key from config or environment variable
    const apiKey = config?.apiKey || OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not provided. Please set it in the configuration or as an environment variable.' },
        { status: 400 }
      );
    }
    
    // Create OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    
    // Generate the review
    const result = await generateCodeReview(openai, diffInput, directive, config?.model);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error generating code review:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while generating the code review' },
      { status: 500 }
    );
  }
}

async function generateCodeReview(
  openai: OpenAI,
  diffInput: GitDiffInput,
  directive?: ReviewDirective,
  model?: string
): Promise<CodeReviewResult> {
  const prompt = constructPrompt(diffInput, directive);
  
  const response = await openai.chat.completions.create({
    model: model || DEFAULT_LLM_MODEL || 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are an expert code reviewer. Provide detailed, constructive feedback focusing on code quality, potential bugs, security issues, and suggestions for improvement.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
  });
  
  return {
    markdown: response.choices[0]?.message?.content || 'No review generated'
  };
}

function constructPrompt(
  diffInput: GitDiffInput,
  directive?: ReviewDirective
): string {
  const { diffContent } = diffInput;
  
  let prompt = `
  Please review the following git diff and provide detailed, constructive feedback.
  Format your response in markdown with inline comments for specific lines of code.
  
  Git Diff:
  \`\`\`diff
  ${diffContent}
  \`\`\`
  `;
  
  if (directive && directive.directive) {
    prompt += `
    Additional review directives:
    ${directive.directive}
    `;
  }
  
  return prompt;
}
