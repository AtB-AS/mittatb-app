import React from 'react';
import {TextProps} from 'react-native';
import Text from '../text';

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
      } ${pauseAfter ? screenreaderPause : ' '}`}
      {...props}
    >
      {children ?? ' '}
    </Text>
  );
};
export const screenreaderPause = '\n';
export default AccessibleText;
