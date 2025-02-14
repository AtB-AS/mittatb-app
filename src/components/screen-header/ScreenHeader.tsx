import {
  LayoutChangeEvent,
  LayoutRectangle,
  View,
  ViewStyle,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ButtonModes, HeaderButton, HeaderButtonProps} from './HeaderButton';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {
  GlobalMessage,
  GlobalMessageContextEnum,
} from '@atb/modules/global-messages';
import {ThemeText} from '@atb/components/text';
import {ContrastColor} from '@atb/theme/colors';

export {AnimatedScreenHeader} from './AnimatedScreenHeader';

export type LeftButtonProps = HeaderButtonProps & {
  type: Exclude<ButtonModes, 'chat' | 'skip' | 'custom'>;
};

export type RightButtonProps =
  | (HeaderButtonProps & {
      type: 'chat' | 'skip' | 'close';
    })
  | (HeaderButtonProps & {
      type: 'info';
      onPress: () => void;
    })
  | (HeaderButtonProps & {
      type: 'custom';
      onPress: () => void;
      text: string;
    });

export type ScreenHeaderProps = {
  leftButton?: LeftButtonProps;
  rightButton?: RightButtonProps;
  title?: string;
  titleA11yLabel?: string;
  /**
   * For specifying the alert context for alerts that should be shown in this
   * header. If no context is specified then no alerts are shown.
   */
  globalMessageContext?: GlobalMessageContextEnum;
  style?: ViewStyle;
  color?: ContrastColor;
  setFocusOnLoad?: boolean;
  textOpacity?: number;
};

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  color,
  setFocusOnLoad,
  style,
  title,
  titleA11yLabel,
  globalMessageContext,
  leftButton,
  rightButton,
  textOpacity = 1,
}) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const themeColor = color ?? theme.color.background.accent[0];
  const focusRef = useFocusOnLoad(setFocusOnLoad);

  const {buttonsHeight, buttonsTopOffset, setLayoutFor} = useHeaderLayouts();

  const backgroundColor = themeColor.background;

  const leftIcon = leftButton ? (
    <HeaderButton color={themeColor} {...leftButton} testID="lhb" />
  ) : (
    <View />
  );
  const rightIcon = rightButton ? (
    <HeaderButton color={themeColor} {...rightButton} testID="rhb" />
  ) : (
    <View />
  );

  return (
    <View style={[styles.container, style, {backgroundColor}]}>
      <View
        accessibilityLabel={titleA11yLabel}
        accessible={!!title && !!textOpacity}
        importantForAccessibility={!!title ? 'yes' : 'no-hide-descendants'}
        accessibilityRole="header"
        style={[
          styles.headerTitle,
          {
            // Make space for absolute positioned buttons in case they are offset below title
            marginBottom: theme.spacing.medium + buttonsTopOffset,
          },
        ]}
        onLayout={setLayoutFor('container')}
        ref={focusRef}
      >
        <View style={{opacity: textOpacity}}>
          <ThemeText
            accessible={false}
            onLayout={setLayoutFor('title')}
            typography="body__primary--bold"
            color={themeColor}
          >
            {title && textOpacity > 0 ? title : '\u00a0'}
          </ThemeText>
        </View>
      </View>

      <View
        style={[
          styles.buttons,
          {
            top: theme.spacing.medium + buttonsTopOffset,
            height: buttonsHeight,
          },
        ]}
      >
        <View onLayout={setLayoutFor('leftButton')}>{leftIcon}</View>
        <View onLayout={setLayoutFor('rightButton')}>{rightIcon}</View>
      </View>
      <GlobalMessage
        globalMessageContext={globalMessageContext}
        style={styles.globalMessageBox}
        textColor={themeColor}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacing.medium,
    paddingTop: theme.spacing.medium,
  },
  headerTitle: {alignItems: 'center'},
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    left: theme.spacing.medium,
    width: '100%',
  },
  globalMessageBox: {
    marginBottom: theme.spacing.medium,
  },
}));

type HeaderLayouts = {
  container?: LayoutRectangle;
  title?: LayoutRectangle;
  leftButton?: LayoutRectangle;
  rightButton?: LayoutRectangle;
};

/**
 * Hook for deciding buttons top offset and height, based on the layout of the
 * header components. If one of the left or right button overlaps with the
 * header title, the buttons should be rendered below the header title.
 */
const useHeaderLayouts = () => {
  const [headerLayouts, setHeaderLayouts] = useState<HeaderLayouts>({});
  const setLayoutFor =
    (element: keyof HeaderLayouts) =>
    ({nativeEvent: {layout}}: LayoutChangeEvent) => {
      setHeaderLayouts((prev) => ({...prev, [element]: layout}));
    };

  const buttonsOnOwnLine = useMemo(() => {
    const {container, title, leftButton, rightButton} = headerLayouts;
    if (!container || !title || !leftButton || !rightButton) {
      return false;
    }

    const leftButtonVisibleWidth = leftButton.height ? leftButton.width : 0;
    const rightButtonVisibleWidth = rightButton.height ? rightButton.width : 0;
    const widestButtonWidth = Math.max(
      leftButtonVisibleWidth,
      rightButtonVisibleWidth,
    );
    const buttonsAndTitleWidth = title.width + widestButtonWidth * 2;
    const containerWidth = container.width;
    return buttonsAndTitleWidth > containerWidth - 10;
  }, [headerLayouts]);

  const buttonsHeight = headerLayouts.container?.height || 0;
  const buttonsTopOffset = buttonsOnOwnLine ? buttonsHeight : 0;

  return {
    buttonsTopOffset,
    buttonsHeight,
    setLayoutFor,
  };
};
