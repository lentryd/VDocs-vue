#!/usr/bin/env node

import { join, isAbsolute } from "path";
import minimist from "minimist";
import { cwd, argv } from "process";

import gitClone from "./git-clone";
import parseDir from "./parse-files";

const runningAsScript = require.main === module;

export let MD_TEMPLATE =
  "<template><div>{0}</div></template><script>export default { name: {1} }</script>";
export let CODE_TEMPLATE =
  "<template><div>{0}</div></template><script>export default { name: {1} }</script>";

export const IsScript = require.main === module;
export const OUT_DIR = join(cwd(), "./your-vue-repository");
export const ROOT_DIR = join(__dirname, "../original-repository");
export const IGNORE_FILES = [/^\.git/, /^\.npm/, /^package(.*)\.json/];

/**
 * Setting a template for files
 */
export function setCodeTemplate(template: string) {
  CODE_TEMPLATE = template;
}

/**
 * Setting a template for `.md` files
 */
export function setMarkdownTemplate(template: string) {
  MD_TEMPLATE = template;
}

export interface VDocsOptions {
  owner?: string;
  folder?: string;
  branch?: string;
  repository?: string;
}

export default async function parse(options: VDocsOptions) {
  let { owner, folder, branch, repository } = options ?? {};

  if (!owner && !folder && !repository) {
    if (runningAsScript) folder = cwd();
    else throw new Error("Um, what should I do? You didn't pass anything on.");
  }

  if (folder && (!owner || !repository)) {
    if (!isAbsolute(folder)) folder = join(cwd(), folder);

    console.log("Okay I'll work with your files.");
    parseDir(folder, folder);
  }

  if (owner && repository) {
    if (folder && !isAbsolute(folder)) folder = join(cwd(), folder);

    console.log("Well, I start downloading the file.");
    await gitClone(owner, repository, branch);

    console.log("The files have been downloaded, I'm starting processing.");
    parseDir(ROOT_DIR, folder ?? OUT_DIR);
  }

  console.log("Phew, I did everything.");
}

if (runningAsScript) {
  const {
    o: owner,
    f: folder,
    b: branch,
    r: repository,
    h: hello,
  } = minimist(argv.slice(2));

  if (hello) {
    console.log("Hmm, everything seems to be installed.");
    process.exit();
  }

  parse({ owner, folder, branch, repository });
}
