import Popover from 'react-native-popover-view';
import React, {ReactNode, RefObject, useEffect, useRef} from 'react';
import {
  AccessibilityInfo,
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
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';

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
  const {t} = useTranslation();
  const contentRef = useRef(null);
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  const shouldShow = isOpen && !isScreenReaderEnabled;

  useEffect(() => {
    console.log('screen reader', isScreenReaderEnabled, 'isOpen', isOpen);
    if (isOpen && isScreenReaderEnabled) {
      AccessibilityInfo.announceForAccessibility(`${heading}. ${text}`);
    }
  }, [isOpen, isScreenReaderEnabled]);

  const onRequestClose = () => {
    if (onClose) onClose();
  };

  if (!isFocused) return null;

  return (
    <Popover
      from={from}
      isVisible={shouldShow}
      onRequestClose={onRequestClose}
      popoverStyle={style.popover}
      displayAreaInsets={insets}
      verticalOffset={
        Platform.OS === 'android' ? -(StatusBar.currentHeight ?? 0) : 0
      }
    >
      <View
        accessible={true}
        accessibilityLabel={`${heading}. ${text}`}
        accessibilityRole={'button'}
        onAccessibilityTap={onRequestClose}
        ref={contentRef}
      >
        <View style={style.heading}>
          <ThemeText accessibilityLabel={heading} type={'body__primary--bold'}>
            {heading}
          </ThemeText>
          <TouchableOpacity
            onPress={onRequestClose}
            accessibilityLabel={t(ScreenHeaderTexts.headerButton.close.text)}
          >
            <ThemeIcon style={style.closeIcon} svg={Close} />
          </TouchableOpacity>
        </View>
        <ThemeText accessibilityLabel={text}>{text}</ThemeText>
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
