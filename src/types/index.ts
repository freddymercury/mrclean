export interface GitDiffInput {
  diffContent: string;
}

export interface ReviewDirective {
  directive: string;
}

export interface CodeReviewResult {
  markdown: string;
}

export interface LLMConfig {
  provider: string;
  apiKey?: string;
  model?: string;
}
