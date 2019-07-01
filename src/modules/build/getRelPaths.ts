import path from 'path';

import globby from 'globby';

import { Options } from '../options';

export const getRelPaths = async (options: Options) => {
  const filePaths = await globby(
    [
      path.resolve(options.input, '**', '*.md'),
      `!${path.resolve(options.input, '**', '_*.md')}`,
    ],
    {
      onlyFiles: true,
    },
  );

  return filePaths.map((filePath) => path.relative(options.input, filePath));
};
