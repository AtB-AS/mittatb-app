import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BottomSheetModal as GorhomBottomSheetModal,
  BottomSheetModalProps as GorhomBottomSheetModalProps,
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetFooter as GorhomBottomSheetFooter,
  type BottomSheetFooterProps,
} from '@gorhom/bottom-sheet';
import {BottomSheetHeader} from '../BottomSheetHeader';
import {Platform, useWindowDimensions, View} from 'react-native';
import {useBottomSheetStyles} from '../use-bottom-sheet-styles';
import {ReduceMotion} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useThemeContext} from '@atb/theme';
import {useBottomSheetContext} from '../BottomSheetContext';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import {BottomSheetHeaderType} from '../use-bottom-sheet-header-type';
import {
  BottomSheetModalMethods,
  SpringConfig,
  TimingConfig,
} from '@gorhom/bottom-sheet/lib/typescript/types';

type BottomSheetModalProps<T extends any> = {
  children: GorhomBottomSheetModalProps<T>['children'];
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods | null>;
  enablePanDownToClose?: boolean;
  heading?: string;
  subText?: string;
  logoUrl?: string;
  headerNode?: React.ReactNode;
  snapPoints?: Array<string | number>;
  enableDynamicSizing?: boolean;
  keyboardBehavior?: 'extend' | 'interactive' | 'fillParent';
  closeCallback?: () => void;
  Footer?: React.FC;
  testID?: string;
  closeOnBackdropPress?: boolean;
  overrideCloseFunction?: () => void;
  bottomSheetHeaderType: BottomSheetHeaderType;
};

export const BottomSheetModal = <T extends any>({
  children: Children,
  bottomSheetModalRef,
  heading,
  subText,
  logoUrl,
  headerNode,
  snapPoints,
  enableDynamicSizing = true,
  keyboardBehavior = Platform.OS === 'ios' ? 'interactive' : 'extend',
  closeCallback,
  Footer,
  testID,
  enablePanDownToClose = true,
  closeOnBackdropPress = true,
  overrideCloseFunction,
  bottomSheetHeaderType,
}: BottomSheetModalProps<T>) => {
  const styles = useBottomSheetStyles();
  const {height: screenHeight} = useWindowDimensions();
  const {top: safeAreaTop, bottom: safeAreaBottom} = useSafeAreaInsets();
  const [footerHeight, setFooterHeight] = useState(0);
  const {theme} = useThemeContext();
  const focusRef = React.useRef<View>(null);
  const {setIsOpen, isOpen} = useBottomSheetContext();
  const isScreenReaderEnabled = useIsScreenReaderEnabled();

  const canRunCallbacksRef = useRef<boolean>(isOpen);

  const onClose = useCallback(() => {
    if (!canRunCallbacksRef.current) return;

    canRunCallbacksRef.current = false;
    closeCallback?.();
    setIsOpen(false);
  }, [closeCallback, setIsOpen]);

  const onOpen = useCallback(() => {
    if (canRunCallbacksRef.current) return;

    canRunCallbacksRef.current = true;
    setIsOpen(true);
  }, [setIsOpen]);

  const {internalRef} = useInternalBottomSheetModalRef(
    bottomSheetModalRef,
    onClose,
    onOpen,
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => giveFocus(focusRef), 700);
    }
  }, [isOpen]);

  const renderBackdrop = useCallback(
    (props: any) => {
      return isScreenReaderEnabled ? (
        <View
          pointerEvents="none"
          style={[props.style, {backgroundColor: 'rgba(0,0,0,0.5)'}]}
          accessible={false}
          focusable={false}
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden
        />
      ) : (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior={closeOnBackdropPress ? 'close' : 'none'}
        />
      );
    },

    [isScreenReaderEnabled, closeOnBackdropPress],
  );

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) =>
      Footer && (
        <GorhomBottomSheetFooter
          {...props}
          style={{
            backgroundColor: theme.color.background.neutral[1].background,
            paddingTop: theme.spacing.large,
          }}
        >
          <View onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}>
            {Footer && <Footer />}
          </View>
        </GorhomBottomSheetFooter>
      ),
    [Footer, theme.color.background.neutral, theme.spacing.large],
  );

  const renderHandle = useCallback(
    () => (
      <BottomSheetHeader
        focusRef={focusRef}
        heading={heading}
        subText={subText}
        logoUrl={logoUrl}
        bottomSheetRef={internalRef}
        headerNode={headerNode}
        testID={testID}
        overrideCloseFunction={overrideCloseFunction}
        bottomSheetHeaderType={bottomSheetHeaderType}
      />
    ),
    [
      bottomSheetHeaderType,
      internalRef,
      headerNode,
      heading,
      logoUrl,
      overrideCloseFunction,
      subText,
      testID,
    ],
  );

  const contentContainerStyle = useMemo(
    () => ({
      paddingBottom:
        Math.max(footerHeight, safeAreaBottom) + theme.spacing.large,
    }),
    [footerHeight, safeAreaBottom, theme.spacing.large],
  );

  const ChildrenComponent: React.FC<{data?: T | undefined}> = useCallback(
    ({data}) => {
      return typeof Children === 'function' ? (
        <Children data={data} />
      ) : (
        Children
      );
    },
    [Children],
  );

  const content: React.FC<{data?: T | undefined}> = useCallback(
    ({data}) => (
      <BottomSheetScrollView
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical={false}
        contentContainerStyle={contentContainerStyle}
      >
        <ChildrenComponent data={data} />
      </BottomSheetScrollView>
    ),
    [ChildrenComponent, contentContainerStyle],
  );

  return (
    <GorhomBottomSheetModal<T>
      ref={internalRef}
      accessibilityViewIsModal
      importantForAccessibility="yes"
      handleComponent={renderHandle}
      backgroundStyle={styles.sheet}
      snapPoints={snapPoints}
      enablePanDownToClose={enablePanDownToClose}
      enableDynamicSizing={enableDynamicSizing}
      enableDismissOnClose={true}
      backdropComponent={renderBackdrop}
      keyboardBehavior={keyboardBehavior}
      onAnimate={(_fromIndex, toIndex, _fromPosition, _toPosition) => {
        if (toIndex >= 0) {
          onOpen();
        } else if (toIndex === -1) {
          onClose();
        }
      }}
      onDismiss={() => {
        onClose();
      }}
      accessible={false}
      overrideReduceMotion={ReduceMotion.Never}
      maxDynamicContentSize={screenHeight - safeAreaTop}
      footerComponent={renderFooter}
      children={content}
    />
  );
};

