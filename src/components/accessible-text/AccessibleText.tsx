import React from 'react';
import ThemeText, {ThemeTextProps} from '@atb/components/text';
import {screenReaderPause} from './utils';

type LabelProps = ThemeTextProps & {
  prefix?: string;
  suffix?: string;
  children?: string;
  pause?: 'before' | 'after' | 'none';
};

const AccessibleText = ({
  prefix,
  suffix,
  children,
  pause = 'after',
  ...props
}: LabelProps) => {
  return (
    <ThemeText
      accessibilityLabel={`${pause === 'before' ? screenReaderPause : ''} ${
        prefix ?? ''
      } ${children ?? ''} ${suffix ?? ''} ${
        pause === 'after' ? screenReaderPause : ''
      }`}
      {...props}
    >
      {children ?? ' '}
    </ThemeText>
  );
};
export default AccessibleText;
