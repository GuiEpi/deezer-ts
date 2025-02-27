---
title: Installation
category: Documentation
---

# Installation

deezer-ts is available as an npm package. You can install it using npm, yarn, or pnpm.

## Using npm

```bash
npm install deezer-ts
```

## Using yarn

```bash
yarn add deezer-ts
```

## Using pnpm

```bash
pnpm add deezer-ts
```

## Requirements

- Node.js 14 or later
- TypeScript 4.7 or later (if using TypeScript)

## TypeScript Configuration

If you're using TypeScript, make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
``` 