import path from 'path';

import MarkdownIt from 'markdown-it';
import { readFile, outputFile } from 'fs-extra';
import { JSDOM } from 'jsdom';
import Mustache from 'mustache';
import signale from 'signale';

import { Options } from '../options';
import { replaceExt } from '../replaceExt';

export const buildMarkdown = async (
  md: MarkdownIt,
  relPath: string,
  options: Options,
): Promise<string[]> => {
  const inputPath = path.resolve(options.input, relPath);
  const outputPath = replaceExt(
    path.resolve(options.output, relPath),
    '.md',
    '.html',
  );

  const src = await readFile(inputPath, 'utf8');

  const env = {};
  const html = md.render(src, env);

  const dom = new JSDOM(html);
  const imgs = Array.from(dom.window.document.querySelectorAll('img'));

  imgs.forEach((img) => {
    if (img.parentElement !== null) {
      img.parentElement.classList.add('image');
    }
  });

  const result: string[] = [
    Mustache.render(await readFile(options.headerFile, 'utf8'), env),
  ];

  if (options.cssUrl.length > 0) {
    const link = dom.window.document.createElement('link');

    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', options.cssUrl);

    result.push(link.outerHTML);
  } else {
    result.push(
      '<style>',
      Mustache.render(await readFile(options.cssFile, 'utf8'), env),
      '</style>',
    );
  }

  result.push(
    dom.window.document.body.innerHTML,
    Mustache.render(await readFile(options.footerFile, 'utf8'), env),
  );

  await outputFile(outputPath, result.join(''), 'utf8');

  signale.info(`write: ${path.relative(options.output, outputPath)}`);

  return imgs.map((img) =>
    path.relative(
      options.input,
      path.resolve(path.dirname(inputPath), img.src),
    ),
  );
};
