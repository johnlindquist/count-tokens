#!/usr/bin/env bun

import { readFileSync, existsSync } from 'fs';
import { program } from 'commander';
import { get_encoding, encoding_for_model } from 'tiktoken';
import chalk from 'chalk';
import { resolve } from 'path';

program
  .name('count-tokens')
  .description('Count the number of tokens in a file using tiktoken')
  .version('1.0.0')
  .argument('<file>', 'Path to the file to analyze')
  .option('-m, --model <model>', 'OpenAI model to use for encoding', 'gpt-4')
  .option('-e, --encoding <encoding>', 'Specific encoding to use (overrides model)')
  .option('-d, --details', 'Show detailed token information')
  .option('-c, --chunks <size>', 'Split output into chunks of specified token size', parseInt)
  .action((file, options) => {
    try {
      const filePath = resolve(file);
      
      if (!existsSync(filePath)) {
        console.error(chalk.red(`Error: File "${filePath}" does not exist`));
        process.exit(1);
      }

      const content = readFileSync(filePath, 'utf-8');
      
      let encoder;
      if (options.encoding) {
        try {
          encoder = get_encoding(options.encoding);
        } catch (err) {
          console.error(chalk.red(`Error: Invalid encoding "${options.encoding}"`));
          console.error(chalk.yellow('Available encodings: gpt2, cl100k_base, o200k_base, p50k_base, p50k_edit, r50k_base'));
          process.exit(1);
        }
      } else {
        try {
          encoder = encoding_for_model(options.model);
        } catch (err) {
          console.error(chalk.red(`Error: Invalid model "${options.model}"`));
          console.error(chalk.yellow('Common models: gpt-4, gpt-3.5-turbo, text-davinci-003, text-embedding-ada-002'));
          process.exit(1);
        }
      }

      const tokens = encoder.encode(content);
      const tokenCount = tokens.length;

      console.log(chalk.cyan('File:'), filePath);
      console.log(chalk.cyan('Model/Encoding:'), options.encoding || options.model);
      console.log(chalk.green('Token count:'), chalk.bold(tokenCount.toLocaleString()));

      if (options.details) {
        const charCount = content.length;
        const ratio = charCount / tokenCount;
        console.log(chalk.cyan('Character count:'), charCount.toLocaleString());
        console.log(chalk.cyan('Chars per token:'), ratio.toFixed(2));
        
        const estimatedCost = calculateCost(tokenCount, options.model);
        if (estimatedCost) {
          console.log(chalk.cyan('Estimated cost:'), estimatedCost);
        }
      }

      if (options.chunks) {
        console.log(chalk.cyan('\nChunk breakdown:'));
        const chunkSize = options.chunks;
        const numChunks = Math.ceil(tokenCount / chunkSize);
        
        for (let i = 0; i < numChunks; i++) {
          const start = i * chunkSize;
          const end = Math.min((i + 1) * chunkSize, tokenCount);
          const percentage = ((end - start) / tokenCount * 100).toFixed(1);
          console.log(chalk.gray(`  Chunk ${i + 1}/${numChunks}: ${start}-${end} tokens (${percentage}%)`));
        }
      }

      encoder.free();
    } catch (err) {
      console.error(chalk.red('Error:'), err.message);
      process.exit(1);
    }
  });

function calculateCost(tokenCount: number, model: string): string | null {
  const costs: Record<string, { input: number, output: number }> = {
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-4-32k': { input: 0.06, output: 0.12 },
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
    'gpt-4o': { input: 0.005, output: 0.015 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  };

  const modelCost = costs[model];
  if (!modelCost) return null;

  const inputCost = (tokenCount / 1000) * modelCost.input;
  const outputCost = (tokenCount / 1000) * modelCost.output;
  
  return `$${inputCost.toFixed(4)} (input) / $${outputCost.toFixed(4)} (output)`;
}

program.parse();