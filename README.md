# md-doc

- Document generator with markdown.

## CLI Usage

```sh
$ md-doc [options] INPUT OUTPUT
```

- INPUT
  - 入力元
  - 拡張子が`md`のファイルすべてを対象にする
    - ファイル名先頭が`_`のものは無視
  - 拡張子が以下のファイルは画像としてすべてコピーされる
    - `gif`
    - `png`
    - `jpg` / `jpeg`
    - `svg` / `svgz`
- OUTPUT
  - 出力先
  - 入力元の階層を再現する
  - 出力は HTML と PDF となる

## CLI Options

### --header-file FILE

- ヘッダファイル
- 省略時はシンプルな HTML5 のヘッダ（default-fragments/header.html）

### --footer-file FILE

- フッタファイル
- 省略時はシンプルな HTML5 のフッタ（default-fragments/footer.html）

### --css-file FILE

- スタイルシートファイル
- 省略時は内蔵の CSS（default-fragments/md-doc.css）
- `--css-url`と同時指定した場合はこちらは使用されない

### --css-url

- スタイルシートの URL
- `--css-file`と同時指定した場合はこちらを優先
- ビルド時にダウンロードして埋め込むので url や@import を使っている場合は正常に表示されない

### --delete-directory

- 指定された場合は出力前に出力ディレクトリを削除する

## Markdown の書式

### ファイルのインクルード

```markdown
`!!! include(FILENAME) !!!`
```

- FILENAME: 入力元ディレクトリからの相対パスでファイルを指定
- 前後にバッククォートが必要（prettier の整形回避のため)

### 画像

```markdown
`![画像](FILENAME)`
```

- FILENAME: ファイルからの相対パスでファイルを指定
- 入力ディレクトリ以外の参照は無視

### 改ページ不可ブロック

```markdown
::: .group
.
.
.
:::
```

- `::: .group`から次の`...`までが改ページ不可のブロックとなる

## オプション指定での挿し込みファイルの書式

Mustache 形式での変数展開が可能。
定義済みの変数は以下の通り。

| 変数名 | 内容                                     |
| ------ | ---------------------------------------- |
| title  | 文書のタイトル（最初に見つかった見出し） |
