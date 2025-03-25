import React, {useRef, useState, useMemo, useCallback, useEffect} from 'react';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {BottomSheetContextV2} from './BottomSheetContextV2';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useActiveShmoBookingQuery} from '@atb/mobility/queries/use-active-shmo-booking-query';

type BottomSheetProviderV2Props = {
  children: React.ReactNode;
};
export const BottomSheetContextProviderV2 = ({
  children,
}: BottomSheetProviderV2Props) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [content, setContent] = useState<React.ReactNode>(null);
  const snapPoints = useMemo(() => ['15%', '50%', '90%'], []);
  const [canUserClose, setCanUserClose] = useState(true);
  const onCloseRef = useRef<(() => void) | null>(null);
  const {data: activeBooking} = useActiveShmoBookingQuery();

  const setOnClose = useCallback((callback: (() => void) | null) => {
    onCloseRef.current = callback;
  }, []);

  useEffect(() => {
    setCanUserClose(!activeBooking);
  }, [activeBooking]);

  const snapToIndex = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  const close = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const onBottomSheetChange = useCallback((index: number) => {
    if (index === -1) {
      console.log('setter null her i onBottomSheetChange -1?');
      setContent(null);
      if (typeof onCloseRef.current === 'function') {
        onCloseRef.current();
        onCloseRef.current = null;
      }
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      snapToIndex,
      close,
      setContent,
      setOnClose,
    }),
    [snapToIndex, close, setOnClose],
  );

  return (
    <BottomSheetContextV2.Provider value={contextValue}>
      {children}
      <BottomSheet
        ref={bottomSheetRef}
        onChange={onBottomSheetChange}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={canUserClose}
        backgroundStyle={{
          backgroundColor: theme.color.background.neutral[1].background,
        }}
      >
        <BottomSheetView style={styles.bottomSheet}>{content}</BottomSheetView>
      </BottomSheet>
    </BottomSheetContextV2.Provider>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    bottomSheet: {
      paddingVertical: theme.spacing.large,
      paddingHorizontal: theme.spacing.medium,
      width: '100%',
    },
  };
});
