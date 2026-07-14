import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.resolve('data');
const files = fs.readdirSync(dataDir).filter(file => /^(grade[123]|eiken4Sentences)\.ts$/.test(file));
const ids = new Map();
const errors = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
  const objects = content.match(/\{\s*id:\s*["'][^"']+["'][\s\S]*?explanation:\s*["'][\s\S]*?["']\s*,?\s*\}/g) || [];
  for (const [index, row] of objects.entries()) {
    const id = row.match(/id:\s*["']([^"']+)/)?.[1];
    const japanese = row.match(/japaneseQuestion:\s*["']([^"']*)["']/)?.[1];
    const words = row.match(/words:\s*\[([^\]]*)\]/)?.[1];
    const tag = row.match(/grammarTag:\s*["']([^"']*)["']/)?.[1];
    const explanation = row.match(/explanation:\s*["']([^"']*)["']/)?.[1];
    if (!id || !japanese || !words || !tag || !explanation) errors.push(`${file}:問題${index + 1} 必須項目が不足`);
    if (id) {
      if (ids.has(id)) errors.push(`${file}: ID重複 ${id}（${ids.get(id)}）`);
      ids.set(id, file);
    }
    if (words && !/["'](?:\.|\?|!)["']\s*,?\s*$/.test(words.trim())) errors.push(`${file}:${id} 文末記号がありません`);
  }
  const declared = [...content.matchAll(/japaneseQuestion:\s*["']/g)].length;
  if (objects.length !== declared) errors.push(`${file}: 読み取れない問題があります（${objects.length}/${declared}）`);
}

if (errors.length) {
  console.error(errors.slice(0, 30).join('\n'));
  process.exit(1);
}
console.log(`教材チェックOK: ${files.length}ファイル / ${ids.size}問`);
