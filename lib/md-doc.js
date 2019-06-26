const path = require('path');
const yargs = require('yargs');
const globby = require('globby');
const Mustache = require('mustache');
const fsExtra = require('fs-extra');
const MarkdownIt = require('markdown-it');
const headerSections = require('markdown-it-header-sections');
const include = require('markdown-it-include');
const title = require('markdown-it-title');

const buildFile = async (filePath, relPath, parts, inputDir, outputDir) => {
  const outputFile = path.resolve(
    outputDir,
    relPath.replace(/\.md$/i, '.html'),
  );
  const md = new MarkdownIt();
  md.use(headerSections);
  md.use(include, {
    root: inputDir,
    includeRe: /\`\!{3}\s*include\s*\(\s*(.+?)\s*\)\s*\!{3}\s*\`/i,
  });
  md.use(title);

  const src = await fsExtra.readFile(filePath, 'utf8');
  const env = {};
  const result = md.render(src, env);

  await fsExtra.outputFile(
    outputFile,
    [
      Mustache.render(parts.header, env),
      '<style>',
      Mustache.render(parts.style, env),
      '</style>',
      result,
      Mustache.render(parts.footer, env),
    ].join(''),
    'utf8',
  );
  console.debug(`write: ${outputFile}`);
};

const build = async (input, output, parts) => {
  const files = await globby([
    path.join(input, '**', '*.md'),
    `!${path.join(input, '**', '_*.md')}`,
  ]);

  await Promise.all(
    files.map((filePath) =>
      buildFile(filePath, path.relative(input, filePath), parts, input, output),
    ),
  );
};

const getPartFromFile = (filePath, defaultFileName) => {
  if (filePath === undefined) return getPartFromFile(defaultFileName);

  return fsExtra.readFile(filePath, 'utf8');
};

const getParts = async (parts) => {
  const partsDir = path.resolve(__dirname, '..', 'parts');

  return {
    header: await getPartFromFile(
      parts.header,
      path.resolve(partsDir, 'header.html'),
    ),
    footer: await getPartFromFile(
      parts.footer,
      path.resolve(partsDir, 'footer.html'),
    ),
    style: await getPartFromFile(
      parts.style,
      path.resolve(partsDir, 'markdown-style.css'),
    ),
  };
};

const main = async () => {
  yargs.usage('Usage: $0 [options] INPUT-DIR OUTPUT-DIR');
  yargs.option('header', { nargs: 1, description: 'ヘッダファイル' });
  yargs.option('footer', { nargs: 1, description: 'フッタファイル' });
  yargs.option('css', { nargs: 1, description: 'CSSファイル' });

  const { _, header, footer, css } = yargs.argv;

  if (_.length !== 2) {
    yargs.showHelp();
    return;
  }

  const parts = { header, footer, css };
  await build(_[0], _[1], await getParts(parts));
};

module.exports = () => {
  main().catch(console.error);
};
