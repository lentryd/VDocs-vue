import { ROOT_DIR } from "../index";
import { spawnSync } from "child_process";

export default function (url: string, branch?: string) {
  const args = [];
  if (branch) args.push("--branch", branch);

  const { error } = spawnSync("git", ["clone", ...args, url, ROOT_DIR]);
  if (error) throw error;

  return true;
}
