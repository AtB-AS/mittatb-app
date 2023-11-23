import Popover from 'react-native-popover-view';
import React, {useRef} from 'react';
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
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';

export type ToolTipProps = {
  from: React.RefObject<JSX.Element | null>;
  heading?: string;
  text: string;
  isOpen?: boolean;
  onClose?: () => void;
  animationDuration?: number;
};
export const ToolTip = ({
  from,
  isOpen,
  onClose,
  heading,
  text,
  animationDuration = 200,
}: ToolTipProps) => {
  const style = useStyles();
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();
  const contentRef = useRef(null);
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  const shouldShow = isOpen && !isScreenReaderEnabled;

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <Popover
      from={from}
      isVisible={shouldShow}
      onCloseComplete={handleClose}
      onRequestClose={handleClose}
      animationConfig={{duration: animationDuration}}
      popoverStyle={style.popover}
      displayAreaInsets={insets}
      verticalOffset={
        Platform.OS === 'android' ? -(StatusBar.currentHeight ?? 0) : 0
      }
    >
      <View
        accessible={true}
        accessibilityLabel={`${heading}. ${text}`}
        accessibilityRole="button"
        onAccessibilityTap={handleClose}
        ref={contentRef}
      >
        <View style={style.heading}>
          <ThemeText accessibilityLabel={heading} type="body__primary--bold">
            {heading}
          </ThemeText>
          <TouchableOpacity
            onPress={handleClose}
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
