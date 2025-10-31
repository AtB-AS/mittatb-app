import React, {PropsWithChildren, useCallback, useState} from 'react';
import {
  BottomSheetModal as GorhomBottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetFooter as GorhamBottomSheetFooter,
  type BottomSheetFooterProps,
} from '@gorhom/bottom-sheet';
import {BottomSheetHeader} from '../BottomSheetHeader';
import {SvgProps} from 'react-native-svg';
import {
  AccessibilityInfo,
  findNodeHandle,
  Platform,
  useWindowDimensions,
  View,
} from 'react-native';
import {useBottomSheetStyles} from '../use-bottom-sheet-styles';
import {ReduceMotion} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useThemeContext} from '@atb/theme';
//import {BottomSheetFooter} from './BottomSheetFooter';

type BottomSheetModalProps = PropsWithChildren<{
  bottomSheetModalRef: React.RefObject<GorhomBottomSheetModal | null>;
  heading?: string;
  subText?: string;
  logoUrl?: string;
  rightIcon?: (props: SvgProps) => React.JSX.Element;
  rightIconText?: string;
  headerNode?: React.ReactNode;
  snapPoints?: Array<string | number>;
  enableDynamicSizing?: boolean;
  keyboardBehavior?: 'extend' | 'interactive' | 'fillParent';
  closeCallback?: () => void;
  Footer?: React.FC;
}>;
export const BottomSheetModal = ({
  children,
  bottomSheetModalRef,
  heading,
  subText,
  logoUrl,
  rightIcon,
  rightIconText,
  headerNode,
  snapPoints,
  enableDynamicSizing = true,
  keyboardBehavior = Platform.OS === 'ios' ? 'interactive' : 'extend',
  closeCallback,
  Footer,
}: BottomSheetModalProps) => {
  const styles = useBottomSheetStyles();
  const {height: screenHeight} = useWindowDimensions();
  const {top: safeAreaTop, bottom: safeAreaBottom} = useSafeAreaInsets();
  const [footerHeight, setFooterHeight] = useState(0);
  const {theme} = useThemeContext();
  const headerRef = React.useRef<View>(null);

  function focusSheetHeader() {
    const node = findNodeHandle(headerRef.current);
    if (node) AccessibilityInfo.setAccessibilityFocus(node);
  }

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) =>
      Footer && (
        <GorhamBottomSheetFooter
          {...props}
          style={{
            backgroundColor: theme.color.background.neutral[1].background,
            paddingTop: theme.spacing.medium,
          }}
        >
          <View onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}>
            {Footer && <Footer />}
          </View>
        </GorhamBottomSheetFooter>
      ),
    [Footer, theme.color.background.neutral, theme.spacing.medium],
  );

  const renderHandle = useCallback(
    () => (
      <BottomSheetHeader
        focusRef={headerRef}
        heading={heading}
        subText={subText}
        logoUrl={logoUrl}
        rightIcon={rightIcon}
        rightIconText={rightIconText}
        bottomSheetRef={bottomSheetModalRef}
        headerNode={headerNode}
      />
    ),
    [
      bottomSheetModalRef,
      headerNode,
      heading,
      logoUrl,
      rightIcon,
      rightIconText,
      subText,
    ],
  );

  return (
    <GorhomBottomSheetModal
      ref={bottomSheetModalRef}
      accessibilityViewIsModal
      importantForAccessibility="yes"
      handleComponent={renderHandle}
      backgroundStyle={styles.sheet}
      snapPoints={snapPoints}
      enableDynamicSizing={enableDynamicSizing}
      enableDismissOnClose={true}
      backdropComponent={renderBackdrop}
      keyboardBehavior={keyboardBehavior}
      onAnimate={(fromIndex, toIndex, _fromPosition, _toPosition) => {
        if (toIndex === -1) {
          closeCallback?.();
        }
        if (fromIndex === -1) {
          //set accessibility focus when open
          focusSheetHeader();
        }
      }}
      accessible={false}
      overrideReduceMotion={ReduceMotion.Never}
      maxDynamicContentSize={screenHeight - safeAreaTop}
      footerComponent={renderFooter}
    >
      <BottomSheetScrollView
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical={false}
        contentContainerStyle={{
          paddingBottom: Math.max(footerHeight, safeAreaBottom) + 16,
        }}
      >
        {children}
      </BottomSheetScrollView>
    </GorhomBottomSheetModal>
  );
};
