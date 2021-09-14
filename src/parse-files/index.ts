import { MD_TEMPLATE, CODE_TEMPLATE, IGNORE_FILES } from "../index";
import { join, extname } from "path";
import {
  statSync,
  mkdirSync,
  rmSync,
  unlinkSync,
  existsSync,
  readdirSync,
  writeFileSync,
} from "fs";
import replaceExt from "replace-ext";

import markdown from "./markdown";
import justCode, { format } from "./justCode";

function isIgnoredFile(name: string) {
  for (let i of IGNORE_FILES) {
    if (name.match(i)) return true;
  }

  return false;
}

function parseDir(rootDir: string, outDir: string) {
  if (!existsSync(outDir)) mkdirSync(outDir);

  const files = readdirSync(rootDir).map((file) => ({
    rootPath: join(rootDir, file),
    outPath: join(outDir, file),
    name: file,
  }));

  files.forEach(({ name, rootPath, outPath }) => {
    const stat = statSync(rootPath);
    const isMD = extname(rootPath) === ".md";

    if (isIgnoredFile(name)) {
      if (rootDir != outDir) return;

      if (stat.isDirectory()) rmSync(rootPath, { recursive: true });
      else unlinkSync(rootPath);

      return;
    }

    if (stat.isDirectory()) return parseDir(rootPath, outPath);
    else if (!isMD) writeCodeFile(rootPath, outPath);
    else writeMarkdownFile(rootPath, outPath);

    if (rootDir == outDir) unlinkSync(rootPath);
  });
}

function saveFile(path: string, source: string) {
  path = replaceExt(path, ".vue");
  writeFileSync(path, source);
}

function writeCodeFile(rootPath: string, outPath: string) {
  const source = format(CODE_TEMPLATE, [justCode(rootPath)]);
  saveFile(outPath, source);
}

function writeMarkdownFile(rootPath: string, outPath: string) {
  const source = format(MD_TEMPLATE, [markdown(rootPath)]);
  saveFile(outPath, source);
}

export default function (rootDir: string, outDir: string) {
  if (existsSync(outDir)) rmSync(outDir, { recursive: true });

  parseDir(rootDir, outDir);

  if (rootDir != outDir) rmSync(rootDir, { recursive: true });
}
