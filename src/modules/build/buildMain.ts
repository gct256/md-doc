import { Options } from '../models/options';
import { getFragments } from '../models/fragments';

import { getMardownBuilder } from './getMarkdownBuilder';
import { buildMarkdown } from './buildMarkdown';
import { makePdf } from './makePdf';
import { copyImage } from './copyImage';

export const buildMain = async (options: Options, relPaths: string[]) => {
  const fragments = await getFragments(options);
  const md = getMardownBuilder(options);

  const images = await Promise.all(
    relPaths.map(
      (relPath): Promise<string[]> =>
        buildMarkdown(md, relPath, options, fragments),
    ),
  );

  const copyTargets = [...new Set(images.reduce((x, y) => [...x, ...y], []))];

  await Promise.all(
    copyTargets.map((copyTarget) => copyImage(options, copyTarget)),
  );

  await Promise.all(relPaths.map((relPath) => makePdf(options, relPath)));
};
