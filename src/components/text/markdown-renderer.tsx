import React from 'react';
import {Text} from 'react-native';
import {lexer, Token} from 'marked';

type MarkdownRenderer = () => React.ReactElement;

export default function render(markdown: string): React.ReactElement[] {
  const tree = lexer(markdown);
  return tree.map(getRenderer).map((re) => re());
}

function getRenderer(token: Token, index: number): MarkdownRenderer {
  switch (token.type) {
    case 'text':
      return () => <Text key={index}>{token.text}</Text>;
    case 'strong':
      return () => (
        <Text key={index} style={{fontWeight: 'bold'}}>
          {token.text}
        </Text>
      );
    case 'paragraph':
      return () => (
        <React.Fragment key={index}>
          {token.tokens.map(getRenderer).map((re) => re())}
        </React.Fragment>
      );
    case 'space':
      return () => <Text key={index}>{'\n'}</Text>;
    default:
      console.warn(
        `We haven't defined a renderer for markdown type: "${token.type}", rendering raw: "${token.raw}"`,
      );
      return () => <Text key={index}>{token.raw}</Text>;
  }
}
