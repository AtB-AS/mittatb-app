import RnPopover from 'react-native-popover-view';
import React, {ReactNode, RefObject} from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet} from '@atb/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused} from '@react-navigation/native';

export type PopoverProps = {
  from: RefObject<View> | ReactNode;
  heading?: string;
  text: string;
  isOpen?: boolean;
  onClose?: () => void;
};
export const Popover = ({
  from,
  isOpen,
  onClose,
  heading,
  text,
}: PopoverProps) => {
  const style = useStyles();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const onRequestClose = () => {
    if (onClose) onClose();
  };

  if (!isFocused) return null;

  return (
    <RnPopover
      from={from}
      isVisible={isOpen}
      onRequestClose={onRequestClose}
      popoverStyle={style.popover}
      displayAreaInsets={insets}
    >
      <View>
        <View style={style.heading}>
          <ThemeText type={'body__primary--bold'}>{heading}</ThemeText>
          <TouchableOpacity onPress={onRequestClose}>
            <ThemeIcon style={style.closeIcon} svg={Close} />
          </TouchableOpacity>
        </View>
        <ThemeText>{text}</ThemeText>
      </View>
    </RnPopover>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  popover: {
    maxWidth: Dimensions.get('window').width * 0.6,
    borderRadius: theme.border.radius.regular,
    padding: theme.spacings.medium,
    backgroundColor: theme.static.background.background_0.background,
  },
  closeIcon: {
    marginLeft: theme.spacings.small,
  },
  heading: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacings.small,
  },
}));
