import {
  LayoutChangeEvent,
  LayoutRectangle,
  View,
  ViewStyle,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import HeaderButton, {ButtonModes, HeaderButtonProps} from './HeaderButton';
import ThemeText from '@atb/components/text';
import {AlertContext} from '@atb/alerts/AlertsContext';
import AlertBox from '@atb/alerts/AlertBox';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {ThemeColor} from '@atb/theme/colors';

export {default as AnimatedScreenHeader} from './animated-header';

export type LeftButtonProps = HeaderButtonProps & {
  type: Exclude<ButtonModes, 'chat' | 'skip'>;
};

export type RightButtonProps = HeaderButtonProps & {
  type: 'chat' | 'skip';
};

export type ScreenHeaderProps = {
  leftButton?: LeftButtonProps;
  rightButton?: RightButtonProps;
  title?: string;
  title_a11y?: string;
  /**
   * For specifying the alert context for alerts that should be shown in this
   * header. If no context is specified then no alerts are shown.
   */
  alertContext?: AlertContext;
  style?: ViewStyle;
  color?: ThemeColor;
  setFocusOnLoad?: boolean;
};

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  leftButton,
  rightButton,
  title,
  title_a11y,
  alertContext,
  style,
  color,
  setFocusOnLoad,
}) => {
  const css = useHeaderStyle();
  const {theme} = useTheme();
  const themeColor = color ?? 'background_gray';

  const {buttonsHeight, buttonsTopOffset, setLayoutFor} = useHeaderLayouts();

  const leftIcon = leftButton ? (
    <HeaderButton color={themeColor} {...leftButton} />
  ) : (
    <View />
  );
  const rightIcon = rightButton ? (
    <HeaderButton color={themeColor} {...rightButton} />
  ) : (
    <View />
  );

  const focusRef = useFocusOnLoad(setFocusOnLoad);

  const backgroundColor = theme.colors[themeColor].backgroundColor;

  return (
    <View style={[css.container, style, {backgroundColor}]}>
      <View
        accessible={!!title}
        accessibilityRole="header"
        style={[
          css.headerTitle,
          {
            // Make space for absolute positioned buttons in case they are offset below title
            marginBottom: buttonsTopOffset,
          },
        ]}
        onLayout={setLayoutFor('container')}
        ref={focusRef}
      >
        <ThemeText
          accessible={!!title}
          accessibilityLabel={title_a11y}
          onLayout={setLayoutFor('title')}
          type="body__primary--bold"
          color={themeColor}
        >
          {title ?? '\u00a0'}
        </ThemeText>
      </View>
      <View
        style={[
          css.buttons,
          {
            top: theme.spacings.medium + buttonsTopOffset,
            height: buttonsHeight,
          },
        ]}
      >
        <View onLayout={setLayoutFor('leftButton')}>{leftIcon}</View>
        <View onLayout={setLayoutFor('rightButton')}>{rightIcon}</View>
      </View>
      <AlertBox alertContext={alertContext} style={css.alertBox} />
    </View>
  );
};
export default ScreenHeader;

const useHeaderStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    padding: theme.spacings.medium,
  },
  headerTitle: {alignItems: 'center'},
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    left: theme.spacings.medium,
    width: '100%',
  },
  alertBox: {
    marginTop: theme.spacings.medium,
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
  const setLayoutFor = (element: keyof HeaderLayouts) => ({
    nativeEvent: {layout},
  }: LayoutChangeEvent) => {
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
