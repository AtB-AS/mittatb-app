import React, {
  useCallback,
  PropsWithChildren,
  useRef,
  useMemo,
  useState,
} from 'react';
import BottomSheetGor, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {Platform, useWindowDimensions, View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {PressableOpacity} from '../pressable-opacity';
import {SvgProps} from 'react-native-svg';
import {ThemeText} from '../text';
import {ThemeIcon} from '../theme-icon';
import {
  MapBottomSheetType,
  MapButtons,
  shadows,
  useMapContext,
} from '@atb/modules/map';
import {BottomSheetTopPositionBridge} from './BottomSheetTopPositionBridge';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {BrandingImage} from '@atb/modules/mobility';
import {useBottomNavigationStyles} from '@atb/utils/navigation';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {toNum} from './utils';

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
  locationArrowOnPress: () => void;
  canMinimize?: boolean;
  headerNode?: React.ReactNode;
}>;

const isOldAndroid = Platform.OS === 'android' && Platform.Version <= 28;

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
  locationArrowOnPress,
  canMinimize = false,
  headerNode,
}: BottomSheetProps) => {
  const styles = useStyles();
  const bottomSheetGorRef = useRef<BottomSheetGor>(null);
  const {theme} = useThemeContext();
  const sheetTopPosition = useSharedValue(0);
  const {setPaddingBottomMap, setHasBottomSheetFullyOpened, mapState} =
    useMapContext();
  const {height: screenHeight} = useWindowDimensions();
  const {minHeight: tabBarMinHeight} = useBottomNavigationStyles();
  const {top: safeAreaTop} = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState(0);

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
        <MapButtons locationArrowOnPress={locationArrowOnPress} />
      </Animated.View>
    );
  }, [aStyle, locationArrowOnPress]);

  const HeaderComp = () => {
    return (
      (heading || rightIconText) && (
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              {heading && (
                <>
                  {logoUrl && <BrandingImage logoUrl={logoUrl} logoSize={28} />}
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
                </>
              )}
            </View>

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
          {!!headerNode && (
            <View style={styles.headerNodeContainer}>{headerNode}</View>
          )}
        </View>
      )
    );
  };

  const computedSnapPoints = useMemo(() => {
    if (!canMinimize) return snapPoints;

    const prevSnapPoints = snapPoints ? snapPoints : [];

    const handleVerticalSize =
      toNum(styles.handleIndicatorStyle?.height) +
      toNum(styles.handleStyle?.paddingTop) +
      toNum(styles.handleStyle?.paddingBottom);

    const minSnap = Math.max(
      headerHeight + handleVerticalSize + theme.spacing.xSmall,
    );

    return [minSnap, ...prevSnapPoints];
  }, [
    canMinimize,
    headerHeight,
    snapPoints,
    styles.handleIndicatorStyle?.height,
    styles.handleStyle?.paddingBottom,
    styles.handleStyle?.paddingTop,
    theme.spacing.xSmall,
  ]);

  return (
    <>
      {HeaderOverlay}
      <BottomSheetGor
        ref={bottomSheetGorRef}
        handleIndicatorStyle={styles.handleIndicatorStyle}
        handleStyle={styles.handleStyle}
        snapPoints={computedSnapPoints}
        enableDynamicSizing={enableDynamicSizing}
        backdropComponent={allowBackgroundTouch ? undefined : renderBackdrop}
        enablePanDownToClose={enablePanDownToClose}
        keyboardBehavior={keyboardBehavior}
        keyboardBlurBehavior="restore"
        backgroundStyle={styles.sheet}
        onAnimate={(_fromIndex, toIndex, _fromPosition, toPosition) => {
          if (toIndex === -1) {
            closeCallback?.();
            setPaddingBottomMap(0);
            setHasBottomSheetFullyOpened({
              isOpen: false,
              bottomSheetType: MapBottomSheetType.None,
              feature: null,
            });
          } else {
            setPaddingBottomMap(screenHeight - toPosition + tabBarMinHeight);
          }
        }}
        onChange={(index) => {
          if (index !== -1) {
            setHasBottomSheetFullyOpened({
              isOpen: true,
              bottomSheetType: mapState.bottomSheetType,
              feature: mapState.feature ?? null,
            });
          }
        }}
        accessible={false}
        maxDynamicContentSize={screenHeight - safeAreaTop - headerHeight}
        index={canMinimize ? 1 : 0}
        overrideReduceMotion={ReduceMotion.Never}
      >
        <BottomSheetTopPositionBridge sheetTopPosition={sheetTopPosition} />
        {enableDynamicSizing ? (
          <BottomSheetScrollView
            style={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View
              onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
            >
              <HeaderComp />
            </View>
            {children}
          </BottomSheetScrollView>
        ) : (
          <>
            <View
              onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
            >
              <HeaderComp />
            </View>
            {children}
          </>
        )}
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
    ...(isOldAndroid ? {...shadows, elevation: 0} : shadows),
  },
  headerContainer: {
    flexDirection: 'column',
  },
  headerContent: {
    flexDirection: 'row',
    gap: theme.spacing.small,
    paddingBottom: theme.spacing.medium,
    paddingRight: theme.spacing.medium,
  },
  headerNodeContainer: {
    flex: 1,
    paddingLeft: theme.spacing.medium,
    paddingRight: theme.spacing.medium,
    paddingBottom: theme.spacing.medium,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.medium,
    paddingLeft: theme.spacing.large,
  },
  headingWrapper: {
    gap: theme.spacing.xSmall,
  },
  headerRight: {
    flexDirection: 'row',
    gap: theme.spacing.xSmall,
    paddingRight: theme.spacing.medium,
  },
  logo: {
    marginEnd: theme.spacing.small,
  },
  handleIndicatorStyle: {
    backgroundColor: theme.color.foreground.inverse.secondary,
    width: 75,
    height: 6,
  },
  handleStyle: {
    paddingTop: theme.spacing.small,
  },
}));
