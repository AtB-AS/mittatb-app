import React, {createContext, useContext} from 'react';

type BottomSheetContextV2Type = {
  snapToIndex: (index: number) => void;
  close: () => void;
  setContent: (content: React.ReactNode) => void;
  setOnClose: (callback: (() => void) | null) => void;
};

export const BottomSheetContextV2 = createContext<
  BottomSheetContextV2Type | undefined
>(undefined);

export const useBottomSheetV2 = () => {
  const context = useContext(BottomSheetContextV2);
  if (!context)
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  return context;
};
