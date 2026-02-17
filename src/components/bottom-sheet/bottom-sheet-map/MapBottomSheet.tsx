import React, {useCallback, PropsWithChildren, useMemo} from 'react';
import BottomSheetGor, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {
  LayoutChangeEvent,
  Platform,
  useWindowDimensions,
  View,
} from 'react-native';
import {MapBottomSheetType, MapButtons, useMapContext} from '@atb/modules/map';
import {BottomSheetTopPositionBridge} from './BottomSheetTopPositionBridge';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useBottomNavigationStyles} from '@atb/utils/navigation';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomSheetHeader} from '../BottomSheetHeader';
import {useBottomSheetStyles} from '../use-bottom-sheet-styles';
import {useBottomSheetContext} from '../BottomSheetContext';
import {BottomSheetHeaderType} from '../use-bottom-sheet-header-type';

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
  enablePanDownToClose?: boolean;
  locationArrowOnPress: () => void;
  canMinimize?: boolean;
  headerNode?: React.ReactNode;
  navigateToScanQrCode: () => void;
  bottomSheetHeaderType: BottomSheetHeaderType;
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
  enablePanDownToClose = true,
  locationArrowOnPress,
  canMinimize = false,
  headerNode,
  navigateToScanQrCode,
  bottomSheetHeaderType,
}: BottomSheetProps) => {
  const styles = useBottomSheetStyles();
  const sheetTopPosition = useSharedValue(0);
  const {
    setPaddingBottomMap,
    setCurrentBottomSheet,
    mapState,
    setHeaderHeight,
    headerHeight,
  } = useMapContext();
  const {height: screenHeight} = useWindowDimensions();
  const {minHeight: tabBarMinHeight} = useBottomNavigationStyles();
  const {top: safeAreaTop} = useSafeAreaInsets();

  const {bottomSheetMapRef} = useBottomSheetContext();

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
        <MapButtons
          locationArrowOnPress={locationArrowOnPress}
          navigateToScanQrCode={navigateToScanQrCode}
        />
      </Animated.View>
    );
  }, [aStyle, locationArrowOnPress, navigateToScanQrCode]);

  const computedSnapPoints = useMemo(() => {
    if (!canMinimize) return snapPoints;

    const prevSnapPoints = snapPoints ?? [];

    return headerHeight > 0
      ? [headerHeight, ...prevSnapPoints]
      : prevSnapPoints;
  }, [canMinimize, headerHeight, snapPoints]);

  const onHeaderLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const h = e.nativeEvent.layout.height;
      setHeaderHeight((prev) => (prev !== h ? h : prev));
    },
    [setHeaderHeight],
  );

  const HandleComponent = useCallback(() => {
    return (
      <View onLayout={onHeaderLayout}>
        <BottomSheetHeader
          heading={heading}
          subText={subText}
          logoUrl={logoUrl}
          bottomSheetRef={bottomSheetMapRef}
          headerNode={headerNode}
          bottomSheetHeaderType={bottomSheetHeaderType}
        />
      </View>
    );
  }, [
    onHeaderLayout,
    heading,
    subText,
    logoUrl,
    bottomSheetMapRef,
    headerNode,
    bottomSheetHeaderType,
  ]);

  return (
    <>
      {HeaderOverlay}
      <BottomSheetGor
        ref={bottomSheetMapRef}
        handleComponent={HandleComponent}
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
            setCurrentBottomSheet({
              bottomSheetType: MapBottomSheetType.None,
              feature: null,
            });
          } else {
            setPaddingBottomMap(screenHeight - toPosition + tabBarMinHeight);
          }
        }}
        onChange={(index) => {
          if (index !== -1) {
            setCurrentBottomSheet({
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
            alwaysBounceVertical={false}
          >
            {children}
          </BottomSheetScrollView>
        ) : (
          children
        )}
      </BottomSheetGor>
    </>
  );
};
