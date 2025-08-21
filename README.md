# count-tokens

[![npm version](https://badge.fury.io/js/count-tokens.svg)](https://www.npmjs.com/package/count-tokens)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A simple CLI tool to count tokens in files using OpenAI's tiktoken library.

🔗 [GitHub Repository](https://github.com/johnlindquist/count-tokens)

## Installation

```bash
npm install -g count-tokens
```

or with bun:

```bash
bun add -g count-tokens
```

## Usage

```bash
count-tokens <file> [options]
```

### Options

- `-m, --model <model>` - OpenAI model to use for encoding (default: "gpt-4")
- `-e, --encoding <encoding>` - Specific encoding to use (overrides model)
- `-d, --details` - Show detailed token information including character count and cost estimates
- `-c, --chunks <size>` - Split output into chunks of specified token size
- `-h, --help` - Display help
- `-V, --version` - Display version

### Examples

Count tokens in a file using the default GPT-4 encoding:
```bash
count-tokens myfile.txt
```

Count tokens using GPT-3.5 Turbo encoding:
```bash
count-tokens myfile.txt --model gpt-3.5-turbo
```

Show detailed information including cost estimates:
```bash
count-tokens myfile.txt --details
```

Show chunk breakdown for 4096 token chunks:
```bash
count-tokens myfile.txt --chunks 4096
```

Use a specific encoding directly:
```bash
count-tokens myfile.txt --encoding cl100k_base
```

## Supported Models

- gpt-4, gpt-4-32k
- gpt-3.5-turbo
- gpt-4o, gpt-4o-mini
- text-davinci-003
- text-embedding-ada-002
- And many more OpenAI models

## Supported Encodings

- gpt2
- cl100k_base
- o200k_base
- p50k_base
- p50k_edit
- r50k_base

## Development

```bash
bun install
bun run index.ts <file>
```

## License

MIT
