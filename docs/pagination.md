---
title: Pagination
category: Documentation
---

# Pagination

Many methods in the deezer-ts library return paginated results. The library provides a `PaginatedList` class to handle these results efficiently.

## Using PaginatedList

The `PaginatedList` class implements the async iterator protocol, allowing you to iterate through all items using a `for await...of` loop:

```typescript
const artist = await client.getArtist(27);
const albums = await artist.getAlbums();

// Iterate through all albums
for await (const album of albums) {
  console.log(album.title);
}
```

## Accessing Page Information

You can access information about the current page and total items:

```typescript
const albums = await artist.getAlbums();

console.log(albums.total);  // Total number of items
console.log(albums.limit);  // Items per page
console.log(albums.hasMore);  // Whether there are more items
```

## Manual Page Navigation

If you need more control over pagination, you can manually navigate through pages:

```typescript
const albums = await artist.getAlbums();

// Get the first page
const firstPage = await albums.items();

// Get the next page
if (albums.hasMore) {
  await albums.next();
  const secondPage = await albums.items();
}
```

## Slicing Results

You can use the `slice` method to get a specific range of items:

```typescript
const albums = await artist.getAlbums();

// Get items 10-20
const slicedAlbums = await albums.slice(10, 20);
for await (const album of slicedAlbums) {
  console.log(album.title);
}
```

## Performance Considerations

The `PaginatedList` class fetches pages on demand, which means:
- Memory usage is optimized as only one page is loaded at a time
- Network requests are made only when needed
- You can break out of iteration early without fetching unnecessary pages 