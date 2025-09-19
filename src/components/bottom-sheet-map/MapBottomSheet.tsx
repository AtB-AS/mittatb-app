import React, {useCallback, PropsWithChildren, useRef, useMemo} from 'react';
import BottomSheetGor, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {Platform, View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {PressableOpacity} from '../pressable-opacity';
import {SvgProps} from 'react-native-svg';
import {ThemeText} from '../text';
import {ThemeIcon} from '../theme-icon';
import {MapButtons} from '@atb/modules/map';
import {BottomSheetTopPositionBridge} from './BottomSheetTopPositionBridge';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {BrandingImage} from '@atb/modules/mobility';

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
  positionArrowCallback: () => void;
}>;

export const MapBottomSheet = ({
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
  positionArrowCallback,
}: BottomSheetProps) => {
  const styles = useStyles();
  const bottomSheetGorRef = useRef<BottomSheetGor>(null);
  const {theme} = useThemeContext();
  const sheetTopPosition = useSharedValue(0);

  const aStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: sheetTopPosition.value}],
    };
  });

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

  const HeaderOverlay = useMemo(() => {
    return (
      <Animated.View
        pointerEvents="box-none"
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            zIndex: 1000,
            elevation: 1000,
          },
          aStyle,
        ]}
      >
        <MapButtons positionArrowCallback={positionArrowCallback} />
      </Animated.View>
    );
  }, [aStyle, positionArrowCallback]);

  return (
    <>
      {HeaderOverlay}
      <BottomSheetGor
        ref={bottomSheetGorRef}
        handleIndicatorStyle={styles.handleIndicatorStyle}
        handleStyle={styles.handleStyle}
        snapPoints={snapPoints}
        enableDynamicSizing={enableDynamicSizing}
        backdropComponent={allowBackgroundTouch ? undefined : renderBackdrop}
        enablePanDownToClose={enablePanDownToClose}
        keyboardBehavior={keyboardBehavior}
        keyboardBlurBehavior="restore"
        backgroundStyle={styles.sheet}
        onAnimate={(_from, to) => {
          if (to === -1) {
            closeCallback?.();
          }
        }}
        accessible={false}
      >
        <BottomSheetTopPositionBridge sheetTopPosition={sheetTopPosition} />
        <BottomSheetView style={styles.contentContainer}>
          {(heading || rightIconText) && (
            <View style={styles.headerContainer}>
              {heading && (
                <View style={styles.headerLeft}>
                  {logoUrl && <BrandingImage logoUrl={logoUrl} logoSize={20} />}
                  <View style={styles.headingWrapper}>
                    <ThemeText typography="heading--big">{heading}</ThemeText>
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

              {(rightIconText || rightIcon) && (
                <PressableOpacity
                  style={styles.headerRight}
                  onPress={() => bottomSheetGorRef.current?.close()}
                >
                  {rightIconText && (
                    <ThemeText typography="body__secondary--bold">
                      {rightIconText}
                    </ThemeText>
                  )}
                  {rightIcon && <ThemeIcon svg={rightIcon} />}
                </PressableOpacity>
              )}
            </View>
          )}

          {children}
        </BottomSheetView>
      </BottomSheetGor>
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  contentContainer: {
    backgroundColor: theme.color.background.neutral[1].background,
  },
  sheet: {
    backgroundColor: theme.color.background.neutral[1].background,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    // Android
    elevation: 10,
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
