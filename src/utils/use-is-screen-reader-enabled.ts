import {useEffect, useState} from 'react';
import {AccessibilityInfo} from 'react-native';

export default function useIsScreenReaderEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      if (mounted) setEnabled(isEnabled);
    };

    fetch();
    AccessibilityInfo.addEventListener('screenReaderChanged', setEnabled);
    return () => {
      mounted = false;
      AccessibilityInfo.removeEventListener('screenReaderChanged', setEnabled);
    };
  }, []);

  return enabled;
}
