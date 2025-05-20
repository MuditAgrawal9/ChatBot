declare module "pdf-parse" {
    interface PDFData {
      numpages: number;
      numrender: number;
      info: PDFInfo;
      metadata: PDFMetadata;
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
