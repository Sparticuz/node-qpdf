import { copyFile } from "node:fs/promises";
import { expect, test } from "vitest";

import { encrypt } from "../src/encrypt.js";

const input = "test/example.pdf";
const password = "1234";

test("Should encrypt a file with user and owner passwords", async () => {
  await expect(
    encrypt({
      input,
      output: "test/output/encrypted-with-different-passwords.pdf",
      password: { owner: "admin", user: password },
    }),
  ).resolves.toBeTruthy();
});

test("should not overwrite existing files", async () => {
  await expect(
    encrypt({
      input,
      output: "test/output/encrypted-with-different-passwords.pdf",
      overwrite: false,
    }),
  ).rejects.toThrow("Output file already exists");
});

test("should allow restrictions", async () => {
  await expect(
    encrypt({
      input,
      output: "test/output/encrypted-with-restrictions.pdf",
      password,
      restrictions: {
        print: "none",
        useAes: "y",
      },
    }),
  ).resolves.toBeTruthy();
});

test("should encrypt without passwords", async () => {
  await expect(
    encrypt({
      input,
      output: "test/output/encrypted-with-no-password.pdf",
    }),
  ).resolves.toBeTruthy();
});

test("should encrypt where keyLength is 40", async () => {
  await expect(
    encrypt({
      input,
      keyLength: 40,
      output: "test/output/encrypted-with-keyLength-40.pdf",
      password,
    }),
  ).resolves.toBeTruthy();
});

test("should encrypt where cleartextMetadata is set as a restriction", async () => {
  await expect(
    encrypt({
      input,
      output: "test/output/encrypted-with-cleartext-metadata.pdf",
      password,
      restrictions: {
        cleartextMetadata: true,
      },
    }),
  ).resolves.toBeTruthy();
});

test("should not work if no input file is specified", async () => {
  // @ts-expect-error This is what I'm testing
  await expect(encrypt()).rejects.toThrow("Please specify input file");
});

test("should throw an error if the file doesn't exist", async () => {
  await expect(
    encrypt({
      input: "bad_file_name.pdf",
      password,
    }),
  ).rejects.toThrow("Input file doesn't exist");
});

test("should throw if only user or owner password is submitted", async () => {
  await expect(
    encrypt({
      input,
      // @ts-expect-error This is what I'm testing
      password: { user: "test" },
    }),
  ).rejects.toThrow("Please specify both owner and user passwords");
});

test("should throw if restrictions are wrong", async () => {
  await expect(
    encrypt({
      input,
      // @ts-expect-error This is what I'm testing
      restrictions: "test",
    }),
  ).rejects.toThrow("Invalid Restrictions");
});

test("Should encrypt and overwrite the file", async () => {
  // First, copy example.pdf to output/overwrite.pdf
  await copyFile("test/example.pdf", "test/output/overwrite.pdf");
  await expect(
    encrypt({
      input: "test/output/overwrite.pdf",
      output: "test/output/overwrite.pdf",
      overwrite: true,
      password: "1234",
    }),
  ).resolves.toBeTruthy();
});

test("should throw warnings", async () => {
  await expect(
    encrypt({
      input: "test/example-warning.pdf",
    }),
  ).rejects.toBeTruthy();
});

test("should encrypt without warnings", async () => {
  await expect(
    encrypt({
      ignoreWarnings: true,
      input: "test/example-warning.pdf",
    }),
  ).resolves.toBeTruthy();
});
