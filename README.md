<div align="center">
    <a href="https://react-dot-cursor.guics.st/">
        <h1>deezer-ts</h1>
    </a>
</div>

<div align="center">
  <a href="https://www.npmjs.com/package/deezer-ts">
    <img src="https://img.shields.io/npm/v/deezer-ts" alt="NPM Version" />
  </a>
  <img src="https://github.com/GuiEpi/deezer-ts/actions/workflows/publish-package.yml/badge.svg" alt="Publish Status" />
</div>

<br />

<div align="center">
  <strong>A TypeScript wrapper for the Deezer API with full type safety and modern features.</strong>
</div>

<br />

<div align="center">
   <a href="https://guiepi.github.io/deezer-ts">Documentation</a> 
</div>

<br />

<div align="center">
  <sub>Cooked by <a href="https://github.com/GuiEpi/">Guillaume Coussot</a> 👨‍🍳</sub>
</div>

<br />

## Features

- 🎯 **Full TypeScript Support** - Complete type definitions for all API responses
- 🔄 **Automatic Pagination** - Easy iteration through paginated results
- 🚦 **Rate Limiting** - Built-in handling of Deezer's rate limits
- 🔁 **Automatic Retries** - Smart retry logic for failed requests
- 📚 **Rich Documentation** - Comprehensive guides and API reference
- 🎵 **Complete API Coverage** - Support for all Deezer public API endpoints
- ⚡ **Modern Async/Await** - Promise-based API with async iterator support
- 🛡️ **Error Handling** - Detailed error types for better error management

## Installation

```bash
# Using npm
npm install deezer-ts

# Using yarn
yarn add deezer-ts

# Using pnpm
pnpm add deezer-ts
```

## Quick Start

```typescript
import { Client } from 'deezer-ts';

// Create a client instance
const client = new Client();

// Basic usage
async function example() {
  // Get an artist
  const artist = await client.getArtist(27);  // Daft Punk
  console.log(artist.name);  // "Daft Punk"

  // Get artist's albums with pagination
  const albums = await artist.getAlbums();
  for await (const album of albums) {
    console.log(album.title);
  }

  // Search tracks with advanced parameters
  const tracks = await client.search("Discovery", true, "RANKING", {
    artist: "Daft Punk",
    album: "Discovery"
  });
}
```

## Documentation

📚 **[Full Documentation](https://guiepi.github.io/deezer-ts/)**

- [Getting Started Guide](https://guiepi.github.io/deezer-ts/documents/Usage.html)
- [Installation Guide](https://guiepi.github.io/deezer-ts/documents/Installation.html)
- [Pagination Guide](https://guiepi.github.io/deezer-ts/documents/Pagination.html)
- [API Reference](https://guiepi.github.io/deezer-ts/modules/index.html)

## Key Concepts

### Pagination

```typescript
const albums = await artist.getAlbums();

// Async iteration
for await (const album of albums) {
  console.log(album.title);
}

// Get specific items
const firstTen = await albums.slice(0, 10);
```

### Error Handling

```typescript
try {
  const artist = await client.getArtist(999999999);
} catch (error) {
  if (error instanceof DeezerNotFoundError) {
    console.log('Artist not found');
  } else if (error instanceof DeezerQuotaExceededError) {
    console.log('Rate limit exceeded, retry after 5 seconds');
  }
}
```

## Requirements

- Node.js >= 16
- TypeScript >= 5.0 (if using TypeScript)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.