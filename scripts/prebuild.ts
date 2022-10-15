import * as path from "path";
import * as fs from "fs/promises";
import { Readable } from "stream";
import * as child_process from "child_process";
import { parse, assemble } from "@ethersproject/asm";

const root = path.join(__dirname, "..");
const inDir = path.join(root, "contracts-gen");
const outDir = path.join(root, "contracts");
const evmDir = path.join(inDir, "evm");
const tmplDir = path.join(inDir, "templates");

const interpolatePattern = /\{\{(?<split>([0-9A-Fa-f]{2})*):(?<encoding>ascii|hex)}}/g;

const asciiTable = (() => {
  function* range<T>(start: number, end: number, func: (x: number) => T) {
    for (let i = start; i < end; i++) {
      yield func(i);
    }
  }

  return [
    "\\0",
    ...range(1, 8, (x) => `\\x0${x}`),
    ...[..."btnvfr"].map((c) => "\\" + c),
    "\\x0e",
    "\\x0f",
    ...range(16, 32, (x) => `\\x${x.toString(16)}`),
    ..." !",
    '\\"',
    ..."#$%&",
    "\\'",
    ...range(0x28, 0x5c, (x) => String.fromCharCode(x)),
    "\\\\",
    ...range(0x5d, 0x7f, (x) => String.fromCharCode(x)),
    ...range(0x7f, 0x100, (x) => `\\x${x.toString(16)}`),
  ].flat(1);
})();

const encoders = {
  ascii(bytecode: string) {
    return [...Buffer.from(bytecode, "hex")].map((x) => asciiTable[x]).join("");
  },
  hex(bytecode: string) {
    return bytecode;
  },
};

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
  const chunks: string[] = [];
  let templateStart = 0;
  let bytecodeStart = 0;
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const groups = m.groups!;
    const { split, encoding } = groups;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const templateEnd = m.index!;
    const bytecodeEnd = split ? bytecode.indexOf(split, bytecodeStart) : bytecode.length;
    if (bytecodeEnd === -1) throw new Error(`split not found: ${split}`);
    chunks.push(
      template.substring(templateStart, templateEnd),
      encoders[encoding as keyof typeof encoders](bytecode.substring(bytecodeStart, bytecodeEnd))
    );
    templateStart = templateEnd + m[0].length;
    bytecodeStart = bytecodeEnd + split.length;
  }
  chunks.push(template.substring(templateStart));
  const outPath = path.join(outDir, `${name}.sol`);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  const outFile = await fs.open(outPath, "w");
  const proc = child_process.spawn("npx", ["prettier", "--stdin-filepath", outPath], {
    stdio: ["pipe", "pipe", "inherit"],
  });
  Readable.from(chunks.map((x) => Buffer.from(x, "utf-8"))).pipe(proc.stdin);
  const fileStream = outFile.createWriteStream();
  proc.stdout.pipe(fileStream);
  await Promise.all([
    new Promise<void>((resolve, reject) => {
      proc.once("exit", (code) => {
        if (code) reject(new Error(`prettier exited with: ${code}`));
        else resolve();
      });
    }),
  ]);
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
