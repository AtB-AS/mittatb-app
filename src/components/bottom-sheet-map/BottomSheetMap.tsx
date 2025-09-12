import React, {useCallback, useMemo, PropsWithChildren, useRef} from 'react';
import BottomSheetGor, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {Platform, View, Image, ImageStyle} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {PressableOpacity} from '../pressable-opacity';
import {SvgProps} from 'react-native-svg';
import {ThemeText} from '../text';
import {ThemeIcon} from '../theme-icon';
import {SvgCssUri} from 'react-native-svg/css';

export type BottomSheetProps = PropsWithChildren<{
  snapPoints?: Array<string | number>;
  enableDynamicSizing?: boolean;
  closeOnBackdropPress?: boolean;
  allowBackgroundTouch?: boolean;
  backdropPressBehavior?: 'none' | 'close' | 'collapse' | number;
  keyboardBehavior?: 'extend' | 'interactive' | 'fillParent';
  closeCallback?: () => void;
  heading?: string;
  subText?: string;
  logoUrl?: string;
  rightIcon?: (props: SvgProps) => React.JSX.Element;
  rightIconText?: string;
  enablePanDownToClose?: boolean;
}>;

const LOGO_SIZE = 20;

export const BottomSheetMap = ({
  snapPoints,
  enableDynamicSizing = true,
  closeOnBackdropPress = true,
  keyboardBehavior = Platform.OS === 'ios' ? 'interactive' : 'extend',
  children,
  allowBackgroundTouch,
  backdropPressBehavior,
  closeCallback,
  heading,
  subText,
  logoUrl,
  rightIcon,
  rightIconText,
  enablePanDownToClose = true,
}: BottomSheetProps) => {
  const styles = useStyles();
  const ref = useRef<BottomSheetGor>(null);
  const {theme} = useThemeContext();
  const isSvg = (url: string) => url.endsWith('.svg');

  const computedSnapPoints = useMemo(() => {
    if (enableDynamicSizing && (!snapPoints || snapPoints.length === 0))
      return undefined; // dynamic
    return snapPoints ?? ['25%', '50%', '90%'];
  }, [enableDynamicSizing, snapPoints]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        enableTouchThrough={allowBackgroundTouch}
        pressBehavior={
          backdropPressBehavior ??
          (allowBackgroundTouch
            ? 'none'
            : closeOnBackdropPress
            ? 'close'
            : 'none')
        }
      />
    ),
    [allowBackgroundTouch, backdropPressBehavior, closeOnBackdropPress],
  );

  return (
    <BottomSheetGor
      ref={ref}
      handleIndicatorStyle={styles.handleIndicatorStyle}
      handleStyle={styles.handleStyle}
      snapPoints={computedSnapPoints}
      enableDynamicSizing={enableDynamicSizing}
      backdropComponent={allowBackgroundTouch ? undefined : renderBackdrop}
      enablePanDownToClose={enablePanDownToClose}
      keyboardBehavior={keyboardBehavior}
      keyboardBlurBehavior="restore"
      backgroundStyle={styles.sheet}
      onAnimate={(from, to) => {
        if (to === -1) {
          closeCallback?.();
        }
      }}
      accessible={false}
    >
      <BottomSheetView style={styles.contentContainer}>
        {(heading || rightIconText) && (
          <View style={styles.headerContainer}>
            {heading && (
              <View style={styles.headerLeft}>
                {logoUrl ? (
                  isSvg(logoUrl) ? (
                    <SvgCssUri
                      style={styles.logo}
                      height={LOGO_SIZE}
                      width={LOGO_SIZE}
                      uri={logoUrl}
                    />
                  ) : (
                    <Image
                      source={{uri: logoUrl}}
                      width={LOGO_SIZE}
                      height={LOGO_SIZE}
                      style={styles.logo as ImageStyle}
                      resizeMode="contain"
                    />
                  )
                ) : null}
                <View style={styles.headingWrapper}>
                  {heading && (
                    <ThemeText typography="heading--big">{heading}</ThemeText>
                  )}
                  {subText && (
                    <ThemeText
                      typography="body__secondary"
                      color={theme.color.foreground.dynamic.secondary}
                    >
                      {subText}
                    </ThemeText>
                  )}
                </View>
              </View>
            )}

            {rightIconText && rightIcon && (
              <PressableOpacity
                style={styles.headerRight}
                onPress={() => ref.current?.close()}
              >
                <ThemeText typography="body__secondary--bold">
                  {rightIconText}
                </ThemeText>
                <ThemeIcon svg={rightIcon} />
              </PressableOpacity>
            )}
          </View>
        )}

        {children}
      </BottomSheetView>
    </BottomSheetGor>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  contentContainer: {
    backgroundColor: theme.color.background.neutral[1].background,
  },
  sheet: {
    backgroundColor: theme.color.background.neutral[1].background,
  },
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.medium,
    paddingBottom: theme.spacing.medium,
    gap: theme.spacing.small,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.medium,
  },
  headingWrapper: {
    gap: theme.spacing.xSmall,
  },

  headerRight: {
    flexDirection: 'row',
    gap: theme.spacing.xSmall,
  },
  logo: {
    marginEnd: theme.spacing.small,
  },
  handleIndicatorStyle: {
    backgroundColor: theme.color.foreground.inverse.secondary,
    width: 75,
    height: 8,
  },
  handleStyle: {
    paddingBottom: theme.spacing.medium,
    paddingTop: theme.spacing.xSmall,
  },
}));
