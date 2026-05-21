import {MessageInfoBox} from '@atb/components/message-info-box';
import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {useDebugServerOverrides} from './use-debug-server-overrides';

type Props = {style?: StyleProp<ViewStyle>};

export const DebugServerOverrideBanner = ({style}: Props) => {
  const overrides = useDebugServerOverrides();
  if (!overrides.length) return null;
  const message = overrides.map((o) => o.newValue).join('\n');
  return (
    <MessageInfoBox
      type="warning"
      title="Server override active"
      message={message}
      style={style}
    />
  );
};
