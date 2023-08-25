import Clipboard from '@react-native-clipboard/clipboard';
import React, {PropsWithChildren, useState} from 'react';
import {TouchableOpacity} from 'react-native';

type ClickableCopyProps = PropsWithChildren<{
  duration?: number;
  copyContent: string;
  successElement: React.ReactNode;
}>;
export function ClickableCopy({
  duration = 5000,
  children,
  copyContent,
  successElement,
}: ClickableCopyProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  function setClipboard() {
    Clipboard.setString(copyContent);

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), duration);
  }

  return (
    <TouchableOpacity disabled={isAnimating} onPress={setClipboard}>
      {isAnimating ? successElement : children}
    </TouchableOpacity>
  );
}
