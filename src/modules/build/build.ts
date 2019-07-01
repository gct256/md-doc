import { Options } from '../models/options';

import { buildMain } from './buildMain';

export const build = async (options: Options, relPath: string) =>
  buildMain(options, [relPath]);
