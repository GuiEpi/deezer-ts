import { Client } from "../../src/client";
import { Track } from "../../src/resources/track";
import { Artist } from "../../src/resources/artist";
import { Album } from "../../src/resources/album";

describe("Track", () => {
  let client: Client;

  beforeEach(() => {
    client = new Client();
  });

  describe("properties", () => {
    it("should have all required properties", async () => {
      const track = await client.getTrack(3135556);

      // Basic properties
      expect(track.id).toBe(3135556);
      expect(track.title).toBeDefined();
      expect(track.type).toBe("track");

      // Required properties
      expect(track.readable).toBeDefined();
      expect(track.title_short).toBeDefined();
      expect(track.title_version).toBeDefined();
      expect(track.duration).toBeGreaterThan(0);
      expect(track.rank).toBeGreaterThan(0);
      expect(track.explicit_lyrics).toBeDefined();
      expect(track.explicit_content_lyrics).toBeDefined();
      expect(track.explicit_content_cover).toBeDefined();
      expect(track.preview).toMatch(/^https?:\/\//);
      expect(track.md5_image).toBeDefined();

      // Optional properties that should exist for this track
      expect(track.isrc).toBeDefined();
      expect(track.link).toMatch(/^https?:\/\//);
      expect(track.share).toMatch(/^https?:\/\//);
      expect(track.track_position).toBeGreaterThan(0);
      expect(track.disk_number).toBeGreaterThan(0);
      expect(track.bpm).toBeDefined();
      expect(track.gain).toBeDefined();

      // Relations
      expect(track.artist).toBeInstanceOf(Artist);
      expect(track.album).toBeInstanceOf(Album);
    });

    it("should parse dates correctly", async () => {
      const track = await client.getTrack(3135556);

      expect(track.release_date).toBeInstanceOf(Date);
      expect(track.release_date?.getFullYear()).toBeGreaterThanOrEqual(1900);
    });
  });

  describe("getArtist", () => {
    it("should get the artist of the track", async () => {
      const track = await client.getTrack(3135556);
      const artist = await track.getArtist();

      expect(artist).toBeInstanceOf(Artist);
      expect(artist.id).toBe(track.artist.id);
      expect(artist.name).toBeDefined();
    });
  });

  describe("getAlbum", () => {
    it("should get the album of the track", async () => {
      const track = await client.getTrack(3135556);
      const album = await track.getAlbum();

      expect(album).toBeInstanceOf(Album);
      expect(album.id).toBe(track.album.id);
      expect(album.title).toBeDefined();
    });
  });
});
