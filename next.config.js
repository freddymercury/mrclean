/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // These will be available on the client-side
    DEFAULT_LLM_PROVIDER: process.env.DEFAULT_LLM_PROVIDER,
    DEFAULT_LLM_MODEL: process.env.DEFAULT_LLM_MODEL,
  },
  // Server-side environment variables (OPENAI_API_KEY, ANTHROPIC_API_KEY)
  // are automatically available to server components and API routes
};

module.exports = nextConfig;
