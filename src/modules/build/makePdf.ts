import url from 'url';
import path from 'path';

import puppeteer from 'puppeteer';

import { replaceExt } from '../utils/replaceExt';
import { Options } from '../models/options';

let globalBrowser: puppeteer.Browser | null = null;
let globalPage: puppeteer.Page | null = null;

/** PDF作成用のオブジェクトを解放 */
export const finishMakePdf = async () => {
  if (globalPage !== null) {
    await globalPage.close();
    globalPage = null;
  }

  if (globalBrowser !== null) {
    await globalBrowser.close();
    globalBrowser = null;
  }
};

/** PDF作成用のオブジェクトを確保 */
const prepareMakePdf = async (): Promise<puppeteer.Page> => {
  await finishMakePdf();
  globalBrowser = await puppeteer.launch();
  globalPage = await globalBrowser.newPage();

  return globalPage;
};

/**
 * HTMLを元にPDFを作成
 *
 * @param htmlFilePath HTMLファイルパス
 */
export const makePdf = async (options: Options, relPath: string) => {
  const page = await prepareMakePdf();

  const htmlFilePath = replaceExt(
    path.resolve(options.output, relPath),
    '.md',
    '.html',
  );
  const pdfFilePath = replaceExt(htmlFilePath, '.html', '.pdf');

  const fileUrl = url.pathToFileURL(htmlFilePath);

  await page.goto(fileUrl.toString());
  await page.pdf({
    path: pdfFilePath,
    width: '210mm',
    height: '297mm',
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `<div style="width:100%;font-size:0.2cm;text-align:center">
  <span class="pageNumber"></span> / <span class="totalPages"></span>
</div>`,
    margin: {
      top: '19mm',
      bottom: '19mm',
      left: '19mm',
      right: '19mm',
    },
  });

  options.logger.info(`write: ${pdfFilePath}`);
};
