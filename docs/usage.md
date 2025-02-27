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

The library provides a comprehensive error handling system with specific error classes for different types of errors. Here's how to handle them effectively:

### Basic Error Handling

```typescript
import { 
  DeezerAPIException,
  DeezerNotFoundError, 
  DeezerQuotaExceededError 
} from 'deezer-ts';

try {
  const artist = await client.getArtist(999999999);
} catch (error) {
  if (error instanceof DeezerNotFoundError) {
    console.log('Artist not found');
  } else if (error instanceof DeezerAPIException) {
    console.log('An API error occurred:', error.message);
  }
}
```

### Rate Limiting

The library automatically handles rate limiting by throwing a `DeezerQuotaExceededError` when the rate limit is exceeded (50 requests per 5 seconds). Here's how to handle it:

```typescript
import { DeezerQuotaExceededError } from 'deezer-ts';

async function getArtistWithRetry(id: number, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await client.getArtist(id);
    } catch (error) {
      if (error instanceof DeezerQuotaExceededError) {
        // Wait for 5 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 5000));
        continue;
      }
      throw error; // Re-throw other errors
    }
  }
  throw new Error('Max retries exceeded');
}
```

### HTTP Errors

The library provides specific error classes for different HTTP status codes:

```typescript
import { 
  DeezerHTTPError,
  DeezerForbiddenError,
  DeezerNotFoundError,
  DeezerRetryableHTTPError 
} from 'deezer-ts';

try {
  const album = await client.getAlbum(123);
} catch (error) {
  if (error instanceof DeezerForbiddenError) {
    console.log('Access forbidden - check your permissions');
  } else if (error instanceof DeezerNotFoundError) {
    console.log('Album not found');
  } else if (error instanceof DeezerRetryableHTTPError) {
    console.log('Temporary server error - retry later');
  } else if (error instanceof DeezerHTTPError) {
    console.log('Other HTTP error:', error.message);
  }
}
```

### Error Hierarchy

The library's errors are organized in a hierarchy:

- `DeezerAPIException` (base class)
  - `DeezerRetryableException`
    - `DeezerQuotaExceededError` (rate limiting)
    - `DeezerRetryableHTTPError` (temporary server errors)
  - `DeezerHTTPError`
    - `DeezerForbiddenError` (403 errors)
    - `DeezerNotFoundError` (404 errors)
  - `DeezerErrorResponse` (API business logic errors)
  - `DeezerUnknownResource` (invalid resource types)

This hierarchy allows you to catch errors at different levels of specificity:

```typescript
try {
  // Your code here
} catch (error) {
  if (error instanceof DeezerRetryableException) {
    // Handle any retryable error (quota or temporary HTTP)
    await retry();
  } else if (error instanceof DeezerAPIException) {
    // Handle any other API error
    handleError(error);
  }
}
```

## Rate Limiting

The library automatically handles rate limiting by implementing a queue system that ensures you don't exceed Deezer's limit of 50 requests per 5 seconds. When the limit is exceeded:

1. The request is automatically queued
2. A `DeezerQuotaExceededError` is thrown
3. You can implement retry logic as shown above

For optimal performance, consider implementing your own rate limiting or caching mechanisms for high-volume requests. 