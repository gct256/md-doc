import url from 'url';
import path from 'path';

import puppeteer from 'puppeteer';

import { replaceExt } from '../utils/replaceExt';
import { Options } from '../models/options';

/**
 * HTMLを元にPDFを作成
 *
 * @param htmlFilePath HTMLファイルパス
 */
export const makePdf = async (options: Options, relPath: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

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

  options.logger.info(`write: ${path.relative(options.output, pdfFilePath)}`);

  await page.close();
  await browser.close();
};
