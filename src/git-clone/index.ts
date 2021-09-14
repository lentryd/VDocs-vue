import { ROOT_DIR } from "../index";
import { spawnSync } from "child_process";
import { existsSync, rmSync } from "fs";

import cloneWithGit from "./withGit";
import cloneWithoutGit from "./withoutGit";

export default async function (owner: string, repo: string, branch?: string) {
  if (existsSync(ROOT_DIR)) rmSync(ROOT_DIR, { recursive: true });

  const urlForGit = `https://github.com/${owner}/${repo}.git`;
  const urlForRequest = `https://api.github.com/repos/${owner}/${repo}/contents/`;

  const { error } = spawnSync("git", ["--version"]);

  if (!error) await cloneWithGit(urlForGit, branch);
  else await cloneWithoutGit(urlForRequest, branch);
}
