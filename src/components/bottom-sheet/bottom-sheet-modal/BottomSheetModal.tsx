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
import {BottomSheetModalMethods as GorhomBottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';

export type BottomSheetModalMethods = {
  dismiss: () => void;
  present: () => void;
};

type BottomSheetModalProps = {
  children: React.ReactNode;
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods | null>;
  enablePanDownToClose?: boolean;
  heading?: string;
  subText?: string;
  logoUrl?: string;
  headerNode?: React.ReactNode;
  snapPoints?: Array<string | number>;
  enableDynamicSizing?: boolean;
  keyboardBehavior?: 'extend' | 'interactive' | 'fillParent';
  keyboardBlurBehavior?: 'none' | 'restore';
  closeCallback?: () => void;
  fullyDismissedCallback?: () => void;
  Footer?: React.FC;
  testID?: string;
  closeOnBackdropPress?: boolean;
  overrideClose?: () => boolean;
  bottomSheetHeaderType: BottomSheetHeaderType;
};

export const BottomSheetModal = ({
  children,
  bottomSheetModalRef,
  heading,
  subText,
  logoUrl,
  headerNode,
  snapPoints,
  enableDynamicSizing = true,
  keyboardBehavior = Platform.OS === 'ios' ? 'interactive' : 'extend',
  keyboardBlurBehavior,
  closeCallback,
  fullyDismissedCallback,
  Footer,
  testID,
  enablePanDownToClose = true,
  closeOnBackdropPress = true,
  overrideClose = () => false,
  bottomSheetHeaderType,
}: BottomSheetModalProps) => {
  const styles = useBottomSheetStyles();
  const {height: screenHeight} = useWindowDimensions();
  const {top: safeAreaTop} = useSafeAreaInsets();
  const [footerHeight, setFooterHeight] = useState(0);
  const {theme} = useThemeContext();
  const focusRef = React.useRef<View>(null);
  const {setIsOpen, isOpen} = useBottomSheetContext();
  const isScreenReaderEnabled = useIsScreenReaderEnabled();

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
    overrideClose,
  );

  const renderHandle = useCallback(
    () => (
      <BottomSheetHeader
        focusRef={focusRef}
        heading={heading}
        subText={subText}
        logoUrl={logoUrl}
        onClose={() => bottomSheetModalRef.current?.dismiss()}
        headerNode={headerNode}
        testID={testID}
        bottomSheetHeaderType={bottomSheetHeaderType}
      />
    ),
    [
      bottomSheetHeaderType,
      bottomSheetModalRef,
      headerNode,
      heading,
      logoUrl,
      subText,
      testID,
    ],
  );

  const content = useBottomSheetContent(children, footerHeight);

  return (
    <GorhomBottomSheetModal
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
      keyboardBlurBehavior={keyboardBlurBehavior}
      onAnimate={(_fromIndex, toIndex, _fromPosition, _toPosition) => {
        if (toIndex >= 0) {
          onOpen();
        } else if (toIndex === -1) {
          onClose();
        }
      }}
      onDismiss={() => {
        onClose();
        fullyDismissedCallback?.();
      }}
      accessible={false}
      overrideReduceMotion={ReduceMotion.Never}
      maxDynamicContentSize={screenHeight - safeAreaTop}
      footerComponent={renderFooter}
      children={content}
    />
  );
};

const useBottomSheetContent = (
  children: React.ReactNode,
  footerHeight: number,
) => {
  const {theme} = useThemeContext();
  const {bottom: safeAreaBottom} = useSafeAreaInsets();

  const contentContainerStyle = useMemo(
    () => ({
      paddingTop: theme.spacing.medium,
      paddingBottom:
        Math.max(safeAreaBottom, footerHeight) +
        (footerHeight > 0 ? theme.spacing.large : theme.spacing.medium),
    }),
    [safeAreaBottom, theme, footerHeight],
  );

  return useMemo(
    () => (
      <BottomSheetScrollView
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical={false}
        contentContainerStyle={contentContainerStyle}
      >
        {children}
      </BottomSheetScrollView>
    ),
    [children, contentContainerStyle],
  );
};

const useInternalBottomSheetModalRef = (
  externalBottomSheetModalRef: React.RefObject<BottomSheetModalMethods | null>,
  overrideClose: () => boolean,
) => {
  const internalRef = useRef<GorhomBottomSheetModalMethods>(null);

  useImperativeHandle(externalBottomSheetModalRef, (): BottomSheetModalMethods => {
    return {
      present: () => internalRef.current?.present(),
      dismiss: () => {
        if (overrideClose()) return;
        internalRef.current?.dismiss();
      },
    };
  }, [internalRef, overrideClose]);

  return {internalRef};
};
