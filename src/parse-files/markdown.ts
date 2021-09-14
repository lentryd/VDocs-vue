import marked from "marked";
import highlight from "highlight.js";
import { readFileSync } from "fs";

marked.use({
  renderer: {
    heading(text, level) {
      const id = text
        .toLowerCase()
        .replace(/[$-/:-?{-~!"^_`\[\]]/g, "")
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

export default function (path: string) {
  const src = readFileSync(path, "utf8");
  return marked(src);
}
