import path from 'path';

// __dirname === ./lib

export const libDir = path.resolve(__dirname);

export const defaultFragmentsDir = path.resolve(
  libDir,
  '..',
  'defaultFragments',
);
