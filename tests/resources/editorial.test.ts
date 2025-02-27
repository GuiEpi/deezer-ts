import { Client } from "../../src/client";
import { Editorial } from "../../src/resources/editorial";
import { Album } from "../../src/resources/album";
import { Chart } from "../../src/resources/chart";
import { PaginatedList } from "../../src/pagination";

describe("Editorial", () => {
  let client: Client;

  beforeEach(() => {
    client = new Client();
  });

  describe("properties", () => {
    it("should have all required properties", async () => {
      const editorial = await client.getEditorial(0); // Main editorial

      // Basic properties
      expect(editorial.type).toBe("editorial");
      expect(editorial.name).toBe("All");

      // Pictures
      expect(editorial.picture).toMatch(/^https?:\/\//);
      expect(editorial.picture_small).toMatch(/^https?:\/\//);
      expect(editorial.picture_medium).toMatch(/^https?:\/\//);
      expect(editorial.picture_big).toMatch(/^https?:\/\//);
      expect(editorial.picture_xl).toMatch(/^https?:\/\//);
    });
  });

  describe("getSelection", () => {
    it("should get selection albums", async () => {
      const editorial = await client.getEditorial(0);
      const albums = await editorial.getSelection();

      expect(Array.isArray(albums)).toBe(true);
      expect(albums.length).toBeGreaterThan(0);
      expect(albums[0]).toBeInstanceOf(Album);
    });
  });

  describe("getChart", () => {
    it("should get editorial chart", async () => {
      const editorial = await client.getEditorial(0);
      const chart = await editorial.getChart();

      expect(chart).toBeInstanceOf(Chart);
      expect(chart.tracks.length).toBeGreaterThan(0);
      expect(chart.albums.length).toBeGreaterThan(0);
      expect(chart.artists.length).toBeGreaterThan(0);
      expect(chart.playlists.length).toBeGreaterThan(0);
    });
  });

  describe("getReleases", () => {
    it("should get new releases", async () => {
      const editorial = await client.getEditorial(0);
      const releases = await editorial.getReleases({});

      expect(releases).toBeInstanceOf(PaginatedList);

      const firstPage = await releases.slice(0, 2);
      expect(firstPage.length).toBe(2);
      expect(firstPage[0]).toBeInstanceOf(Album);
    });

    it("should support pagination", async () => {
      const editorial = await client.getEditorial(0);
      const releases = await editorial.getReleases({ limit: "2" });

      // Get first page
      const firstPage = await releases.slice(0, 2);
      expect(firstPage.length).toBe(2);

      // Get second page
      const secondPage = await releases.slice(2, 4);
      expect(secondPage.length).toBe(2);

      // Verify we got different releases
      expect(firstPage[0].id).not.toBe(secondPage[0].id);
      expect(firstPage[1].id).not.toBe(secondPage[1].id);
    });
  });
});
