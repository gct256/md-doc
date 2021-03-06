import path from 'path';

import { pathExists, stat } from 'fs-extra';

import { defaultFragmentsDir } from '../utils/dirs';
import { Logger, SignaleLogger, NullLogger } from '../utils/Logger';

/** オプション */
export interface Options {
  /** ヘッダファイル */
  headerFile: string;
  /** フッタファイル */
  footerFile: string;
  /** CSSファイル */
  cssFile: string;
  /** CSS URL */
  cssUrl: string;
  /** TOCレベル */
  tocLevel: number;
  /** TOCにつける名前 */
  tocTitle: string;
  /** 出力ディレクトリ削除フラグ */
  deleteDirectory: boolean;
  /** 入力ディレクトリ */
  input: string;
  /** 出力ディレクトリ */
  output: string;
  /** ロガー */
  logger: Logger;
}

/**
 * オプションの取得
 *
 * @param userOptions 指定オプション
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const getOptions = (userOptions: any, forCli: boolean): Options => {
  const options: Options = {
    headerFile: path.resolve(defaultFragmentsDir, 'header.html'),
    footerFile: path.resolve(defaultFragmentsDir, 'footer.html'),
    cssFile: path.resolve(defaultFragmentsDir, 'md-doc.css'),
    cssUrl: '',
    tocLevel: 2,
    tocTitle: '',
    deleteDirectory: false,
    input: '',
    output: '',
    logger: forCli ? SignaleLogger : NullLogger,
  };

  if (typeof userOptions === 'object') {
    if (typeof userOptions.headerFile === 'string') {
      options.headerFile = userOptions.headerFile;
    }

    if (typeof userOptions.footerFile === 'string') {
      options.footerFile = userOptions.footerFile;
    }

    if (typeof userOptions.cssFile === 'string') {
      options.cssFile = userOptions.cssFile;
    }

    if (typeof userOptions.cssUrl === 'string') {
      options.cssUrl = userOptions.cssUrl;
    }

    if (typeof userOptions.tocLevel === 'number') {
      options.tocLevel = userOptions.tocLevel;
    }

    if (typeof userOptions.tocTitle === 'string') {
      options.tocTitle = userOptions.tocTitle;
    }

    if ('deleteDirectory' in userOptions) {
      options.deleteDirectory = !!userOptions.deleteDirectory;
    }

    if (typeof userOptions.input === 'string') {
      options.input = userOptions.input;
    }

    if (typeof userOptions.output === 'string') {
      options.output = userOptions.output;
    }
  }

  return options;
};

/**
 * オプションの正当性チェック
 *
 * @param options オプション
 */
export const validateOptions = async (options: Options) => {
  if (!(await pathExists(options.headerFile))) {
    throw new Error(`header file not found. (${options.headerFile})`);
  }

  if (!(await pathExists(options.footerFile))) {
    throw new Error(`footer file not found. (${options.footerFile})`);
  }

  if (options.cssUrl.length === 0) {
    if (!(await pathExists(options.cssFile))) {
      throw new Error(`css file not found. (${options.cssFile})`);
    }
  }

  if (!(await pathExists(options.input))) {
    throw new Error(`input directory not found (${options.input})`);
  }

  if (!(await stat(options.input)).isDirectory()) {
    throw new Error(`input directory not found (${options.input})`);
  }
};
