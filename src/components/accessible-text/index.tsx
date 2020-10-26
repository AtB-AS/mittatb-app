import React from 'react';
import {TextProps} from 'react-native';
import ThemedText from '../text';

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
    <ThemedText
      accessibilityLabel={`${prefix ?? ''} : ${children ?? ''} ${
        suffix ?? ''
      } ${pauseAfter ? screenreaderPause : ' '}`}
      {...props}
    >
      {children ?? ' '}
    </ThemedText>
  );
};
export const screenreaderPause = '\n';
export default AccessibleText;
