# Chain of Thoughts

A Node.js application that uses LLM to generate chain of thought reasoning processes. The application interacts with an LLM API to break down complex problems into step-by-step thought processes.

## Features

- Interactive command-line interface
- Step-by-step reasoning process
- Configurable number of reasoning steps
- Uses environment variables for secure API configuration

## Setup

1. Clone the repository:
```bash
git clone git@github.com:bizprat/chain-of-thoughts.git
cd chain-of-thoughts
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your API credentials:
```env
LLM_API_URL=your_api_url
LLM_API_KEY=your_api_key
LLM_MODEL=your_llm_model
```

## Usage

Run the application:
```bash
node main.js
```

The program will:
1. Prompt you to enter your question or topic
2. Ask for the maximum number of reasoning steps (default: 5)
3. Generate a chain of thought response
4. After each step, ask if you want to continue to the next step

## Environment Variables

- `LLM_API_URL`: The URL for the LLM API
- `LLM_API_KEY`: Your API key for authentication
- `LLM_MODEL`: The model name to use for LLM API (e.g., meta-llama/Llama-3.3-70B-Instruct-Turbo-Free)

## Dependencies

- axios: For making HTTP requests to the LLM API
- dotenv: For loading environment variables
