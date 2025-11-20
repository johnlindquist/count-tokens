import { describe, test, expect } from "bun:test";
import { spawnSync } from "child_process";

const env = { ...process.env, FORCE_COLOR: "0" };

describe("count-tokens CLI", () => {
  test("should count tokens in a file", () => {
    const result = spawnSync("bun", ["run", "index.ts", "test.txt"], {
      encoding: "utf8",
      env,
    });
    
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Token count:");
    expect(result.stdout).toContain("35");
  });

  test("should count tokens from stdin when piped", () => {
    const result = spawnSync("bun", ["run", "index.ts"], {
      encoding: "utf8",
      input: "This text comes from stdin",
      env,
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Source:");
    expect(result.stdout).toContain("stdin");
    expect(result.stdout).toContain("Token count:");
  });

  test("should count tokens from stdin when file is '-'", () => {
    const result = spawnSync("bun", ["run", "index.ts", "-"], {
      encoding: "utf8",
      input: "This text also comes from stdin",
      env,
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Source:");
    expect(result.stdout).toContain("stdin");
    expect(result.stdout).toContain("Token count:");
  });

  test("should count tokens from --text option", () => {
    const result = spawnSync("bun", ["run", "index.ts", "--text", "Inline CLI text"], {
      encoding: "utf8",
      env,
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Source:");
    expect(result.stdout).toContain("Command-line text");
    expect(result.stdout).toContain("Token count:");
  });

  test("should show error for non-existent file", () => {
    const result = spawnSync("bun", ["run", "index.ts", "nonexistent.txt"], {
      encoding: "utf8",
      env,
    });
    
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("does not exist");
  });

  test("should show help", () => {
    const result = spawnSync("bun", ["run", "index.ts", "--help"], {
      encoding: "utf8",
      env,
    });
    
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Usage: count-tokens");
  });

  test("should count tokens from clipboard", () => {
    // First, put something in the clipboard
    spawnSync("sh", ["-c", "echo 'Test clipboard content' | pbcopy"]);
    
    const result = spawnSync("bun", ["run", "index.ts", "--clipboard"], {
      encoding: "utf8",
      env,
    });
    
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Source: Clipboard");
    expect(result.stdout).toContain("Token count:");
  });

  test("should show error when no file, no clipboard flag, and no stdin", () => {
    const result = spawnSync("bun", ["run", "index.ts"], {
      encoding: "utf8",
      input: "",
      env,
    });
    
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("No data received from stdin");
  });
});
