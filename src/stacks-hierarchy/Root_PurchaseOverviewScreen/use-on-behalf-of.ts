import {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useAuthContext} from '@atb/modules/auth';

export function useOnBehalfOf(selection: PurchaseSelectionType) {
  const isEnabled =
    useFeatureTogglesContext().isOnBehalfOfEnabled &&
    selection.fareProductTypeConfig.configuration.onBehalfOfEnabled;
  const isLoggedIn = useAuthContext().authenticationType === 'phone';

  return {
    isAllowed: isEnabled && isLoggedIn,
  };
}
