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

test("Should encrypt a file with user and owner passwords", async (t) => {
  try {
    await qpdf.encrypt(sample, {
      ...options,
      password: { owner: "admin", user: "test" },
    });
    t.pass();
  } catch {
    t.fail();
  }
});

test("Should encrypt File -> File", async (t) => {
  try {
    await qpdf.encrypt(sample, options, "./test/file-to-file.pdf");
    t.pass();
  } catch {
    t.fail();
  }
});

test("Should encrypt File -> Buffer", async (t) => {
  try {
    const data = await qpdf.encrypt(sample, options);
    fs.writeFile(
      "./test/file-to-buffer.pdf",
      Buffer.from(data),
      { encoding: "binary" },
      () => {
        t.pass();
      }
    );
    t.pass();
  } catch {
    t.fail();
  }
});

test.todo("Should encrypt a Buffer -> File");

test.todo("Should encrypt a Buffer -> Buffer");
