import React from 'react';
import {Text, TextProps} from 'react-native';

type LabelProps = TextProps & {
  prefix?: string;
  suffix?: string;
  children?: string;
  pauseAfter?: boolean;
};

const AccessibleText = ({
  prefix,
  suffix,
  children,
  pauseAfter = true,
  ...props
}: LabelProps) => {
  return (
    <Text
      accessibilityLabel={`${prefix ?? ''} : ${children ?? ''} ${
        suffix ?? ''
      } ${pauseAfter ? screenReaderPause : ' '}`}
      {...props}
    >
      {children ?? ' '}
    </Text>
  );
};
export const screenReaderPause = '\n';
export default AccessibleText;
