import React from 'react';
import {marked, Token, Tokens} from 'marked';
import {Text} from 'react-native';

export function stripMarkdown(markdown: string): React.ReactElement[] {
  const tree = marked.lexer(markdown);
  return tree.map(stripToken);
}

const stripToken = (token: Token, index: number) => {
  switch (token.type) {
    case 'text':
    case 'heading':
    case 'strong':
    case 'html':
    case 'em':
    case 'link':
      return <Text key={index}>{token.text}</Text>;
    case 'paragraph':
      return (
        <React.Fragment key={index}>
          {token.tokens?.map(stripToken)}
        </React.Fragment>
      );
    case 'br':
    case 'space':
      return <Text key={index}> </Text>;
    case 'list':
      return (
        <Text key={index}>
          {token.items?.map((item: Tokens.ListItem) => `${item.text} `)}
        </Text>
      );
    default:
      return <Text key={index}>{token.raw}</Text>;
  }
};
