import React, {createContext, useContext, useEffect, useState} from 'react';
import {AccessibilityInfo} from 'react-native';

type AccessibilityState = {
  isScreenReaderEnabled: boolean;
};

export const AccessibilityContext = createContext<AccessibilityState>({
  isScreenReaderEnabled: false,
});

type Props = {
  children: React.ReactNode;
};

export const AccessibilityContextProvider = ({children}: Props) => {
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
      'useAccessibilityContext must be used within an AccessibilityProvider',
    );
  }
  return context;
}

/**
 * Subscribes to the screen reader enabled state. Internal to the accessibility
 * context; components should use `useAccessibilityContext` instead so the value
 * is resolved once and does not start as false on every first render.
 */
function useIsScreenReaderEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      if (mounted) setEnabled(isEnabled);
    };

    fetch();
    const accessibilityInfoSubscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setEnabled,
    );
    return () => {
      mounted = false;
      accessibilityInfoSubscription.remove();
    };
  }, []);

  return enabled;
}
