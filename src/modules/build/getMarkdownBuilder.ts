import MarkdownIt from 'markdown-it';
import headerSections from 'markdown-it-header-sections';
import include from 'markdown-it-include';
import title from 'markdown-it-title';
import footnote from 'markdown-it-footnote';
import div from 'markdown-it-div';
import anchor from 'markdown-it-anchor';
import toc from 'markdown-it-table-of-contents';

/**
 * Markdownのビルダーを作成
 *
 * @param input 入力ディレクトリ
 */
export const getMardownBuilder = (input: string): MarkdownIt => {
  const md = new MarkdownIt({
    html: true,
  });

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
    includeLevel: [1, 2, 3],
  });
  md.enable('image');

  return md;
};
