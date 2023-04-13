import React, {createContext, useContext} from 'react';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';

type AccessibilityState = {
  isScreenReaderEnabled: boolean;
};

export const AccessibilityContext = createContext<AccessibilityState>({
  isScreenReaderEnabled: false,
});

export const AccessibilityContextProvider: React.FC = ({children}) => {
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  return (
    <AccessibilityContext.Provider value={{isScreenReaderEnabled}}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export function useAccessibilityContext() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error(
      'useAccessabilityContext must be used within an AccessibilityProvedier',
    );
  }
  return context;
}
