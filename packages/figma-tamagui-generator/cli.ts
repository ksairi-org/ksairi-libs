#!/usr/bin/env tsx
import * as fs from 'fs';
import * as path from 'path';

import {
  buildColorThemesFromFigma,
  buildSpacingFromFigma,
  buildRadiusFromFigma,
} from './generators';

const getArg = (name: string): string | undefined => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg?.split('=').slice(1).join('=');
};

const FILE_HEADER = `/**
 * Auto Generated from Figma
 * Do not edit manually.
 */\n\n`;

const toTsLiteral = (obj: Record<string, unknown>): string => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([a-zA-Z_$][a-zA-Z0-9_$]*)": /g, '$1: ');
};

const writeTokenFile = (
  filePath: string,
  constName: string,
  value: Record<string, unknown>,
) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const content = `${FILE_HEADER}const ${constName} = ${toTsLiteral(value)};\n\nexport { ${constName} };\n`;
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✓ Wrote ${filePath}`);
};

const main = async () => {
  const fileId = getArg('fileId');
  const outDir = getArg('out') ?? './src/theme';
  const mobileMode = getArg('mobileMode') ?? 'Mobile';

  if (!fileId) {
    console.error('Usage: figma-tamagui-sync --fileId=<figmaFileId> [--out=./src/theme] [--mobileMode=Mobile]');
    process.exit(1);
  }

  if (!process.env.FIGMA_TOKEN) {
    console.error('Error: FIGMA_TOKEN environment variable must be set.');
    process.exit(1);
  }

  console.log(`Syncing design tokens from Figma file ${fileId}...\n`);

  const results = await Promise.allSettled([
    buildColorThemesFromFigma(fileId).then((themes) =>
      writeTokenFile(path.join(outDir, 'themes.ts'), 'themes', themes as Record<string, unknown>),
    ),
    buildSpacingFromFigma(fileId, mobileMode).then((sizesSpaces) =>
      writeTokenFile(path.join(outDir, 'tokens', 'sizesSpaces.ts'), 'sizesSpaces', sizesSpaces as Record<string, unknown>),
    ),
    buildRadiusFromFigma(fileId, mobileMode).then((radius) =>
      writeTokenFile(path.join(outDir, 'tokens', 'radius.ts'), 'radius', radius as Record<string, unknown>),
    ),
  ]);

  const failures = results.filter((r) => r.status === 'rejected');
  if (failures.length > 0) {
    failures.forEach((f) => console.error((f as PromiseRejectedResult).reason));
    process.exit(1);
  }

  console.log('\nDone.');
};

main();
