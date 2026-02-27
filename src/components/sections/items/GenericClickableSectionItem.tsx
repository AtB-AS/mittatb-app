import React, {PropsWithChildren, forwardRef} from 'react';
import {AccessibilityProps} from 'react-native';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {NativeBlockButton} from '@atb/components/native-button';

type Props = PropsWithChildren<
  SectionItemProps<
    {
      onPress?(): void;
      disabled?: boolean;
    } & AccessibilityProps
  >
>;

export const GenericClickableSectionItem = forwardRef<any, Props>(
  ({children, ...props}, focusRef) => {
    const {topContainer} = useSectionItem(props);

    return (
      <NativeBlockButton
        {...props}
        ref={focusRef}
        style={[props.disabled && {opacity: 0.5}, topContainer]}
      >
        {children}
      </NativeBlockButton>
    );
  },
);
