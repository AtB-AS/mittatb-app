import Popover from 'react-native-popover-view';
import React, {ReactNode, RefObject} from 'react';
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
import {useIsFocused} from '@react-navigation/native';

export type ToolTipProps = {
  from: RefObject<View> | ReactNode;
  heading?: string;
  text: string;
  isOpen?: boolean;
  onClose?: () => void;
};
export const ToolTip = ({
  from,
  isOpen,
  onClose,
  heading,
  text,
}: ToolTipProps) => {
  const style = useStyles();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const onRequestClose = () => {
    if (onClose) onClose();
  };

  if (!isFocused) return null;

  return (
    <Popover
      from={from}
      isVisible={isOpen}
      onRequestClose={onRequestClose}
      popoverStyle={style.popover}
      displayAreaInsets={insets}
      verticalOffset={
        Platform.OS === 'android' ? -(StatusBar.currentHeight ?? 0) : 0
      }
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
    </Popover>
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
