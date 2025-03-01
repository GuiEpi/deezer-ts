import { Client } from "../../src/client";
import { Artist } from "../../src/resources/artist";
import { Album } from "../../src/resources/album";
import { Track } from "../../src/resources/track";
import { Playlist } from "../../src/resources/playlist";
import { PaginatedList } from "../../src/pagination";

describe("Artist", () => {
  let client: Client;

  beforeEach(() => {
    client = new Client();
  });

  describe("properties", () => {
    it("should have all required properties", async () => {
      const artist = await client.getArtist(27); // Daft Punk

      // Basic properties
      expect(artist.id).toBe(27);
      expect(artist.name).toBe("Daft Punk");
      expect(artist.type).toBe("artist");

      // Pictures
      expect(artist.picture).toMatch(/^https?:\/\//);
      expect(artist.picture_small).toMatch(/^https?:\/\//);
      expect(artist.picture_medium).toMatch(/^https?:\/\//);
      expect(artist.picture_big).toMatch(/^https?:\/\//);
      expect(artist.picture_xl).toMatch(/^https?:\/\//);

      // Optional properties that should exist for this artist
      expect(artist.nb_album).toBeGreaterThan(0);
      expect(artist.nb_fan).toBeGreaterThan(0);
      expect(artist.radio).toBeDefined();
      expect(artist.tracklist).toMatch(/^https?:\/\//);
    });
  });

  describe("getTop", () => {
    it("should get top tracks", async () => {
      const artist = await client.getArtist(27);
      const tracks = await artist.getTop();

      expect(tracks).toBeInstanceOf(PaginatedList);

      const firstPage = await tracks.slice(0, 2);
      expect(firstPage.length).toBe(2);
      expect(firstPage[0]).toBeInstanceOf(Track);
      expect(firstPage[0]!.artist.id).toBe(artist.id);
    });
  });

  describe("getRelated", () => {
    it("should get related artists", async () => {
      const artist = await client.getArtist(27);
      const related = await artist.getRelated();

      expect(related).toBeInstanceOf(PaginatedList);

      const firstPage = await related.slice(0, 2);
      expect(firstPage.length).toBe(2);
      expect(firstPage[0]).toBeInstanceOf(Artist);
      expect(firstPage[0]!.id).not.toBe(artist.id);
    });
  });

  describe("getRadio", () => {
    it("should get radio tracks", async () => {
      const artist = await client.getArtist(27);
      const tracks = await artist.getRadio();

      expect(Array.isArray(tracks)).toBe(true);
      expect(tracks.length).toBeGreaterThan(0);
      expect(tracks[0]).toBeInstanceOf(Track);
    });
  });

  describe("getAlbums", () => {
    it("should get artist albums", async () => {
      const artist = await client.getArtist(27);
      const albums = await artist.getAlbums();

      expect(albums).toBeInstanceOf(PaginatedList);

      const firstPage = await albums.slice(0, 2);
      expect(firstPage.length).toBe(2);
      expect(firstPage[0]).toBeInstanceOf(Album);
      expect(firstPage[0]!.artist?.id).toBe(artist.id);
    });

    it("should support pagination", async () => {
      const artist = await client.getArtist(27);
      const albums = await artist.getAlbums({ limit: "2" });

      // Get first page
      const firstPage = await albums.slice(0, 2);
      expect(firstPage.length).toBe(2);

      // Get second page
      const secondPage = await albums.slice(2, 4);
      expect(secondPage.length).toBe(2);

      // Verify we got different albums
      expect(firstPage[0]!.id).not.toBe(secondPage[0]!.id);
      expect(firstPage[1]!.id).not.toBe(secondPage[1]!.id);
    });
  });

  describe("getPlaylists", () => {
    it("should get artist playlists", async () => {
      const artist = await client.getArtist(27);
      const playlists = await artist.getPlaylists();

      expect(playlists).toBeInstanceOf(PaginatedList);

      const firstPage = await playlists.slice(0, 2);
      expect(firstPage.length).toBe(2);
      expect(firstPage[0]).toBeInstanceOf(Playlist);
    });
  });
});
