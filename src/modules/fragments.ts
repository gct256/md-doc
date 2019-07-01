import got from 'got';
import { readFile } from 'fs-extra';

import { Options } from './options';

export interface Fragments {
  header: string;
  footer: string;
  css: string;
}

const readCss = async (options: Options) => {
  if (options.cssUrl.length === 0) return readFile(options.cssFile, 'utf8');

  try {
    const res = await got(options.cssUrl);

    return res.body;
  } catch {
    return '';
  }
};

export const getFragments = async (options: Options): Promise<Fragments> => ({
  header: await readFile(options.headerFile, 'utf8'),
  footer: await readFile(options.footerFile, 'utf8'),
  css: await readCss(options),
});
