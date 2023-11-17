# node-qpdf2

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/Sparticuz/node-qpdf2/commits/master)
[![Node.js CI](https://github.com/Sparticuz/node-qpdf2/actions/workflows/node.js.yml/badge.svg)](https://github.com/Sparticuz/node-qpdf2/actions/workflows/node.js.yml)
[![CodeQL](https://github.com/Sparticuz/node-qpdf2/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/Sparticuz/node-qpdf2/actions/workflows/codeql-analysis.yml)
[![npm](https://img.shields.io/npm/v/node-qpdf2)](https://www.npmjs.com/package/node-qpdf2)
[![npm](https://img.shields.io/npm/dm/node-qpdf)](https://www.npmjs.com/package/node-qpdf2)
[![qpdf 11+](https://img.shields.io/badge/dependencies-qpdf-green)](https://github.com/qpdf/qpdf)

A very simple wrapper for [qpdf](https://github.com/qpdf/qpdf) which performs content-preserving transformations on PDF files. It includes encrypting and decrypting PDF files with AES 256, AES 128, RC4 (128 & 40) encryption algorithms. This is a fork of [nrhirani/node-qpdf](https://github.com/nrhirani/node-qpdf), adding `Promises` and `Types``, and is kept mostly up to date with `qpdf`.

## Dependencies

- [qpdf](https://github.com/qpdf/qpdf) v11.0+

## Installation

1. Install [qpdf](https://github.com/qpdf/qpdf/releases):
2. Install `node-qpdf2`:

```bash
  npm install node-qpdf2
  # or
  yarn add node-qpdf2
```

## Serverless?

This package can be used on serverless platforms and has been tested on `Amazon Lambda` and `Google Cloud Functions`. 

### Amazon Lambda
Download latest `qpdf-XX.X.X-bin-linux-x86_64.zip` release from `qpdf` then directly upload it as a [layer](https://docs.aws.amazon.com/lambda/latest/dg/chapter-layers.html).

### Google Cloud Functions
Download latest `qpdf-XX.X.X-bin-linux-x86_64.zip` release then extract it's content where functions entry point (generally `index.js`) is:

```bash
# package.json
{
  ...
  # entry point
  "main": "build/index.js",
  ...
}

# directory structure
/root_dir
  /build
    # entry point
    /index.js 
    /other files...
    # you can rename qpdf folder to whatever you want
    /qpdf_dir 
      # zip content
      /bin
      /lib 
  /src
    /index.ts
    /other files...
```

Then provide a `qpdfPath` pointing to `bin` folder inside `qpdf` directory:
```bash 
import path from "path";

const pdf = {
  qpdfPath: path.join( process.cwd(), 'qpdf_dir/bin' ),
  ... other props
}
```

## Encryption

You can encrypt your PDF by following:

```bash
import { encrypt } from "node-qpdf2";

const options = {
  input: "./test/example.pdf",
  output: "/tmp/encrypted.pdf",
  password: 'ENCRYPTION_PASSWORD',
  restrictions: {
    print: 'low',
    useAes: 'y'
  }
}

await encrypt(options);
```

### Encryption options

Please see [src/encrypt.ts](https://github.com/Sparticuz/node-qpdf2/blob/master/src/encrypt.ts#L9) for the all available options, as well as [qpdf's documentation](https://qpdf.readthedocs.io/en/stable/cli.html#encryption) for informations about each restriction prop.

## Decryption

You can decrypt your PDF by following:

```bash
import { decrypt } from "node-qpdf2";

const options = {
  input: "/tmp/encrypted.pdf",
  output: "/tmp/decrypted.pdf",
  password: "ENCRYPTION_PASSWORD",
}

await decrypt(options);
```

## Encryption info

You can retrieve encryption information using the info function. This function will return a `Promise<string>`. See [here](https://qpdf.readthedocs.io/en/stable/cli.html#option-show-encryption) for more information.

```bash
import { info } from "node-qpdf2";

const options = {
  input: "/tmp/encrypted.pdf",
  password: "ENCRYPTION_PASSWORD",
}

console.log(await info(options));
```
If file is not encrypted, the result will be `File is not encrypted`.

## Coverage

| File       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines   |
| ---------- | ------- | -------- | ------- | ------- | ----------------- |
| All files  | 100     | 100      | 100     | 100     |
| decrypt.ts | 100     | 100      | 100     | 100     |
| encrypt.ts | 100     | 100      | 100     | 100     |
| index.ts   | 100     | 100      | 100     | 100     |
| info.ts    | 100     | 100      | 100     | 100     |
| spawn.ts   | 100     | 100      | 100     | 100     |
| utils.ts   | 100     | 100      | 100     | 100     |

## Contributing

Maintained by [Kyle McNally](http://www.github.com/Sparticuz).

Bug reports and pull requests are welcome on GitHub at https://github.com/Sparticuz/node-qpdf2.

[Sponsorship](https://github.com/sponsors/Sparticuz) is also welcome

## License

The npm package is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
