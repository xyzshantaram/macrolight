var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// macrolight.js
__export(exports, {
  highlight: () => highlight,
  highlightAll: () => highlightAll
});
var highlight = function(src, config = {}) {
  const styles = {
    unformatted: "",
    keyword: "font-weight: bold",
    punctuation: "",
    string: "color: blue",
    comment: "font-style: italic; color: gray"
  };
  Object.assign(styles, config.styles || {});
  const isKeyword = (token2) => {
    const keywords = config.keywords || [];
    return keywords.includes(token2);
  };
  const text = "textContent" in src ? src.textContent : src;
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
        result += `<span ${style ? `style="${style}"` : ""}>${token}</span>`;
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
