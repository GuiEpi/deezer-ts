# deezer-ts

A TypeScript wrapper for the Deezer API.

## Features

- Full TypeScript support with type definitions
- Complete coverage of the Deezer API
- Pagination support
- Rate limiting handling
- Automatic retries for failed requests
- Comprehensive documentation

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

// Get an artist
const artist = await client.getArtist(27);  // Daft Punk
console.log(artist.name);  // "Daft Punk"

// Get artist's top tracks
const topTracks = await artist.getTop();
for await (const track of topTracks) {
    console.log(track.title);
}
```

## Documentation

For detailed documentation, see:
- [Installation](docs/installation.md)
- [Usage Guide](docs/usage.md)
- [Pagination](docs/pagination.md)
- [API Reference](docs/api-reference/index.md)

## Requirements

- Node.js >= 16
- TypeScript >= 5.0 (if using TypeScript)

## License

MIT