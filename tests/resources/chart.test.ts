import { Client } from "../../src/client";
import { Chart } from "../../src/resources/chart";
import { Track } from "../../src/resources/track";
import { Album } from "../../src/resources/album";
import { Artist } from "../../src/resources/artist";
import { Playlist } from "../../src/resources/playlist";
import { Podcast } from "../../src/resources/podcast";
import { PaginatedList } from "../../src/pagination";

describe("Chart", () => {
  let client: Client;

  beforeEach(() => {
    client = new Client();
  });

  describe("properties", () => {
    it("should have all required properties", async () => {
      const chart = await client.getChart();

      // Basic properties
      expect(chart.type).toBe("chart");

      // Arrays of resources
      expect(Array.isArray(chart.tracks)).toBe(true);
      expect(Array.isArray(chart.albums)).toBe(true);
      expect(Array.isArray(chart.artists)).toBe(true);
      expect(Array.isArray(chart.playlists)).toBe(true);
      expect(Array.isArray(chart.podcasts)).toBe(true);

      // Check if arrays contain the right types
      if (chart.tracks.length > 0) {
        expect(chart.tracks[0]).toBeInstanceOf(Track);
      }
      if (chart.albums.length > 0) {
        expect(chart.albums[0]).toBeInstanceOf(Album);
      }
      if (chart.artists.length > 0) {
        expect(chart.artists[0]).toBeInstanceOf(Artist);
      }
      if (chart.playlists.length > 0) {
        expect(chart.playlists[0]).toBeInstanceOf(Playlist);
      }
      if (chart.podcasts.length > 0) {
        expect(chart.podcasts[0]).toBeInstanceOf(Podcast);
      }
    });
  });

  describe("getTracks", () => {
    it("should get tracks chart", async () => {
      const chart = await client.getChart();
      const tracks = await chart.getTracks();

      expect(tracks).toBeInstanceOf(PaginatedList);

      const firstPage = await tracks.slice(0, 2);
      expect(firstPage.length).toBe(2);
      expect(firstPage[0]).toBeInstanceOf(Track);
    });

    it("should support pagination", async () => {
      const chart = await client.getChart();
      const tracks = await chart.getTracks({ limit: "1" });

      const total = await tracks.total();
      expect(total).not.toBeNull();

      if (total !== null) {
        expect(total).toBeGreaterThan(0);

        // Get first page
        const firstPage = await tracks.slice(0, 1);
        expect(firstPage.length).toBe(1);
        expect(firstPage[0]).toBeInstanceOf(Track);

        // Get second page if there are enough items
        if (total > 1) {
          const secondPage = await tracks.slice(1, 2);
          expect(secondPage.length).toBe(1);
          expect(secondPage[0]).toBeInstanceOf(Track);
          expect(firstPage[0].id).not.toBe(secondPage[0].id);
        }
      }
    });
  });

  describe("getAlbums", () => {
    it("should get albums chart", async () => {
      const chart = await client.getChart();
      const albums = await chart.getAlbums();

      expect(albums).toBeInstanceOf(PaginatedList);

      const firstPage = await albums.slice(0, 2);
      expect(firstPage.length).toBe(2);
      expect(firstPage[0]).toBeInstanceOf(Album);
    });
  });

  describe("getArtists", () => {
    it("should get artists chart", async () => {
      const chart = await client.getChart();
      const artists = await chart.getArtists();

      expect(artists).toBeInstanceOf(PaginatedList);

      const firstPage = await artists.slice(0, 2);
      expect(firstPage.length).toBe(2);
      expect(firstPage[0]).toBeInstanceOf(Artist);
    });
  });

  describe("getPlaylists", () => {
    it("should get playlists chart", async () => {
      const chart = await client.getChart();
      const playlists = await chart.getPlaylists();

      expect(playlists).toBeInstanceOf(PaginatedList);

      const firstPage = await playlists.slice(0, 2);
      expect(firstPage.length).toBe(2);
      expect(firstPage[0]).toBeInstanceOf(Playlist);
    });
  });

  describe("getPodcasts", () => {
    it("should get podcasts chart", async () => {
      const chart = await client.getChart();
      const podcasts = await chart.getPodcasts();

      expect(podcasts).toBeInstanceOf(PaginatedList);

      const firstPage = await podcasts.slice(0, 2);
      expect(firstPage.length).toBe(2);
      expect(firstPage[0]).toBeInstanceOf(Podcast);
    });
  });
});
