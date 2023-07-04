import {
  LayoutChangeEvent,
  LayoutRectangle,
  View,
  ViewStyle,
} from 'react-native';
import React, {ReactNode, useMemo, useState} from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  ButtonModes,
  HeaderButton,
  HeaderButtonProps,
  HeaderButtonWithoutNavigation,
  HeaderButtonWithoutNavigationProps,
} from './HeaderButton';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {getStaticColor, StaticColor} from '@atb/theme/colors';
import {GlobalMessage, GlobalMessageContextType} from '@atb/global-messages';
import {ThemeText} from '@atb/components/text';

export {AnimatedScreenHeader} from './AnimatedScreenHeader';

export type LeftButtonProps = HeaderButtonProps & {
  type: Exclude<ButtonModes, 'chat' | 'skip' | 'custom'>;
};

export type RightButtonProps =
  | (HeaderButtonProps & {
      type: 'chat' | 'skip' | 'close';
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
  globalMessageContext?: GlobalMessageContextType;
  style?: ViewStyle;
  color?: StaticColor;
  setFocusOnLoad?: boolean;
  textOpacity?: number;
};

export const ScreenHeader: React.FC<ScreenHeaderProps> = (props) => {
  const themeColor = props.color ?? 'background_accent_0';

  const leftIcon = props.leftButton ? (
    <HeaderButton color={themeColor} {...props.leftButton} testID="lhb" />
  ) : (
    <View />
  );
  const rightIcon = props.rightButton ? (
    <HeaderButton color={themeColor} {...props.rightButton} testID="rhb" />
  ) : (
    <View />
  );

  return <BaseHeader leftIcon={leftIcon} rightIcon={rightIcon} {...props} />;
};

type ScreenHeaderWithoutNavigationProps = ScreenHeaderProps & {
  leftButton?: HeaderButtonWithoutNavigationProps;
  rightButton?: HeaderButtonWithoutNavigationProps;
};

/**
 * A screen header to use in contexts outside a stack navigation, for example in
 * bottom sheet. This is necessary as the normal screen header accesses the
 * navigation object, which throws an error outside of a stack navigations.
 */
export const ScreenHeaderWithoutNavigation = (
  props: ScreenHeaderWithoutNavigationProps,
) => {
  const themeColor = props.color ?? 'background_accent_0';
  const leftIcon = props.leftButton ? (
    <HeaderButtonWithoutNavigation color={themeColor} {...props.leftButton} />
  ) : (
    <View />
  );
  const rightIcon = props.rightButton ? (
    <HeaderButtonWithoutNavigation color={themeColor} {...props.rightButton} />
  ) : (
    <View />
  );

  return <BaseHeader leftIcon={leftIcon} rightIcon={rightIcon} {...props} />;
};

type BaseHeaderProps = ScreenHeaderProps & {
  rightIcon: ReactNode;
  leftIcon: ReactNode;
};

const BaseHeader = ({
  color,
  setFocusOnLoad,
  style,
  title,
  titleA11yLabel,
  globalMessageContext,
  leftIcon,
  rightIcon,
  textOpacity = 1,
}: BaseHeaderProps) => {
  const css = useHeaderStyle();
  const {theme, themeName} = useTheme();
  const themeColor = color ?? 'background_accent_0';
  const focusRef = useFocusOnLoad(setFocusOnLoad);

  const {buttonsHeight, setLayoutFor} = useHeaderLayouts();

  const backgroundColor = getStaticColor(themeName, themeColor).background;

  return (
    <View style={[css.container, style, {backgroundColor}]}>
      <View
        accessibilityLabel={titleA11yLabel}
        accessible={!!title && !!textOpacity}
        importantForAccessibility={!!title ? 'yes' : 'no-hide-descendants'}
        accessibilityRole="header"
        style={css.headerTitle}
        onLayout={setLayoutFor('container')}
        ref={focusRef}
      >
        <View
          style={{
            opacity: textOpacity,
          }}
        >
          <ThemeText
            accessible={false}
            type="body__primary--bold"
            color={themeColor}
            style={{textAlign: 'center'}}
          >
            {title && textOpacity > 0 ? title : '\u00a0'}
          </ThemeText>
        </View>
      </View>

      <View
        style={[
          css.buttons,
          {
            height: buttonsHeight || theme.typography.body__primary.lineHeight,
          },
        ]}
      >
        <View>{leftIcon}</View>
        <View>{rightIcon}</View>
      </View>
      <GlobalMessage
        globalMessageContext={globalMessageContext}
        style={css.globalMessageBox}
      />
    </View>
  );
};

const useHeaderStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacings.medium,
    paddingTop: theme.spacings.large,
    paddingBottom: theme.spacings.medium,
    borderTopLeftRadius: theme.border.radius.circle,
    borderTopRightRadius: theme.border.radius.circle,
    marginBottom: theme.spacings.medium,
    alignItems: 'center',
  },
  headerTitle: {alignItems: 'center', width: '66%'},
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: theme.spacings.large,
    left: theme.spacings.medium,
    width: '100%',
  },
  globalMessageBox: {
    marginTop: theme.spacings.medium,
  },
}));

type HeaderLayouts = {
  container?: LayoutRectangle;
};

/**
 * Hook for deciding the buttons height
 */
const useHeaderLayouts = () => {
  const [headerLayouts, setHeaderLayouts] = useState<HeaderLayouts>({});
  const setLayoutFor =
    (element: keyof HeaderLayouts) =>
    ({nativeEvent: {layout}}: LayoutChangeEvent) => {
      setHeaderLayouts((prev) => ({...prev, [element]: layout}));
    };

  const buttonsHeight = useMemo(() => {
    const {container} = headerLayouts;
    if (!container) {
      return 0;
    }
    return headerLayouts.container?.height || 0;
  }, [headerLayouts]);

  return {
    buttonsHeight,
    setLayoutFor,
  };
};
