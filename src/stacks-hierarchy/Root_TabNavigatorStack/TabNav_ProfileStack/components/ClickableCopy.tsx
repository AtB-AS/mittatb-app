import {NativeButton} from '@atb/components/native-button';
import Clipboard from '@react-native-clipboard/clipboard';
import React, {PropsWithChildren, useState} from 'react';
import {AccessibilityProps} from 'react-native';

type ClickableCopyProps = PropsWithChildren<
  {
    duration?: number;
    copyContent: string;
    successElement: React.ReactNode;
  } & AccessibilityProps
>;
export function ClickableCopy({
  duration = 5000,
  children,
  copyContent,
  successElement,
  ...props
}: ClickableCopyProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  function setClipboard() {
    Clipboard.setString(copyContent);

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), duration);
  }

  return (
    <NativeButton disabled={isAnimating} onPress={setClipboard} {...props}>
      {isAnimating ? successElement : children}
    </NativeButton>
  );
}
