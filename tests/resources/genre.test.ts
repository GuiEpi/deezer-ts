import { Client } from "../../src/client";
import { Genre } from "../../src/resources/genre";
import { Artist } from "../../src/resources/artist";
import { Podcast } from "../../src/resources/podcast";
import { Radio } from "../../src/resources/radio";
import { PaginatedList } from "../../src/pagination";

describe("Genre", () => {
  let client: Client;

  beforeEach(() => {
    client = new Client();
  });

  describe("properties", () => {
    it("should have all required properties", async () => {
      const genre = await client.getGenre(106); // Electro

      // Basic properties
      expect(genre.id).toBe(106);
      expect(genre.name).toBeDefined();
      expect(genre.type).toBe("genre");

      // Pictures
      expect(genre.picture).toMatch(/^https?:\/\//);
      expect(genre.picture_small).toMatch(/^https?:\/\//);
      expect(genre.picture_medium).toMatch(/^https?:\/\//);
      expect(genre.picture_big).toMatch(/^https?:\/\//);
      expect(genre.picture_xl).toMatch(/^https?:\/\//);
    });
  });

  describe("getArtists", () => {
    it("should get genre artists", async () => {
      const genre = await client.getGenre(106);
      const artists = await genre.getArtists();

      expect(Array.isArray(artists)).toBe(true);
      expect(artists.length).toBeGreaterThan(0);
      expect(artists[0]).toBeInstanceOf(Artist);
    });
  });

  describe("getPodcasts", () => {
    it("should get genre podcasts", async () => {
      const genre = await client.getGenre(106);
      const podcasts = await genre.getPodcasts();

      expect(podcasts).toBeInstanceOf(PaginatedList);

      const firstPage = await podcasts.slice(0, 2);
      expect(firstPage.length).toBeGreaterThanOrEqual(0);
      if (firstPage.length > 0) {
        expect(firstPage[0]).toBeInstanceOf(Podcast);
      }
    });

    it("should support pagination when podcasts exist", async () => {
      const genre = await client.getGenre(106);
      const podcasts = await genre.getPodcasts({ limit: "2" });

      // Get first page
      const firstPage = await podcasts.slice(0, 2);
      expect(firstPage.length).toBeGreaterThanOrEqual(0);

      if (firstPage.length >= 2) {
        // Only test pagination if we have enough podcasts
        const secondPage = await podcasts.slice(2, 4);
        expect(secondPage.length).toBeGreaterThan(0);

        // Verify we got different podcasts
        expect(firstPage[0].id).not.toBe(secondPage[0].id);
        if (secondPage.length > 1) {
          expect(firstPage[1].id).not.toBe(secondPage[1].id);
        }
      }
    });
  });

  describe("getRadios", () => {
    it("should get genre radios", async () => {
      const genre = await client.getGenre(106);
      const radios = await genre.getRadios();

      expect(Array.isArray(radios)).toBe(true);
      expect(radios.length).toBeGreaterThan(0);
      expect(radios[0]).toBeInstanceOf(Radio);
    });
  });
});
