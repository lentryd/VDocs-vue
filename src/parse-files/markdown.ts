import { marked } from "marked";
import highlight from "highlight.js";
import { readFileSync } from "fs";
import { LINK_PARSER } from "../index.js";

export default function (path: string) {
  marked.use({
    renderer: {
      ...(LINK_PARSER ? { link: LINK_PARSER } : {}),
      heading(text, level) {
        const id = text
          .toLowerCase()
          .replace(/(<.+?>)|[$-/:-?{-~!"^_`\[\]]/g, "")
          .replace(/ /g, "-");
        const tag = `h${level}`;

        return `<${tag} id="${id}">${text}</${tag}>`;
      },
    },
    highlight(code, lang) {
      const language = highlight.getLanguage(lang) ? lang : "plaintext";
      return highlight.highlight(code, { language }).value;
    },
  });

  const src = readFileSync(path, "utf8");
  return marked(src);
}
