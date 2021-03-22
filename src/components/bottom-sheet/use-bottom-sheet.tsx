import React, {
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AccessibilityInfo,
  Animated,
  findNodeHandle,
  LayoutChangeEvent,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomSheetTexts, useTranslation} from '@atb/translations';

const Backdrop = ({animatedOffset}: {animatedOffset: Animated.Value}) => {
  const styles = useStyles();
  const opacity = animatedOffset.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.2],
  });

  return (
    <Animated.View
      style={{
        ...styles.backdrop,
        opacity,
      }}
      pointerEvents={'box-none'}
    />
  );
};

const ClickableBackground = ({
  isOpen,
  close,
  height,
}: {
  isOpen: boolean;
  close: () => void;
  height: number;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  if (!isOpen) return null;

  return (
    <TouchableWithoutFeedback
      onPress={close}
      accessibilityLabel={t(BottomSheetTexts.background.a11yLabel)}
      accessibilityHint={t(BottomSheetTexts.background.a11yHint)}
    >
      <View
        style={{
          ...styles.clickableBackground,
          bottom: height,
        }}
        pointerEvents={'box-only'}
      />
    </TouchableWithoutFeedback>
  );
};

const AnimatedBottomSheet = ({
  animatedOffset,
  children,
  height,
  onLayout,
}: {
  animatedOffset: Animated.Value;
  children: ReactNode;
  height: number;
  onLayout: (ev: LayoutChangeEvent) => void;
}) => {
  const styles = useStyles();
  return (
    <Animated.View
      style={{
        ...styles.bottomSheet,
        transform: [
          {
            translateY: animatedOffset.interpolate({
              inputRange: [0, 1],
              outputRange: [height || -2000, 0],
            }),
          },
        ],
      }}
      onLayout={onLayout}
    >
      {children}
    </Animated.View>
  );
};

type Props = {
  isOpen: boolean;
  close: () => void;
  animatedOffset: Animated.Value;
  children: ReactNode;
};

const InternalBottomSheet = ({
  isOpen,
  close,
  animatedOffset,
  children,
}: Props) => {
  const [height, setHeight] = useState<number>(0);
  const onLayout = ({nativeEvent}: LayoutChangeEvent) => {
    setHeight(nativeEvent.layout.height);
  };

  return (
    <>
      <Backdrop animatedOffset={animatedOffset} />
      <ClickableBackground isOpen={isOpen} close={close} height={height} />
      <AnimatedBottomSheet
        animatedOffset={animatedOffset}
        height={height}
        onLayout={onLayout}
      >
        {children}
      </AnimatedBottomSheet>
    </>
  );
};

export const useBottomSheet = (
  contentFunction: (close: () => void, focusRef: RefObject<any>) => ReactNode,
) => {
  const {theme} = useTheme();
  const {bottom: safeAreaBottom} = useSafeAreaInsets();

  const [isOpen, setIsOpen] = useState(false);

  const animatedOffset = useRef(new Animated.Value(0)).current;
  const focusRef = useRef(null);

  useEffect(
    () => () =>
      Animated.timing(animatedOffset, {
        toValue: isOpen ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }).start(),
    [isOpen],
  );

  const close = () => {
    setIsOpen(false);
  };
  const open = () => {
    setIsOpen(true);
    const reactTag = findNodeHandle(focusRef.current);
    if (reactTag) {
      AccessibilityInfo.setAccessibilityFocus(reactTag);
    }
  };

  const bottomSheet = useMemo(
    () => (
      <InternalBottomSheet
        isOpen={isOpen}
        close={close}
        animatedOffset={animatedOffset}
      >
        {contentFunction(close, focusRef)}
      </InternalBottomSheet>
    ),
    [isOpen, close, focusRef, animatedOffset, safeAreaBottom],
  );

  return {
    open,
    isOpen,
    bottomSheet,
  };
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  backdrop: {
    backgroundColor: 'black',
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  clickableBackground: {
    backgroundColor: 'none',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bottomSheet: {
    backgroundColor: theme.background.level1,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: theme.border.radius.regular,
    borderTopRightRadius: theme.border.radius.regular,
  },
}));
