import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useRemoteConfigContext} from '@atb/modules/remote-config';

/**
 * Whether login should start on `Root_LoginOptionsScreen`, which is needed
 * when there is more than one login method. Otherwise login starts directly
 * on `Root_LoginPhoneInputScreen`.
 */
export const useIsLoginOptionsScreenEnabled = () => {
  const {enable_vipps_login} = useRemoteConfigContext();
  const {isEmailLoginEnabled} = useFeatureTogglesContext();
  return enable_vipps_login || isEmailLoginEnabled;
};
