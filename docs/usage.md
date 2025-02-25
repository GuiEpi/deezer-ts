# Usage

Initialize the client and start making requests to the Deezer API.

```typescript
import { Client } from 'deezer-ts';

const client = new Client();

async function main() {
  // Get an album by ID
  const album = await client.getAlbum(302127);
  console.log(album.title); // "Discovery"
  
  // Get all tracks in the album
  const tracks = await album.getTracks();
  for (const track of tracks.items) {
    console.log(track.title);
  }
}

main().catch(console.error);
```