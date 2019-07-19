import MarkdownIt from 'markdown-it';
import headerSections from 'markdown-it-header-sections';
import include from 'markdown-it-include';
import title from 'markdown-it-title';
import footnote from 'markdown-it-footnote';
import div from 'markdown-it-div';
import anchor from 'markdown-it-anchor';
import toc from 'markdown-it-table-of-contents';
import { JSDOM } from 'jsdom';

import { Options } from '../models/options';

const dom = new JSDOM();

const getTocHeader = (tocTitle: string): string => {
  if (tocTitle.trim().length === 0) return '';

  const p = dom.window.document.createElement('p');

  p.textContent = tocTitle;

  return `<div class="table-of-contents-header"><p>${p.innerHTML}</p></div>`;
};

const getTocFooter = (tocTitle: string): string => {
  if (tocTitle.trim().length === 0) return '';

  return `<div class="table-of-contents-footer"></div>`;
};

/**
 * Markdownのビルダーを作成
 *
 * @param input 入力ディレクトリ
 */
export const getMardownBuilder = ({
  input,
  tocLevel,
  tocTitle,
}: Options): MarkdownIt => {
  const md = new MarkdownIt({
    html: true,
  });

  const includeLevel: number[] = [];

  for (let i = 2; i <= tocLevel; i += 1) includeLevel.push(i);
  if (includeLevel.length === 0) includeLevel.push(2);

  md.use(headerSections);
  md.use(include, {
    root: input,
    includeRe: /`!{3}\s*include\s*\(\s*(.+?)\s*\)\s*!{3}\s*`/i,
  });
  md.use(title);
  md.use(div);
  md.use(footnote);
  md.use(anchor);
  md.use(toc, {
    includeLevel,
    containerHeaderHtml: getTocHeader(tocTitle),
    containerFooterHtml: getTocFooter(tocTitle),
  });
  md.enable('image');

  return md;
};
