import { Client } from "../../src/client";
import { Radio } from "../../src/resources/radio";
import { Track } from "../../src/resources/track";

describe("Radio", () => {
  let client: Client;

  beforeEach(() => {
    client = new Client();
  });

  describe("properties", () => {
    it("should have all required properties", async () => {
      const radio = await client.getRadio(6); // Deezer Hits

      // Basic properties
      expect(radio.id).toBe(6);
      expect(radio.title).toBeDefined();
      expect(radio.type).toBe("radio");

      // Pictures
      expect(radio.picture).toMatch(/^https?:\/\//);
      expect(radio.picture_small).toMatch(/^https?:\/\//);
      expect(radio.picture_medium).toMatch(/^https?:\/\//);
      expect(radio.picture_big).toMatch(/^https?:\/\//);
      expect(radio.picture_xl).toMatch(/^https?:\/\//);

      // Other required properties
      expect(radio.description).toBeDefined();
      expect(radio.share).toMatch(/^https?:\/\//);
      expect(radio.tracklist).toMatch(/^https?:\/\//);
      expect(radio.md5_image).toBeDefined();
    });
  });

  describe("getTracks", () => {
    it("should get radio tracks", async () => {
      const radio = await client.getRadio(6);
      const tracks = await radio.getTracks();

      expect(Array.isArray(tracks)).toBe(true);
      expect(tracks.length).toBeGreaterThan(0);
      expect(tracks[0]).toBeInstanceOf(Track);
    });

    it("should return up to 40 tracks", async () => {
      const radio = await client.getRadio(6);
      const tracks = await radio.getTracks();

      expect(tracks.length).toBeLessThanOrEqual(40);
    });
  });
});
