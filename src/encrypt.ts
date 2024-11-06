import execute from "./spawn.js";
import { fileExists, hyphenate } from "./utils.js";

const EncryptDefaults = {
  keyLength: 256,
  overwrite: true,
};
type BaseYesNoOptions = "n" | "y";
type BasePrintOptions = "full" | "low" | "none";
interface BaseEncryptOptions {
    /**
   * If defined, will ignore warnings from qpdf
   */
  ignoreWarnings?: boolean;
  /** The location of the unencrypted pdf file */
  input: string;
  /** If defined, the output location of the encrypted pdf. If not defined, a Buffer will be returned. */
  output?: string;
  /**
   * If defined, will determine if the encrypted pdf will overwrite an existing file
   * @default true
   */
  overwrite?: boolean | undefined;
  /**
   * A string containing the password with will be used to decrypt the pdf.
   * Optionally, an object containing `user` and `owner` for setting different roles.
   * If undefined, will encrypt a pdf without requiring a password to decrypt
   */
  password?:
    | {
        owner: string;
        user: string;
      }
    | string;
}
interface BaseRestrictionsOptions {
  /** Please see: https://qpdf.readthedocs.io/en/stable/cli.html#option-accessibility */
  accessibility?: BaseYesNoOptions;
  /** Please see: https://qpdf.readthedocs.io/en/stable/cli.html#option-annotate */
  annotate?: BaseYesNoOptions;
  /** Please see: https://qpdf.readthedocs.io/en/stable/cli.html#option-assemble */
  assemble?: BaseYesNoOptions;
  /** Please see: https://qpdf.readthedocs.io/en/stable/cli.html#option-cleartext-metadata */
  cleartextMetadata?: boolean;
  /** Please see: https://qpdf.readthedocs.io/en/stable/cli.html#option-extract */
  extract?: BaseYesNoOptions;
  /** Please see: https://qpdf.readthedocs.io/en/stable/cli.html#option-form */
  form?: BaseYesNoOptions;
  /** Please see: https://qpdf.readthedocs.io/en/stable/cli.html#option-modify */
  modify?: "all" | "annotate" | "assembly" | "form" | "none" | BaseYesNoOptions;
  /** Please see: https://qpdf.readthedocs.io/en/stable/cli.html#option-modify-other */
  modifyOther?: BaseYesNoOptions;
  /** Please see: https://qpdf.readthedocs.io/en/stable/cli.html#option-use-aes */
  useAes?: BaseYesNoOptions;
}
interface Encrypt40bitOptions extends BaseEncryptOptions {
  /**
   * A number which defines the encryption algorithm to be used.
   * Using a keyLengh of 40 is insecure.
   * @default 256
   */
  keyLength?: 40;
  /** Restrictions for the encrypted pdf */
  restrictions?: {
    /** Please see: https://qpdf.readthedocs.io/en/stable/cli.html#option-print */
    print?: BasePrintOptions | BaseYesNoOptions;
  } & BaseRestrictionsOptions;
}
interface EncryptDefaultOptions extends BaseEncryptOptions {
  /**
   * A number which defines the encryption algorithm to be used.
   * Using a keyLengh of 40 is insecure.
   * @default 256
   */
  keyLength?: 128 | 256;
  /** Restrictions for the encrypted pdf */
  restrictions?: {
    /** Please see: https://qpdf.readthedocs.io/en/stable/cli.html#option-print */
    print?: BasePrintOptions;
  } & BaseRestrictionsOptions;
}
export type EncryptOptions = Encrypt40bitOptions | EncryptDefaultOptions;

/**
 * Encrypts a PDF file
 * @param userPayload The options for encryption
 * @returns The output of QPDF
 */
export const encrypt = async (userPayload: EncryptOptions): Promise<Buffer> => {
  // Set Defaults
  const payload = { ...EncryptDefaults, ...userPayload };

  // Check if the file exists
  if (!payload.input) throw new Error("Please specify input file");
  if (!fileExists(payload.input)) throw new Error("Input file doesn't exist");
  if (payload.output && !payload.overwrite && fileExists(payload.output))
    throw new Error("Output file already exists");

  const callArguments = [];

  // If the keyLength is 40, `--allow-weak-crypto` needs to be specified before `--encrypt`.
  // This is required for qpdf 11+.
  if (payload.keyLength === 40) callArguments.push("--allow-weak-crypto");

  // Add Ignore warning flags
  if (payload.ignoreWarnings) {
    callArguments.push("--no-warn", "--warning-exit-0");
  }

  callArguments.push("--encrypt");

  // Set user-password and owner-password
  if (typeof payload.password === "object") {
    if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      payload.password.user === undefined ||
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      payload.password.owner === undefined
    ) {
      // TODO: If the keyLength is 256 AND there is no owner password, `--allow-insecure` can be used
      throw new Error("Please specify both owner and user passwords");
    }
    callArguments.push(payload.password.user, payload.password.owner);
  } else if (typeof payload.password === "string") {
    // Push twice for user-password and owner-password
    callArguments.push(payload.password, payload.password);
  } else {
    // no password specified, push two empty strings (https://stackoverflow.com/a/43736897/455124)
    callArguments.push("", "");
  }

  // Specifying the key length
  callArguments.push(payload.keyLength.toString());

  // Add Restrictions for encryption
  if (payload.restrictions) {
    if (typeof payload.restrictions !== "object")
      throw new Error("Invalid Restrictions");
    for (const [restriction, value] of Object.entries(payload.restrictions)) {
      // cleartextMetadata does not have a value
      if (restriction === "cleartextMetadata" && value === true) {
        callArguments.push(`--${hyphenate(restriction)}`);
      }

      if (restriction === "useAes" && payload.keyLength === 256) {
        // use-aes is always on with 256 bit keyLength
      } else {
        callArguments.push(`--${hyphenate(restriction)}=${value as string}`);
      }
    }
  }
  
  // Marks end of --encrypt options, Input file path
  callArguments.push("--", payload.input);

  if (payload.output) {
    // If the input and output locations are the same, and overwrite is true, replace the input file
    if (payload.input === payload.output && payload.overwrite) {
      callArguments.push("--replace-input");
    } else {
      callArguments.push(payload.output);
    }
  } else {
    // Print PDF on stdout
    callArguments.push("-");
  }
  // Execute command and return stdout for pipe
  return execute(callArguments);
};
