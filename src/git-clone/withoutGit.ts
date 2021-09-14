import fetch from "node-fetch";
import { ROOT_DIR } from "../index";
import { join, posix } from "path";
import { existsSync, mkdirSync, writeFileSync } from "fs";

interface DirContent {
  url: string;
  sha: string;
  name: string;
  size: number;
  path: string;
  type: "dir" | "file";
  git_url: string;
  html_url: string;
  download_url: string;
}

async function getDir(url: string, path = "/") {
  if (!existsSync(join(ROOT_DIR, path))) mkdirSync(join(ROOT_DIR, path));

  const files = await fetch(url)
    .then((res) => res.json() as Promise<DirContent[]>)
    .then((data) =>
      data.map(({ url, name, path, type, download_url }) => ({
        url,
        name,
        path,
        type,
        download_url,
      }))
    );

  files.forEach(({ url, type, path, download_url }) => {
    if (type == "dir") getDir(url, path);
    else saveFile(download_url, path);
  });
}

async function saveFile(url: string, path: string) {
  const source = await fetch(url).then((res) => res.buffer());

  writeFileSync(join(ROOT_DIR, path), source);
}

export default function (url: string, branch?: string) {
  if (branch) url += "?ref=" + branch;

  return getDir(url);
}
