import { Options } from '../models/options';

import { getRelPaths } from './getRelPaths';
import { buildMain } from './buildMain';

export const buildAll = async (options: Options) => {
  return buildMain(options, await getRelPaths(options));
};
