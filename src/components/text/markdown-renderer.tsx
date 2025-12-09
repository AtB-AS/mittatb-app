import React from 'react';
import {marked, Token, Tokens} from 'marked';
import {Text, View} from 'react-native';
import {textTypeStyles} from '@atb/theme/colors';
import Bugsnag from '@bugsnag/react-native';
import {ThemeTextProps} from './ThemeText';
import {openInAppBrowser} from '@atb/modules/in-app-browser';
import {getTextWeightStyle} from './utils';

const MAX_RECURSION_DEPTH = 20;

type MarkdownRendererProps = {
  // When rendering a list, this is the spacing between the list elements
  spacingBetweenListElements?: number;
  // The props to pass to the Text component
  textProps?: ThemeTextProps;
  androidSystemFont: boolean;
};

export function renderMarkdown(
  markdown: string,
  props: MarkdownRendererProps,
): React.ReactElement[] {
  const tree = marked.lexer(markdown);
  return tree.map((token, index) => renderToken(token, index, props));
}

function renderToken(
  token: Token,
  index: number,
  props: MarkdownRendererProps,
  depth = 0,
): React.ReactElement {
  if (depth > MAX_RECURSION_DEPTH) {
    console.warn(
      `Markdown render: max recursion depth (${MAX_RECURSION_DEPTH}) exceeded.`,
    );
    return (
      <Text key={index} {...props.textProps}>
        {token.raw}
      </Text>
    );
  }

  const renderChildren = (tokens?: Token[]) =>
    tokens?.map((t, i) => renderToken(t, i, props, depth + 1));

  switch (token.type) {
    case 'text':
      return (
        <Text key={index} {...props.textProps}>
          {token.text}
        </Text>
      );

    case 'heading':
    case 'strong':
      const fontWeight = textTypeStyles['body__m__strong'].fontWeight;
      const textWeightStyle = getTextWeightStyle(
        props.androidSystemFont,
        fontWeight,
      );
      return (
        <Text
          key={index}
          {...props.textProps}
          style={[props.textProps?.style, textWeightStyle]}
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
          {renderChildren(token.tokens)}
        </Text>
      );

    case 'br':
    case 'space':
      return <Text accessible={false} key={index} />;

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
          await openInAppBrowser(url, 'close');
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
          {token.items?.map((item: Tokens.ListItem, itemIndex: number) => (
            <View
              key={itemIndex}
              style={{
                flexDirection: 'row',
                paddingTop: props.spacingBetweenListElements ?? 0,
              }}
              accessibilityLabel={`${
                token.ordered ? `${itemIndex + 1}.` : '\u2022,'
              } ${item.text}`}
              accessible={true}
            >
              <Text {...props.textProps}>
                {token.ordered ? `${itemIndex + 1}. ` : '\u2022 '}
              </Text>
              <Text
                {...props.textProps}
                style={[
                  props.textProps?.style,
                  {
                    flex: 1,
                    flexWrap: 'wrap',
                  },
                ]}
              >
                {item.text}
              </Text>
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
