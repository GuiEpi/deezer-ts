---
title: Usage
category: Documentation
---

# Usage Guide

## Getting Started

First, import and create a new instance of the `Client` class:

```typescript
import { Client } from 'deezer-ts';

const client = new Client();
```

## Basic Examples

### Getting an Artist

```typescript
const artist = await client.getArtist(27);
console.log(artist.name); // 'Daft Punk'
```

### Getting an Album

```typescript
const album = await client.getAlbum(302127);
console.log(album.title); // 'Discovery'
```

### Getting a User's Playlists

```typescript
const user = await client.getUser(2529);
const playlists = await user.getPlaylists();

// Iterate through playlists
for await (const playlist of playlists) {
  console.log(playlist.title);
}
```

## Error Handling

The library provides specific error classes for different types of errors:

```typescript
import { DeezerError, DeezerNotFoundError } from 'deezer-ts';

try {
  const artist = await client.getArtist(999999999);
} catch (error) {
  if (error instanceof DeezerNotFoundError) {
    console.log('Artist not found');
  } else if (error instanceof DeezerError) {
    console.log('An error occurred:', error.message);
  }
}
```

## Rate Limiting

The library automatically handles rate limiting by throwing a `DeezerQuotaExceededError` when the rate limit is exceeded. You can implement retry logic using this error:

```typescript
import { DeezerQuotaExceededError } from 'deezer-ts';

try {
  const artist = await client.getArtist(27);
} catch (error) {
  if (error instanceof DeezerQuotaExceededError) {
    // Wait and retry
    await new Promise(resolve => setTimeout(resolve, 1000));
    const artist = await client.getArtist(27);
  }
}
``` 