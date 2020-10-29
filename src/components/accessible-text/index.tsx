import React from 'react';
import ThemeText, {ThemeTextProps} from '../text';

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
export const screenReaderPause = '\n';
export default AccessibleText;
