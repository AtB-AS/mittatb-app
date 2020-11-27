import {useEffect, useState} from 'react';
import {AccessibilityInfo} from 'react-native';

export default function useIsScreenReaderEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      setEnabled(isEnabled);
    };

    fetch();
    AccessibilityInfo.addEventListener('screenReaderChanged', setEnabled);
    return () =>
      AccessibilityInfo.removeEventListener('screenReaderChanged', setEnabled);
  }, []);

  return enabled;
}
