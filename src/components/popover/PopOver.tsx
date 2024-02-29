import RNPopover from 'react-native-popover-view';
import React, {Component} from 'react';
import {
  Dimensions,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet} from '@atb/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export type PopOverProps = {
  from: React.RefObject<Component | null>;
  heading?: string;
  text: string;
  isOpen?: boolean;
  onClose?: () => void;
  animationDuration?: number;
};
export const PopOver = ({
  from,
  isOpen,
  onClose,
  heading,
  text,
  animationDuration = 200,
}: PopOverProps) => {
  const style = useStyles();
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <RNPopover
      from={from}
      isVisible={isOpen}
      onCloseComplete={handleClose}
      onRequestClose={handleClose}
      animationConfig={{duration: animationDuration}}
      popoverStyle={style.popover}
      displayAreaInsets={insets}
      verticalOffset={
        Platform.OS === 'android' ? -(StatusBar.currentHeight ?? 0) : 0
      }
      backgroundStyle={style.backdrop}
    >
      <View style={style.heading}>
        <ThemeText type="body__primary--bold">{heading}</ThemeText>
        <TouchableOpacity onPress={handleClose} testID="closePopover">
          <ThemeIcon style={style.closeIcon} svg={Close} />
        </TouchableOpacity>
      </View>
      <ThemeText>{text}</ThemeText>
    </RNPopover>
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
  backdrop: {
    backgroundColor: theme.static.background.background_accent_1.background,
    opacity: 0.5,
  },
}));
