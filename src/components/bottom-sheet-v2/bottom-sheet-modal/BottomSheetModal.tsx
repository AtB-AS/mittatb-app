import React, {PropsWithChildren, useCallback, useState} from 'react';
import {
  BottomSheetModal as GorhomBottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {BottomSheetHeader} from '../BottomSheetHeader';
import {SvgProps} from 'react-native-svg';
import {Platform, useWindowDimensions, View} from 'react-native';
import {useBottomSheetStyles} from '../use-bottom-sheet-styles';
import {ReduceMotion} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useThemeContext} from '@atb/theme';

type BottomSheetModalProps = PropsWithChildren<{
  BottomSheetModalRef: React.RefObject<GorhomBottomSheetModal | null>;
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
  footer?: React.ReactNode;
}>;
export const BottomSheetModal = ({
  children,
  BottomSheetModalRef,
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
  footer,
}: BottomSheetModalProps) => {
  const styles = useBottomSheetStyles();
  const {height: screenHeight} = useWindowDimensions();
  const {top: safeAreaTop, bottom: safeAreaBottom} = useSafeAreaInsets();
  const [footerHeight, setFooterHeight] = useState(0);
  const {theme} = useThemeContext();

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  const renderFooter = useCallback(
    (props: any) =>
      footer ? (
        <BottomSheetFooter
          {...props}
          style={{
            backgroundColor: theme.color.background.neutral[1].background,
            paddingTop: theme.spacing.medium,
          }}
        >
          <View
            onLayout={(event) => {
              const {height} = event.nativeEvent.layout;
              setFooterHeight(height);
            }}
          >
            {footer}
          </View>
        </BottomSheetFooter>
      ) : null,
    [footer, theme.color.background.neutral, theme.spacing.medium],
  );

  return (
    <GorhomBottomSheetModal
      ref={BottomSheetModalRef}
      handleComponent={() => (
        <BottomSheetHeader
          heading={heading}
          subText={subText}
          logoUrl={logoUrl}
          rightIcon={rightIcon}
          rightIconText={rightIconText}
          bottomSheetRef={BottomSheetModalRef}
          headerNode={headerNode}
        />
      )}
      backgroundStyle={styles.sheet}
      snapPoints={snapPoints}
      enableDynamicSizing={enableDynamicSizing}
      enableDismissOnClose={true}
      backdropComponent={renderBackdrop}
      keyboardBehavior={keyboardBehavior}
      onAnimate={(_fromIndex, toIndex, _fromPosition, _toPosition) => {
        if (toIndex === -1) {
          closeCallback?.();
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
