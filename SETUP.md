# 🚀 Setup Guide - Typing Hacker

## Quick Start

```bash
# 1. Install dependencies and setup
npm run setup

# 2. Run your first test
npm start
```

## Manual Setup (if needed)

```bash
# Install dependencies
npm install

# Install browsers
npx playwright install chromium

# Generate type definitions
npx codeceptjs def

# Run tests
npm test
```

## Environment Configuration

Copy `.env.example` to `.env` and customize:

```bash
cp .env.example .env
```

### Key Settings

- `TYPING_SPEED=50` - Words per minute (30-100+)
- `TYPO_PROBABILITY=0.01` - Error rate (0.0-0.1)
- `TYPING_ROUNDS=30` - Number of sentences to type
- `HEADLESS=false` - Show browser window
- `DEBUG=false` - Enable detailed logging

## Test Commands

```bash
# Basic testing
npm start                 # Visual mode
npm run test:headless     # Headless mode
npm run test:debug        # Debug mode

# Advanced testing
npm run test:retry        # Auto-retry failed tests
npm run test:parallel     # Run in parallel

# Development
npm run dev               # Development mode
npm run validate          # Check code quality
```

## Troubleshooting

### Common Issues

**"Browser not found":**

```bash
npx playwright install chromium
```

**"TypeScript errors":**

```bash
npm run build
```

**"Environment variables not working":**

- Check your `.env` file exists
- Restart the test after making changes

### Debug Mode

```bash
DEBUG=true npm run test:debug
```

This will:

- Show detailed logging
- Take screenshots on every step
- Keep browser open for inspection

## File Structure

```text
typing-hacker/
├── tests/              # Test scenarios
├── pages/              # Page objects
├── helpers/            # Custom helpers
├── output/             # Screenshots & videos
├── reports/            # Test reports
└── .env                # Your settings
```

## Success! 🎉

If you see typing automation happening in the browser, everything is working correctly!

The test will:

1. Navigate to e-typing.ne.jp
2. Start a business typing game
3. Type automatically with human-like patterns
4. Show progress and statistics

Enjoy your automated typing! 🎯
