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

test("should not work if no input file is specified", async (t) => {
  try {
    const results = await qpdf.encrypt("", options);
    if (results === "Please specify input file") {
      t.pass();
    }
  } catch {
    t.fail();
  }
});

test("should throw an error if the file doesn't exist", async (t) => {
  try {
    const results = await qpdf.encrypt("bad_file_name.pdf", options);
    if (results === "Input file doesn't exist") {
      t.pass();
    }
  } catch {
    t.fail();
  }
});

test("should throw if only user or owner password is submitted", async (t) => {
  try {
    const results = await qpdf.encrypt(sample, {
      ...options,
      password: { user: "test" },
    });
    if (results === "Please specify both owner and user passwords") {
      t.pass();
    }
  } catch {
    t.fail();
  }
});

test("should throw if restrictions are wrong", async (t) => {
  try {
    const results = await qpdf.encrypt(sample, {
      ...options,
      restrictions: "test",
    });
    if (results === "Invalid Restrictions") {
      t.pass();
    }
  } catch {
    t.fail();
  }
});

test("should not work if no input file is specified for decrypt", async (t) => {
  try {
    const results = await qpdf.decrypt("", options);
    if (results === "Please specify input file") {
      t.pass();
    }
  } catch {
    t.fail();
  }
});

test("should not work if no password entered for decrypt", async (t) => {
  try {
    const results = await qpdf.decrypt(sample, "");
    if (results === "Password missing") {
      t.pass();
    }
  } catch {
    t.fail();
  }
});

test("should allow restrictions", async (t) => {
  try {
    await qpdf.encrypt(sample, {
      ...options,
      restrictions: {
        print: "none",
        useAes: "y",
      },
    });
    t.pass();
  } catch {
    t.fail();
  }
});
