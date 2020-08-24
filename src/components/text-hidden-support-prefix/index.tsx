import React from 'react';
import {Text, TextProps} from 'react-native';

type LabelProps = TextProps & {prefix: string; children?: string};

const TextHiddenSupportPrefix = ({prefix, children, ...props}: LabelProps) => {
  return (
    <Text accessibilityLabel={`${prefix}: ${children}`} {...props}>
      {children}
    </Text>
  );
};
export default TextHiddenSupportPrefix;
