import { Client } from "../../src/client";
import { Album } from "../../src/resources/album";
import { Artist } from "../../src/resources/artist";
import { Track } from "../../src/resources/track";
import { PaginatedList } from "../../src/pagination";

describe("Album", () => {
  let client: Client;

  beforeEach(() => {
    client = new Client();
  });

  describe("properties", () => {
    it("should have all required properties", async () => {
      const album = await client.getAlbum(302127);

      // Basic properties
      expect(album.id).toBe(302127);
      expect(album.title).toBeDefined();
      expect(album.type).toBe("album");

      // Cover images
      expect(album.cover).toMatch(/^https?:\/\//);
      expect(album.cover_small).toMatch(/^https?:\/\//);
      expect(album.cover_medium).toMatch(/^https?:\/\//);
      expect(album.cover_big).toMatch(/^https?:\/\//);
      expect(album.cover_xl).toMatch(/^https?:\/\//);

      // Optional properties that should exist for this album
      expect(album.genre_id).toBeDefined();
      expect(album.genres).toBeDefined();
      expect(album.label).toBeDefined();
      expect(album.nb_tracks).toBeGreaterThan(0);
      expect(album.duration).toBeGreaterThan(0);
      expect(album.fans).toBeGreaterThan(0);
      expect(album.release_date).toBeInstanceOf(Date);
      expect(album.record_type).toBeDefined();
      expect(album.available).toBeDefined();
      expect(album.tracklist).toMatch(/^https?:\/\//);
      expect(album.explicit_lyrics).toBeDefined();

      // Artist relation
      expect(album.artist).toBeInstanceOf(Artist);
    });
  });

  describe("getArtist", () => {
    it("should get the artist of the album", async () => {
      const album = await client.getAlbum(302127);
      const artist = await album.getArtist();

      expect(artist).toBeInstanceOf(Artist);
      expect(artist.id).toBe(album.artist?.id);
      expect(artist.name).toBeDefined();
    });
  });

  describe("getTracks", () => {
    it("should get tracks of the album", async () => {
      const album = await client.getAlbum(302127);
      const tracks = await album.getTracks();

      expect(tracks).toBeInstanceOf(PaginatedList);

      const firstPage = await tracks.slice(0, 2);
      expect(firstPage.length).toBe(2);
      expect(firstPage[0]).toBeInstanceOf(Track);
      expect(firstPage[0].album.id).toBe(album.id);
    });

    it("should support pagination", async () => {
      const album = await client.getAlbum(302127);
      const tracks = await album.getTracks({ limit: "2" });

      // Get first page
      const firstPage = await tracks.slice(0, 2);
      expect(firstPage.length).toBe(2);

      // Get second page
      const secondPage = await tracks.slice(2, 4);
      expect(secondPage.length).toBe(2);

      // Verify we got different tracks
      expect(firstPage[0].id).not.toBe(secondPage[0].id);
      expect(firstPage[1].id).not.toBe(secondPage[1].id);
    });
  });
});
