import React from 'react';
import {Linking, Text} from 'react-native';
import {lexer, Token} from 'marked';

export default function render(markdown: string): React.ReactElement[] {
  const tree = lexer(markdown);
  return tree.map(renderToken);
}

function renderToken(token: Token, index: number): React.ReactElement {
  switch (token.type) {
    case 'text':
      return <Text key={index}>{token.text}</Text>;

    case 'strong':
      return (
        <Text key={index} style={{fontWeight: 'bold'}}>
          {token.text}
        </Text>
      );

    case 'paragraph':
      return (
        <React.Fragment key={index}>
          {token.tokens.map(renderToken)}
        </React.Fragment>
      );

    case 'space':
      return <Text key={index}>{'\n'}</Text>;

    case 'em':
      return (
        <Text key={index} style={{fontStyle: 'italic'}}>
          {token.text}
        </Text>
      );

    case 'link':
      const url = token.href;
      async function openLink() {
        if (await Linking.canOpenURL(url)) {
          await Linking.openURL(url);
        }
      }
      return (
        <Text
          key={index}
          style={{textDecorationLine: 'underline'}}
          onPress={openLink}
        >
          {token.text}
        </Text>
      );

    default:
      console.warn(
        `We haven't defined a renderer for markdown type: "${token.type}", rendering raw: "${token.raw}"`,
      );
      return <Text key={index}>{token.raw}</Text>;
  }
}
