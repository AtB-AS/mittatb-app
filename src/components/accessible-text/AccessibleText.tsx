import React from 'react';
import ThemeText, {ThemeTextProps} from '@atb/components/text';
import {screenReaderPause} from './utils';

type LabelProps = ThemeTextProps & {
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
    <ThemeText
      accessibilityLabel={`${prefix ?? ''} : ${children ?? ''} ${
        suffix ?? ''
      } ${pauseAfter ? screenReaderPause : ' '}`}
      {...props}
    >
      {children ?? ' '}
    </ThemeText>
  );
};
export default AccessibleText;
