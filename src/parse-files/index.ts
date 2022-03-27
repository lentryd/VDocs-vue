import { MD_TEMPLATE, CODE_TEMPLATE, IGNORE_FILES } from "../index";
import { join, extname } from "path";
import isImage from "is-image";
import {
  statSync,
  mkdirSync,
  rmSync,
  renameSync,
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
    outPath: join(outDir, file.replace(/^\./, "$1")),
    name: file,
  }));

  files.forEach(({ name, rootPath, outPath }) => {
    const stat = statSync(rootPath);

    if (isIgnoredFile(name)) {
      if (rootDir != outDir) return;

      if (stat.isDirectory()) rmSync(rootPath, { recursive: true });
      else unlinkSync(rootPath);

      return;
    }

    if (stat.isDirectory()) return parseDir(rootPath, outPath);
    else parseFile(name, rootPath, outPath);

    if (rootDir == outDir) unlinkSync(rootPath);
  });
}

function parseFile(name: string, rootPath: string, outPath: string) {
  if (isImage(rootPath)) {
    renameSync(rootPath, outPath);
    return;
  }

  const isMD = extname(rootPath) === ".md";

  let source = (isMD ? markdown : justCode)(rootPath)
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;");
  source = format(isMD ? MD_TEMPLATE : CODE_TEMPLATE, [source, name]);

  outPath = replaceExt(outPath, ".vue");
  writeFileSync(outPath, source);
}

export default function (rootDir: string, outDir: string) {
  if (existsSync(outDir)) rmSync(outDir, { recursive: true });

  parseDir(rootDir, outDir);

  if (rootDir != outDir) rmSync(rootDir, { recursive: true });
}
