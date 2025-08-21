import { describe, test, expect } from "bun:test";
import { spawnSync } from "child_process";

describe("count-tokens CLI", () => {
  test("should count tokens in a file", () => {
    const result = spawnSync("bun", ["run", "index.ts", "test.txt"], {
      encoding: "utf8",
    });
    
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Token count:");
    expect(result.stdout).toContain("35");
  });

  test("should show error for non-existent file", () => {
    const result = spawnSync("bun", ["run", "index.ts", "nonexistent.txt"], {
      encoding: "utf8",
    });
    
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("does not exist");
  });

  test("should show help", () => {
    const result = spawnSync("bun", ["run", "index.ts", "--help"], {
      encoding: "utf8",
    });
    
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Usage: count-tokens");
  });
});