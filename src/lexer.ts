type TokenType = "Command" | "String" | "Number" | "Identifier" | "Comparison" | "Boolean" | "Other";

export interface Token {
  type: TokenType;
  value: string | number;
}

export interface Line {
  tokens: Token[];
}

function describe(word: string, index: number): Token {
  if (index === 0) {
    return {
      type: "Command",
      value: word
    }
  }
  if (word[0] === '"' && word[word.length - 1] === '"') {
    return {
      type: "String",
      value: word.substring(1, word.length - 1)
    }
  }
  const num = parseFloat(word);
  if (!isNaN(num)) {
    return {
      type: "Number",
      value: num
    }
  }
  if (word[0] === "$") {
    return {
      type: "Identifier",
      value: word.substring(1, word.length)
    }
  }
  if (word.match(/=|!=|>|<|>=|<=/)) {
    return {
      type: "Comparison",
      value: word.substring(0, word.length)
    }
  }
  if (word === "true" || word === "false") {
    return {
      type: "Boolean",
      value: word
    }
  }
  return {
    type: "Other",
    value: word
  }
}

function lex(code: string) {
  return code.split("\n")
    .filter(function (t) { return t.trim().length > 0 })
    .map(line => {
      const tokens: Token[] = line.split(/('.*?'|".*?"|\S+)/)
        .filter(function (t) {
          return t.trim().length > 0
        })
        .map((word, index) => {
          return describe(word, index);
        });
      return {tokens};
    });
}

export default lex;
