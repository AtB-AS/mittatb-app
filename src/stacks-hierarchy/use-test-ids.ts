import {usePreferencesContext} from '@atb/modules/preferences';
import {
  setTestIdPrototypes,
  resetTestIdPrototypes,
} from '@atb/utils/test-visualize-ids';
import {useEffect} from 'react';

export function useTestIds() {
  const {
    preferences: {showTestIds},
  } = usePreferencesContext();

  useEffect(() => {
    if (showTestIds) {
      setTestIdPrototypes();
    } else {
      resetTestIdPrototypes();
    }
  }, [showTestIds]);
}
