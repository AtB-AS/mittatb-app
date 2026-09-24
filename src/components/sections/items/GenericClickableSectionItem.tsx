import React, {PropsWithChildren, forwardRef} from 'react';
import {AccessibilityProps} from 'react-native';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {NativeTouchable} from '@atb/components/native-touchable';

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
      <NativeTouchable
        variant="block"
        {...props}
        ref={focusRef}
        style={[props.disabled && {opacity: 0.5}, topContainer]}
      >
        {children}
      </NativeTouchable>
    );
  },
);