const useInternalBottomSheetModalRef = <T extends any>(
  externalBottomSheetModalRef: React.RefObject<BottomSheetModalMethods<T> | null>,
  onClose: () => void,
  onOpen: () => void,
) => {
  const internalRef = useRef<BottomSheetModalMethods<T>>(null);

  useImperativeHandle(externalBottomSheetModalRef, (): BottomSheetModalMethods<T> => {
    return {
      present: (data?: T) => internalRef.current?.present(data) && onOpen(),
      dismiss: (animationConfigs?: SpringConfig | TimingConfig | undefined) =>
        internalRef.current?.dismiss(animationConfigs) && onClose(),
      snapToIndex: (
        index: number,
        animationConfigs?: SpringConfig | TimingConfig | undefined,
      ) => internalRef.current?.snapToIndex(index, animationConfigs),
      snapToPosition: (
        position: string | number,
        animationConfigs?: SpringConfig | TimingConfig | undefined,
      ) => internalRef.current?.snapToPosition(position, animationConfigs),
      expand: (animationConfigs?: SpringConfig | TimingConfig | undefined) =>
        internalRef.current?.expand(animationConfigs),
      collapse: (animationConfigs?: SpringConfig | TimingConfig | undefined) =>
        internalRef.current?.collapse(animationConfigs),
      close: (animationConfigs?: SpringConfig | TimingConfig | undefined) =>
        internalRef.current?.close(animationConfigs) && onClose(),
      forceClose: (
        animationConfigs?: SpringConfig | TimingConfig | undefined,
      ) => internalRef.current?.forceClose(animationConfigs) && onClose(),
    };
  }, [internalRef, onClose, onOpen]);

  return {internalRef};
};
