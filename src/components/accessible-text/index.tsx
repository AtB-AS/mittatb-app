import React from 'react';
import {Text, TextProps} from 'react-native';

type LabelProps = TextProps & {
  prefix?: string;
  appendix?: string;
  children?: string;
  pauseAfter?: boolean;
};

const AccessibleText = ({
  prefix,
  appendix,
  children,
  pauseAfter = true,
  ...props
}: LabelProps) => {
  return (
    <Text
      accessibilityLabel={`${prefix ?? ''} : ${children ?? ''} ${
        appendix ?? ''
      } ${pauseAfter ? screenreaderPause : ' '}`}
      {...props}
    >
      {children ?? ' '}
    </Text>
  );
};
export const screenreaderPause = '\n';
export default AccessibleText;
