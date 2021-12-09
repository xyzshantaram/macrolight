# macrolight

_syntax highlighting, some assembly required_

A modernized, more maintainable, and configurable version of Dmitry Prokashev's
[microlight syntax highlighter](https://asvd.github.io/microlight).

### Usage

#### Installation

```sh
$ npm i macrolight
```

or in a browser / Deno:

```js
import { highlight, highlightAll } from "https://esm.sh/macrolight";
```

#### API

There are two methods:

- [`highlight`](#highlight)
- [`highlightAll`](#highlightall)

#### `highlight`

```ts
highlight (src: Element | string, config: Record<string, string> = {}): string
```

`highlight` takes in either an element or a plain string, and returns its
contents syntax highlighted.

The `config` object can be used to change its behaviour.

`config` is an object that can have the following properties:

- `keywords`: a list of words to highlight as keywords.
- `styles`: an object with any of the following properties:
  - `unformatted` - a string that will be used as the style attribute for
    unformatted text.
  - `keyword` - a string that will be used as the style attribute for keywords.
  - `punctuation` - a string that will be used as the style attribute for
    punctuation characters.
  - `string` - a string that will be used as the style attribute for strings and
    regexes.
  - `comment` - a string that will be used as the style attribute for comments.
- `dontEscape` - a boolean variable that, when set, disables the escaping of
  quotes, ampersands, apostrophes, and greater-than/less-than signs in generated
  HTML.

For example:

```js
highlight(document.querySelector("#highlighted"), {
  keywords: ["const", "let", "import", "from", "in"],
  styles: {
    "comment": "font-style: italic; color: gray",
    "punctuation": "color: orange",
  },
});
```

```js
highlight('const a = "<test>contents</test>";', {
  keywords: ["const", "test"],
  styles: {
    "comment": "font-style: italic; color: gray",
    "punctuation": "color: orange",
  },
});
```

**Note that macrolight does NOT highlight any keywords by default.**

#### `highlightAll`

```ts
highlightAll (config: Record<string, string> = {}, selector: string = '.macrolight'): void
```

`highlightAll` highlights all elements that match a certain selector
(`.macrolight` by default). The `config` object is the same as the one described
above for `highlight`.

#### HL_KEYWORDS

A small set of keywords is also exported by macrolight. You can use these by
importing them the usual way:

```js
import { HL_KEYWORDS } from "https://esm.sh/macrolight";
```

and then use them like so:

```js
let lang = "py";
highlightAll({
  keywords: HL_KEYWORDS[lang],
});
```

To combine all the keywords into one long list, you can write a simple
expression like:

```js
const COMBINED_KEYWORDS = Object.values(HL_KEYWORDS).reduce(
  (acc, curr) => [...acc, curr],
  [],
);
highlightAll({
  keywords: COMBINED_KEYWORDS,
});
```

If you would like to use this list with TypeScript, you may encounter an issue
where the list is treated implictly as `any`. To work around this, you can do
something like:

```ts
// in a file by itself
import { HL_KEYWORDS as _HL_KEYWORDS } from "https://esm.sh/macrolight";
export const HL_KEYWORDS: Record<string, string[]> = _HL_KEYWORDS;
```

Finally, if there's a language you'd like to add keywords / aliases for, feel
free to do so by editing [`hl-keywords.js`](hl-keywords.js) and sending a pull
request.

#### Misc notes

macrolight also adds the classes

- `macrolight-unformatted`
- `macrolight-keyword`
- `macrolight-punctuation`
- `macrolight-string`
- `macrolight-comment`

on generated spans so you can style them with CSS.

### LICENSE

macrolight is free, open-source software under the [MIT License](LICENSE).
Copyright © 2021 Siddharth Singh.

macrolight is a fork of Dmitry Prokashev's
[microlight](https://github.com/asvd/microlight). microlight is free,
open-source software under the
[MIT License](https://github.com/asvd/microlight/blob/master/LICENSE). Copyright
© 2016 asvd.
