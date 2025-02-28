require('dotenv').config();
const axios = require('axios');
const readline = require('readline');

// Configuration for the LLM API
const LLM_API_URL = process.env.LLM_API_URL;
const LLM_API_KEY = process.env.LLM_API_KEY;
const LLM_MODEL = process.env.LLM_MODEL;

if (!LLM_API_URL || !LLM_API_KEY || !LLM_MODEL) {
  console.error(
    'Missing required environment variables. Please check your .env file'
  );
  process.exit(1);
}

// Create readline interface for command line input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to call the LLM API
async function callLLM(prompt) {
  try {
    const response = await axios.post(
      LLM_API_URL,
      {
        model: LLM_MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that thinks step by step.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${LLM_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      'Error calling LLM API:',
      error.response?.data || error.message
    );
    return null;
  }
}

// Function to generate chain of thought
async function generateChainOfThought(
  initialPrompt,
  maxSteps = 5
) {
  console.log('\n===== CHAIN OF THOUGHT PROCESS =====\n');
  console.log(`Initial prompt: ${initialPrompt}\n`);

  let currentPrompt = initialPrompt;
  let step = 1;
  let thoughts = [];

  while (step <= maxSteps) {
    console.log(`\n----- Step ${step} -----`);
    console.log('Thinking...');

    // Add instructions to think step by step and continue previous reasoning
    const promptWithInstructions =
      step === 1
        ? `Think step by step about the following: ${currentPrompt}`
        : `Continue your step by step reasoning about: ${initialPrompt}\nYour previous thoughts were: ${thoughts.join(
            '\n'
          )}`;

    const response = await callLLM(promptWithInstructions);

    if (!response) {
      console.log(
        'Failed to get a response from the LLM. Stopping chain of thought.'
      );
      break;
    }

    console.log('\nLLM Response:');
    console.log(response);

    thoughts.push(response);

    // Ask if user wants to continue to the next step
    if (step < maxSteps) {
      const continueToNextStep = await askQuestion(
        '\nContinue to next step? (y/n): '
      );
      if (continueToNextStep.toLowerCase() !== 'y') {
        console.log('\nEnding chain of thought early.');
        break;
      }
    }

    step++;
  }

  console.log('\n===== FINAL CHAIN OF THOUGHT =====\n');
  thoughts.forEach((thought, index) => {
    console.log(`Step ${index + 1}:`);
    console.log(thought);
    console.log('-------------------');
  });

  return thoughts;
}

// Helper function to ask a question and get user input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Main function to run the program
async function main() {
  try {
    console.log('===== CHAIN OF THOUGHT LLM PROGRAM =====');
    console.log(
      'This program will use an LLM to generate a chain of thought reasoning process.\n'
    );

    const initialPrompt = await askQuestion(
      'Enter your prompt: '
    );
    const maxSteps = parseInt(
      (await askQuestion(
        'Enter maximum number of reasoning steps (default: 5): '
      )) || '5'
    );

    await generateChainOfThought(initialPrompt, maxSteps);

    rl.close();
  } catch (error) {
    console.error('Error:', error);
    rl.close();
  }
}

// Run the program
main();
