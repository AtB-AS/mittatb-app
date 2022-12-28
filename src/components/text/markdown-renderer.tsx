import React from 'react';
import {marked} from 'marked';
import {Linking, Text} from 'react-native';
import {textTypeStyles} from '@atb/theme/colors';
import Bugsnag from '@bugsnag/react-native';

export function renderMarkdown(markdown: string): React.ReactElement[] {
  const tree = marked.lexer(markdown, {smartypants: true});
  return tree.map(renderToken);
}

function renderToken(token: marked.Token, index: number): React.ReactElement {
  switch (token.type) {
    case 'text':
      return <Text key={index}>{token.text}</Text>;

    case 'strong':
      return (
        <Text
          key={index}
          style={{fontWeight: textTypeStyles['body__primary--bold'].fontWeight}}
        >
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
        try {
          await Linking.openURL(url);
        } catch (err: any) {
          Bugsnag.notify(err);
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
