declare module "pdf-parse-debugging-disabled" {
  interface PDFData {
    numpages: number;
    numrender: number;
    info: Record<string, unknown>;
    metadata: Record<string, unknown>;
    version: string;
    text: string;
  }

  interface PDFParseOptions {
    version?: string;
  }

  function pdf(
    buffer: Buffer | Uint8Array,
    options?: PDFParseOptions
  ): Promise<PDFData>;

  export = pdf;
}
