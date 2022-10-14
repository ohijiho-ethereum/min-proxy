import { parse, assemble } from "@ethersproject/asm";
import * as fs from "fs/promises";
import * as path from "path";

const root = path.join(__dirname, "..");
const inDir = path.join(root, "contracts-gen");
const outDir = path.join(root, "contracts");
const evmDir = path.join(inDir, "evm");
const tmplDir = path.join(inDir, "templates");

const interpolatePattern = /\{\{(([0-9A-Fa-f]{2})*)}}/g;

async function generate(name: string) {
  const template = (await fs.readFile(path.join(tmplDir, `${name}.sol`))).toString("utf-8");
  const matches = [...template.matchAll(interpolatePattern)];
  const bytecode = (
    await assemble(
      parse((await fs.readFile(path.join(evmDir, `${name}.evm`))).toString("utf-8"), { ignoreWarnings: true }),
      {
        defines: { splits: matches.map((x) => x[1]) },
      }
    )
  ).substring(2);
  const chunks = [];
  let templateStart = 0;
  let bytecodeStart = 0;
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const split = m[1];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const templateEnd = m.index!;
    const bytecodeEnd = split ? bytecode.indexOf(split, bytecodeStart) : bytecode.length;
    if (bytecodeEnd === -1) throw new Error(`split not found: ${split}`);
    chunks.push(template.substring(templateStart, templateEnd), bytecode.substring(bytecodeStart, bytecodeEnd));
    templateStart = templateEnd + m[0].length;
    bytecodeStart = bytecodeEnd + split.length;
  }
  chunks.push(template.substring(templateStart));
  const outPath = path.join(outDir, `${name}.sol`);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, Buffer.from(chunks.join(""), "utf-8"));
}

async function generateRecursively(name: string) {
  const tmplPath = path.join(tmplDir, name);
  const stat = await fs.stat(tmplPath);
  if (stat.isDirectory()) {
    const ls = await fs.readdir(tmplPath);
    await Promise.all(ls.map((x) => generateRecursively(path.join(name, x))));
  } else if (name.endsWith(".sol") && stat.isFile()) return generate(name.substring(0, name.length - 4));
}

async function main() {
  await generateRecursively(".");
}

main().then();
