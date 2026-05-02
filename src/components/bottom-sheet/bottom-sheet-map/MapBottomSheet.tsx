import React, {
  useCallback,
  PropsWithChildren,
  useMemo,
  useState,
  useRef,
} from 'react';
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
  logoIcon?: React.JSX.Element | null;
  enablePanDownToClose?: boolean;
  locationArrowOnPress: () => void;
  canMinimize?: boolean;
  headerNode?: React.ReactNode;
  navigateToScanQrCode: () => void;
  bottomSheetHeaderType: BottomSheetHeaderType;
  /**
   * Initial snap index. Defaults to the second snap when `canMinimize` is true
   * (skipping the auto-prepended minimum-header snap), otherwise the first.
   */
  index?: number;
  /**
   * Override the header close button's behavior. When omitted, the button
   * actually closes the sheet (current default). When set, the button calls
   * this callback instead — used by persistent sheets that swap content on
   * "close" rather than dismiss.
   */
  onClosePress?: () => void;
  /**
   * When `true` (default), children are rendered inside a `BottomSheetScrollView`
   * so heterogeneous content scrolls within the sheet. Set to `false` when the
   * caller's content already provides its own VirtualizedList-backed scroll
   * container (e.g. `BottomSheetSectionList`) — wrapping a virtualized list
   * inside a same-orientation ScrollView triggers a React Native warning and
   * can break windowing.
   */
  wrapInScrollView?: boolean;
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
  logoIcon,
  enablePanDownToClose = true,
  locationArrowOnPress,
  canMinimize = false,
  headerNode,
  navigateToScanQrCode,
  bottomSheetHeaderType,
  index,
  onClosePress,
  wrapInScrollView = true,
}: BottomSheetProps) => {
  const styles = useBottomSheetStyles();
  const sheetTopPosition = useSharedValue(0);
  const {setPaddingBottomMap, setCurrentBottomSheet, mapState} =
    useMapContext();
  const {height: screenHeight} = useWindowDimensions();
  const {minHeight: tabBarMinHeight} = useBottomNavigationStyles();
  const {top: safeAreaTop} = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState(0);
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

  const onHeaderLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    setHeaderHeight((prev) => (prev !== h ? h : prev));
  }, []);

  const HandleComponent = useCallback(() => {
    return (
      <View onLayout={onHeaderLayout}>
        <BottomSheetHeader
          heading={heading}
          subText={subText}
          logoUrl={logoUrl}
          logoIcon={logoIcon}
          bottomSheetRef={bottomSheetMapRef}
          headerNode={headerNode}
          bottomSheetHeaderType={bottomSheetHeaderType}
          onClosePress={onClosePress}
        />
      </View>
    );
  }, [
    onHeaderLayout,
    heading,
    subText,
    logoUrl,
    logoIcon,
    bottomSheetMapRef,
    headerNode,
    bottomSheetHeaderType,
    onClosePress,
  ]);

  const canRunCloseCallbackRef = useRef<boolean>(false);

  const onClose = useCallback(() => {
    if (canRunCloseCallbackRef.current) {
      canRunCloseCallbackRef.current = false;
      closeCallback?.();
      setPaddingBottomMap(0);
      setCurrentBottomSheet({
        bottomSheetType: MapBottomSheetType.None,
        feature: null,
      });
    }
  }, [closeCallback, setPaddingBottomMap, setCurrentBottomSheet]);

  const onOpen = useCallback(() => {
    if (canRunCloseCallbackRef.current) return;

    canRunCloseCallbackRef.current = true;
    setCurrentBottomSheet({
      bottomSheetType: mapState.bottomSheetType,
      feature: mapState.feature ?? null,
    });
  }, [setCurrentBottomSheet, mapState.bottomSheetType, mapState.feature]);

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
          if (toIndex >= 0) {
            onOpen();
            setPaddingBottomMap(screenHeight - toPosition + tabBarMinHeight);
          } else if (toIndex === -1) {
            onClose();
          }
        }}
        onClose={onClose}
        accessible={false}
        maxDynamicContentSize={screenHeight - safeAreaTop - headerHeight}
        index={index ?? (canMinimize ? 1 : 0)}
        overrideReduceMotion={ReduceMotion.Never}
      >
        <BottomSheetTopPositionBridge sheetTopPosition={sheetTopPosition} />
        {wrapInScrollView ? (
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
