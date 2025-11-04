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
import {Platform, useWindowDimensions, View} from 'react-native';
import {useBottomSheetStyles} from '../use-bottom-sheet-styles';
import {ReduceMotion} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useThemeContext} from '@atb/theme';
import {useBottomSheetV2Context} from '../BottomSheetV2Context';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';

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
  const {setIsOpen} = useBottomSheetV2Context();
  const isScreenReaderEnabled = useIsScreenReaderEnabled();

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
          pressBehavior="none"
          aria-disabled="true"
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          onPress={undefined}
        />
      );
    },

    [isScreenReaderEnabled],
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
      }}
      onChange={(index) => {
        setIsOpen(index >= 0);
      }}
      onDismiss={() => {
        setIsOpen(false);
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
