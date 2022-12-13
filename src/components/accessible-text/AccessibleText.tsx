import React from 'react';
import ThemeText, {ThemeTextProps} from '@atb/components/text';
import {screenReaderPause} from './utils';

type LabelProps = Omit<ThemeTextProps, 'isMarkdown'> & {
  prefix?: string;
  suffix?: string;
  children?: string;
  pause?: 'before' | 'after' | 'both' | 'none';
};

const AccessibleText = ({
  prefix,
  suffix,
  children,
  pause = 'after',
  ...props
}: LabelProps) => {
  const pauseBefore = pause === 'before' || pause === 'both';
  const pauseAfter = pause === 'after' || pause === 'both';
  return (
    <ThemeText
      accessibilityLabel={`${pauseBefore ? screenReaderPause : ''} ${
        prefix ?? ''
      } ${children ?? ''} ${suffix ?? ''} ${
        pauseAfter ? screenReaderPause : ''
      }`}
      {...props}
    >
      {children ?? ' '}
    </ThemeText>
  );
};
export default AccessibleText;
