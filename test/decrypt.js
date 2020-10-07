const test = require("ava");
const fs = require("fs");
const qpdf = require("../dist");

const sample = "test/sample.pdf";
const encryptedFile = "test/encrypted.pdf";
const decryptedFile = "test/decrypted.pdf";
const password = "1234";
const options = {
  outputFile: encryptedFile,
  password,
};

test("Should decrypt a File -> File", async (t) => {
  try {
    await qpdf.decrypt(sample, password, decryptedFile);
    t.pass();
  } catch (error) {
    console.error(error);
    console.error(error.toString());
    t.fail();
  }
});

test("Should decrypt a File -> Buffer", async (t) => {
  try {
    await qpdf.decrypt(sample, password);
    t.pass();
  } catch {
    t.fail();
  }
});

test.todo("Should decrypt a Buffer -> File");

test.todo("Should decrypt a Buffer -> Buffer");
