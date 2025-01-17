import React from 'react';
import {marked} from 'marked';
import {Linking, Text, View} from 'react-native';
import {textTypeStyles} from '@atb/theme/colors';
import Bugsnag from '@bugsnag/react-native';
import {ThemeTextProps} from './ThemeText';

type MarkdownRendererProps = {
  // When rendering a list, this is the spacing between the list elements
  spacingBetweenListElements?: number;
  // The props to pass to the Text component
  textProps?: ThemeTextProps;
};

export function renderMarkdown(
  markdown: string,
  props: MarkdownRendererProps,
): React.ReactElement[] {
  const tree = marked.lexer(markdown, {smartypants: true});
  return tree.map((token, index) => renderToken(token, index, props));
}

function renderToken(
  token: marked.Token,
  index: number,
  props: MarkdownRendererProps,
): React.ReactElement {
  switch (token.type) {
    case 'text':
      return (
        <Text key={index} {...props.textProps}>
          {token.text}
        </Text>
      );

    case 'heading':
    case 'strong':
      return (
        <Text
          key={index}
          {...props.textProps}
          style={{fontWeight: textTypeStyles['body__primary--bold'].fontWeight}}
        >
          {token.text}
        </Text>
      );

    case 'html':
      return token.raw === '<br>' ? (
        <Text key={index}>{'\n'}</Text>
      ) : (
        <Text key={index} {...props.textProps}>
          {token.raw}
        </Text>
      );

    case 'paragraph':
      return (
        <Text key={index} {...props.textProps}>
          {token.tokens.map((t, i) => renderToken(t, i, props))}
        </Text>
      );

    case 'br':
    case 'space':
      return <Text key={index} />;

    case 'em':
      return (
        <Text key={index} {...props.textProps} style={{fontStyle: 'italic'}}>
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
          onPress={openLink}
          {...props.textProps}
          style={{textDecorationLine: 'underline'}}
        >
          {token.text}
        </Text>
      );
    case 'list':
      return (
        <React.Fragment key={index}>
          {token.items.map((item, itemIndex) => (
            <View
              key={itemIndex}
              style={{
                flexDirection: 'row',
                paddingTop: props.spacingBetweenListElements ?? 0,
              }}
            >
              <Text {...props.textProps}>{'\u2022 '}</Text>
              <Text {...props.textProps}>{item.text}</Text>
            </View>
          ))}
        </React.Fragment>
      );

    default:
      console.warn(
        `We haven't defined a renderer for markdown type: "${token.type}", rendering raw: "${token.raw}"`,
      );
      return (
        <Text key={index} {...props.textProps}>
          {token.raw}
        </Text>
      );
  }
}
