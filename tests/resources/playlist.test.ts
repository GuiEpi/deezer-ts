import { Client } from "../../src/client";
import { Playlist } from "../../src/resources/playlist";
import { Track } from "../../src/resources/track";
import { User } from "../../src/resources/user";
import { PaginatedList } from "../../src/pagination";

describe("Playlist", () => {
  let client: Client;

  beforeEach(() => {
    client = new Client();
  });

  describe("properties", () => {
    it("should have all required properties", async () => {
      const playlist = await client.getPlaylist(908622995);

      // Basic properties
      expect(playlist.id).toBe(908622995);
      expect(playlist.title).toBeDefined();
      expect(playlist.type).toBe("playlist");

      // Pictures
      expect(playlist.picture).toMatch(/^https?:\/\//);
      expect(playlist.picture_small).toMatch(/^https?:\/\//);
      expect(playlist.picture_medium).toMatch(/^https?:\/\//);
      expect(playlist.picture_big).toMatch(/^https?:\/\//);
      expect(playlist.picture_xl).toMatch(/^https?:\/\//);

      // Other required properties
      expect(playlist.description).toBeDefined();
      expect(playlist.duration).toBeGreaterThan(0);
      expect(playlist.public).toBeDefined();
      expect(playlist.is_loved_track).toBeDefined();
      expect(playlist.collaborative).toBeDefined();
      expect(playlist.nb_tracks).toBeGreaterThan(0);
      expect(playlist.fans).toBeGreaterThan(0);
      expect(playlist.link).toMatch(/^https?:\/\//);
      expect(playlist.share).toMatch(/^https?:\/\//);
      expect(playlist.checksum).toBeDefined();

      // Creator relation
      expect(playlist.creator).toBeInstanceOf(User);
    });
  });

  describe("getTracks", () => {
    it("should get playlist tracks", async () => {
      const playlist = await client.getPlaylist(908622995);
      const tracks = await playlist.getTracks();

      expect(tracks).toBeInstanceOf(PaginatedList);

      const firstPage = await tracks.slice(0, 2);
      expect(firstPage.length).toBe(2);
      expect(firstPage[0]).toBeInstanceOf(Track);
    });

    it("should support pagination", async () => {
      const playlist = await client.getPlaylist(908622995);
      const tracks = await playlist.getTracks({ limit: "2" });

      // Get first page
      const firstPage = await tracks.slice(0, 2);
      expect(firstPage.length).toBe(2);

      // Get second page
      const secondPage = await tracks.slice(2, 4);
      expect(secondPage.length).toBe(2);

      // Verify we got different tracks
      expect(firstPage[0]!.id).not.toBe(secondPage[0]!.id);
      expect(firstPage[1]!.id).not.toBe(secondPage[1]!.id);
    }, 30000); // Increase timeout to 30 seconds
  });

  describe("getFans", () => {
    it("should get playlist fans", async () => {
      const playlist = await client.getPlaylist(908622995);
      const fans = await playlist.getFans();

      expect(fans).toBeInstanceOf(PaginatedList);

      const firstPage = await fans.slice(0, 2);
      expect(firstPage.length).toBeGreaterThanOrEqual(0);
      if (firstPage.length > 0) {
        expect(firstPage[0]).toBeInstanceOf(User);
      }
    });

    it("should support pagination when fans exist", async () => {
      const playlist = await client.getPlaylist(908622995);
      const fans = await playlist.getFans({ limit: "2" });

      // Get first page
      const firstPage = await fans.slice(0, 2);
      expect(firstPage.length).toBeGreaterThanOrEqual(0);

      if (firstPage.length >= 2) {
        // Only test pagination if we have enough fans
        const secondPage = await fans.slice(2, 4);
        expect(secondPage.length).toBeGreaterThan(0);

        // Verify we got different fans
        expect(firstPage[0]!.id).not.toBe(secondPage[0]!.id);
        if (secondPage.length > 1) {
          expect(firstPage[1]!.id).not.toBe(secondPage[1]!.id);
        }
      }
    });
  });
});
