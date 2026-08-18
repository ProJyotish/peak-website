export type FrontmatterData = Record<string, string>;

/**
 * Browser-safe YAML-ish frontmatter parser.
 * gray-matter uses Node's Buffer, which is not available in the Vite client.
 */
export function parseFrontmatter(raw: string): { data: FrontmatterData; content: string } {
  const text = String(raw ?? "").replace(/^\uFEFF/, "");
  const match = text.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: text };
  }
  return { data: parseSimpleYaml(match[1]), content: match[2] };
}

function parseSimpleYaml(block: string): FrontmatterData {
  const data: FrontmatterData = {};
  const lines = block.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith("#")) {
      i += 1;
      continue;
    }
    const colon = line.indexOf(":");
    if (colon === -1) {
      i += 1;
      continue;
    }
    const key = line.slice(0, colon).trim();
    const trimmed = line.slice(colon + 1).trim();
    if (trimmed === "|" || trimmed === ">" || trimmed === "|-" || trimmed === ">-") {
      const nested: string[] = [];
      i += 1;
      while (i < lines.length && (lines[i] === "" || /^\s/.test(lines[i]))) {
        nested.push(lines[i]);
        i += 1;
      }
      data[key] = stripCommonIndent(nested).join("\n").trimEnd();
      continue;
    }
    data[key] = unquote(trimmed);
    i += 1;
  }
  return data;
}

function unquote(value: string): string {
  if (value.length >= 2) {
    const start = value[0];
    const end = value[value.length - 1];
    if ((start === '"' && end === '"') || (start === "'" && end === "'")) {
      return value.slice(1, -1);
    }
  }
  return value;
}

function stripCommonIndent(lines: string[]): string[] {
  const indents = lines
    .filter((line) => line.trim())
    .map((line) => line.match(/^\s*/)?.[0].length ?? 0);
  const indent = indents.length ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(indent));
}
