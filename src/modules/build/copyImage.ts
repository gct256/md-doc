import path from 'path';

import { mkdirp, copyFile } from 'fs-extra';

import { Options } from '../models/options';

export const copyImage = async (options: Options, relPath: string) => {
  const outputPath = path.resolve(options.output, relPath);

  await mkdirp(path.dirname(outputPath));
  await copyFile(
    path.resolve(options.input, relPath),
    path.resolve(options.output, relPath),
  );
  options.logger.info(`copy: ${relPath}`);
};
