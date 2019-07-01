import yargs from 'yargs';
import { remove } from 'fs-extra';
import signale from 'signale';

import { getOptions, validateOptions } from '../models/options';
import { buildAll } from '../build/buildAll';

export const cliMain = async () => {
  yargs.usage('Usage: $0 [options] INPUT OUTPUT');
  yargs.option('header-file', { nargs: 1, description: 'header file path.' });
  yargs.option('footer-file', { nargs: 1, description: 'footer file path.' });
  yargs.option('css-file', { nargs: 1, description: 'css file path.' });
  yargs.option('css-url', { nargs: 1, description: 'css url.' });
  yargs.option('delete-directory', {
    boolean: true,
    description: 'delete output directory before build.',
  });

  const {
    _,
    headerFile,
    footerFile,
    cssFile,
    cssUrl,
    deleteDirectory,
  } = yargs.argv;

  if (_.length !== 2) {
    yargs.showHelp();
  } else {
    const options = getOptions(
      {
        headerFile,
        footerFile,
        cssFile,
        cssUrl,
        deleteDirectory,
        input: _[0],
        output: _[1],
      },
      true,
    );

    try {
      await validateOptions(options);

      if (options.deleteDirectory) {
        await remove(options.output);
        signale.info(`remove: ${options.output}`);
      }

      await buildAll(options);
    } catch (er) {
      signale.error(er.message);
      yargs.showHelp();
    }
  }
};
