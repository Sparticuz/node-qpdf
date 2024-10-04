import test from "ava";

import { decrypt, encrypt } from "../src/index.js";

const input = "test/example.pdf";

test.serial("Should encrypt a file with a space", async (t) => {
  await t.notThrowsAsync(async () => {
    await encrypt({
      input: "test/example copy.pdf",
      output: "test/output/file to file.pdf",
      password: "1234",
    });
  });
});

test.serial("Should decrypt a file with a space", async (t) => {
  await t.notThrowsAsync(async () => {
    await decrypt({
      input: "test/output/file to file.pdf",
      password: "1234",
    });
  });
});

test.serial("Should encrypt a File without a password", async (t) => {
  await t.notThrowsAsync(async () => {
    await encrypt({
      input,
      output: "test/output/file-to-file-no-pw.pdf",
    });
  });
});

test.serial("Should decrypt a File without a password", async (t) => {
  await t.notThrowsAsync(async () => {
    await decrypt({
      input: "test/output/file-to-file-no-pw.pdf",
      output: "test/output/file-to-file-no-pw-decrypted.pdf",
    });
  });
});

test.serial("Should encrypt to a file", async (t) => {
  await t.notThrowsAsync(async () => {
    await encrypt({
      input,
      output: "test/output/encrypted.pdf",
      password: "1234",
    });
  });
});

test.serial("Should decrypt from a file", async (t) => {
  await t.notThrowsAsync(async () => {
    await decrypt({
      input: "test/output/encrypted.pdf",
      output: "test/output/decrypted.pdf",
      password: "1234",
    });
  });
});

test.serial("Should encrypt File -> Buffer", async (t) => {
  const BufferFromFile = await encrypt({
    input,
    password: "1234",
  });
  t.true(Buffer.isBuffer(BufferFromFile));
});

test.serial("Should decrypt a File -> Buffer", async (t) => {
  const BufferFromFile = await decrypt({
    input: "test/output/encrypted.pdf",
    password: "1234",
  });
  t.true(Buffer.isBuffer(BufferFromFile));
});

// Not sure this can happen: https://github.com/qpdf/qpdf/issues/54
test.todo("Should encrypt a Buffer -> File");
test.todo("Should decrypt a Buffer -> File");
test.todo("Should encrypt a Buffer -> Buffer");
test.todo("Should decrypt a Buffer -> Buffer");
