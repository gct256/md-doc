import path from 'path';

import MarkdownIt from 'markdown-it';
import { readFile, outputFile } from 'fs-extra';
import { JSDOM } from 'jsdom';
import Mustache from 'mustache';

import { Options } from '../models/options';
import { replaceExt } from '../utils/replaceExt';
import { Fragments } from '../models/fragments';

export const buildMarkdown = async (
  md: MarkdownIt,
  relPath: string,
  options: Options,
  fragments: Fragments,
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
    Mustache.render(fragments.header, env),
    '<style>',
    Mustache.render(fragments.css, env),
    '</style>',
  ];

  result.push(
    dom.window.document.body.innerHTML,
    Mustache.render(fragments.footer, env),
  );

  await outputFile(outputPath, result.join('\n'), 'utf8');

  options.logger.info(`write: ${path.relative(options.output, outputPath)}`);

  return imgs
    .map((img) => [
      img.src,
      path.relative(
        options.input,
        path.resolve(path.dirname(inputPath), img.src),
      ),
    ])
    .filter(([imgSrc, imgRelPath]) => {
      if (imgRelPath.startsWith('..')) {
        options.logger.warn(`illegal image file location: ${imgSrc}`);

        return false;
      }

      return true;
    })
    .map(([, imgRelPath]) => imgRelPath);
};
