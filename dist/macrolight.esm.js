// hl-keywords.js
var HL_KEYWORDS = {
  typescript: ["goto", "in", "instanceof", "static", "finally", "arguments", "public", "do", "else", "const", "function", "class", "return", "let", "catch", "eval", "for", "if", "this", "try", "break", "debugger", "yield", "extends", "enum", "continue", "export", "null", "switch", "private", "new", "throw", "while", "case", "await", "delete", "super", "default", "void", "var", "protected", "package", "interface", "false", "typeof", "implements", "with", "import", "true"],
  c: ["auto", "break", "case", "char", "const", "continue", "default", "do", "double", "else", "enum", "extern", "float", "for", "goto", "if", "int", "long", "register", "return", "short", "signed", "sizeof", "static", "struct", "switch", "typedef", "union", "unsigned", "void", "volatile", "while"],
  html: ["doctype", "a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bb", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "datagrid", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "eventsource", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "isindex", "kbd", "keygen", "label", "legend", "li", "link", "map", "mark", "menu", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strike", "strong", "style", "sub", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"],
  python: ["False", "await", "else", "import", "pass", "None", "break", "except", "in", "raise", "True", "class", "finally", "is", "return", "and", "continue", "for", "lambda", "try", "as", "def", "from", "nonlocal", "while", "assert", "del", "global", "not", "with", "async", "elif", "if", "or", "yield", "map", "__init__", "sum", "list", "input"],
  rust: ["union", "'static", "dyn", "as", "break", "const", "continue", "crate", "else", "enum", "extern", "false", "fn", "for", "if", "impl", "in", "let", "loop", "match", "mod", "move", "mut", "pub", "ref", "return", "self", "Self", "static", "struct", "super", "trait", "true", "type", "unsafe", "use", "where", "while", "async", "await", "dyn", "abstract", "become", "box", "do", "final", "macro", "override", "priv", "typeof", "unsized", "virtual", "yield", "try"]
};
var HL_ALIASES = {
  python: ["py"],
  typescript: ["js", "ts", "javascript"],
  rust: ["rs"]
};
for (const [key, val] of Object.entries(HL_ALIASES)) {
  val.forEach((alias) => HL_KEYWORDS[alias] = HL_KEYWORDS[key]);
}

// macrolight.js
var escape = (str) => {
  if (!str)
    return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
};
var highlight = function(src, config = {}) {
  const styles = {
    unformatted: "",
    keyword: "font-weight: bold",
    punctuation: "color: gray",
    string: "color: #009bff",
    comment: "font-style: italic; color: gray"
  };
  let shouldEscape = true;
  if (config.dontEscape)
    shouldEscape = false;
  Object.assign(styles, config.styles || {});
  const isKeyword = (token2) => {
    const keywords = config.keywords || [];
    return keywords.includes(token2);
  };
  const text = typeof src === "object" && "textContent" in src ? src.textContent : src;
  let pos = 0;
  let next = text[0];
  let char = 1;
  let prev;
  let prev_prev;
  let token = "";
  let result = "";
  let tokenType = 0;
  let lastTokenType = -1;
  let multichar = false;
  const shouldFinalizeToken = (currentChar) => {
    if (!currentChar)
      return true;
    if (tokenType < 8 && currentChar == "\n")
      return true;
    return [
      /\S/.test(currentChar),
      true,
      true,
      !/[$\w]/.test(currentChar),
      (prev === "/" || prev == "\n") && multichar,
      prev === '"' && multichar,
      prev === "'" && multichar,
      text[pos - 4] + prev_prev + prev == "-->",
      prev_prev + prev === "*/",
      currentChar === "\n",
      currentChar === "\n"
    ][tokenType];
  };
  while (prev_prev = prev, prev = tokenType < 7 && prev == "\\" ? 1 : char) {
    char = next;
    next = text[++pos];
    multichar = token.length > 1;
    if (shouldFinalizeToken(char)) {
      if (token) {
        let styleIdx = "unformatted";
        if (tokenType > 6)
          styleIdx = "comment";
        else if (tokenType > 3)
          styleIdx = "string";
        else if (tokenType < 3)
          styleIdx = "punctuation";
        else
          styleIdx = isKeyword(token) ? "keyword" : "unformatted";
        const style = styles[styleIdx];
        result += `<span${style ? ` style="${style}"` : ""} class='macrolight-${styleIdx}'>${shouldEscape ? escape(token) : token}</span>`;
      }
      lastTokenType = tokenType && tokenType < 7 ? tokenType : lastTokenType;
      token = "";
      if (char == "#")
        tokenType = 10;
      else if (char + next == "//")
        tokenType = 9;
      else if (char + next == "/*")
        tokenType = 8;
      else if (char + next + text[pos + 1] + text[pos + 2] == "<!--")
        tokenType = 7;
      else if (char == "'")
        tokenType = 6;
      else if (char == '"')
        tokenType = 5;
      else if (char == "/" && lastTokenType < 2 && prev != "<")
        tokenType = 4;
      else if (/[$\w]/.test(char))
        tokenType = 3;
      else if (/[\])]/.test(char))
        tokenType = 2;
      else if (/[\/{}[(\-+*=<>:;|\\.,?!&@~]/.test(char))
        tokenType = 1;
      else
        tokenType = 0;
    }
    token += char;
  }
  return result;
};
var highlightAll = (config = {}, selector = ".macrolight") => {
  const elts = document.querySelectorAll(selector) || [];
  Array.from(elts).forEach((elem) => {
    elem.innerHTML = highlight(elem, config);
  });
};
export {
  HL_KEYWORDS,
  highlight,
  highlightAll
};
