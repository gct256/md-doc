import path from 'path';

import { copyFile, mkdirp } from 'fs-extra';
import signale from 'signale';

import { Options } from './options';
import { getMardownBuilder } from './build/getMarkdownBuilder';
import { getRelPaths } from './build/getRelPaths';
import { buildMarkdown } from './build/buildMarkdown';
import { makePdf, finishMakePdf } from './build/makePdf';

const copyImage = async (options: Options, relPath: string) => {
  const outputPath = path.resolve(options.output, relPath);

  await mkdirp(path.dirname(outputPath));
  await copyFile(
    path.resolve(options.input, relPath),
    path.resolve(options.output, relPath),
  );
  signale.info(`copy: ${relPath}`);
};

export const build = async (options: Options) => {
  const relPaths = await getRelPaths(options);

  const md = getMardownBuilder(options.input);

  const images = await Promise.all(
    relPaths.map(
      (relPath): Promise<string[]> => buildMarkdown(md, relPath, options),
    ),
  );

  const copyTargets = [...new Set(images.reduce((x, y) => [...x, ...y], []))];

  await Promise.all(
    copyTargets.map((copyTarget) => copyImage(options, copyTarget)),
  );

  await Promise.all(relPaths.map((relPath) => makePdf(options, relPath)));

  await finishMakePdf();
};
