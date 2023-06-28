import RnPopover from 'react-native-popover-view';
import React, {ReactNode, RefObject, useState} from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet} from '@atb/theme';

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
  const [isVisible, setIsVisible] = useState(isOpen);

  const onRequestClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <RnPopover
      from={from}
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      popoverStyle={style.popover}
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
