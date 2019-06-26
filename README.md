# md-doc

- Document generator with markdown.

<!-- ## Usage

```sh
$ md-doc [options] INPUT-DIR OUTPUT-DIR
```

- INPUT-DIR

  - Directory for input.
  - Scan `**/*.md` to build.
    - Ignore underscore prefixed file name.

- OUTPUT-DIR
  - Directory for output.
  - Keep input directory hierarchy.

example:

```shell
$ find input-dir -type f
input-dir/foo.md
input-dir/bar.md
input-dir/_baz.md
input-dir/qux/quux.md

$ md-doc input-dir output-dir

$ find output-dir -type f
output-dir/foo.html
output-dir/bar.html
output-dir/qux/quux.html
```

## Options

### --header FILE

- Header file for HTML.
- Default, use simple HTML5 header.

### --footer FILE

- Footer file for HTML.
- Default, use simple HTML5 footer.

### --css FILE

- Css file.
- Default, use <a href="https://github.com/gct256/markdown-style">gct256/markdown-style</a>

## Markdown extended syntax

### Include

```markdown
`!!! include(FILENAME) !!!`
```

- FILENAME: relative path from input directory.
- Do not forget single quote. (Purpose avoid prettier formating)

## header, footer, css file syntax

### title

```
{{ title }}
```

- Expand to document title (first heading). -->
