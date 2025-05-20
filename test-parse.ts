import fs from "fs";
import pdfParse from "pdf-parse-debugging-disabled";

async function main() {
  const buffer = fs.readFileSync("./Pdftesting.pdf");
  const data = await pdfParse(buffer);
  console.log(data.text);
}

main().catch(console.error);
