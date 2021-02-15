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

export {default as AnimatedScreenHeader} from './animated-header';

export type LeftButtonProps = HeaderButtonProps & {
  type: Exclude<ButtonModes, 'chat'>;
};

export type RightButtonProps = Omit<HeaderButtonProps, 'onPress'> & {
  type: 'chat';
};

export type ScreenHeaderProps = {
  leftButton?: LeftButtonProps;
  rightButton?: RightButtonProps;
  title: React.ReactNode;
  style?: ViewStyle;
};

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  leftButton,
  rightButton,
  title,
  style,
}) => {
  const css = useHeaderStyle();
  const {theme} = useTheme();
  const {buttonsHeight, buttonsTopOffset, setLayoutFor} = useHeaderLayouts();

  const leftIcon = leftButton ? <HeaderButton {...leftButton} /> : <View />;
  const rightIcon = rightButton ? <HeaderButton {...rightButton} /> : <View />;

  return (
    <View style={[css.container, style]}>
      <View
        accessible={true}
        accessibilityRole="header"
        style={[
          css.headerTitle,
          {
            // Make space for absolute positioned buttons in case they are offset below title
            marginBottom: buttonsTopOffset,
          },
        ]}
        onLayout={setLayoutFor('container')}
      >
        <ThemeText onLayout={setLayoutFor('title')} type="paragraphHeadline">
          {title}
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

    const widestButtonWidth = Math.max(leftButton.width, rightButton.height);
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
