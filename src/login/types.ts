export type AfterLoginParams = {
  routeName: string;
  routeParams?: object;
};

import {ActiveTicketPromptInAppRouteParams} from '@atb/login/in-app/ActiveTicketPrompt';
import {ConfirmCodeInAppRouteParams} from '@atb/login/in-app/ConfirmCodeInApp';
import {LoginOnboardingInAppRouteParams} from '@atb/login/in-app/LoginOnboarding';
import {PhoneInputInAppRouteParams} from '@atb/login/in-app/PhoneInputInApp';
import {LoginOptionsRouteParams} from '@atb/login/LoginOptionsScreen';
import {RootStackScreenProps} from '@atb/navigation/types';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

export type LoginInAppStackParams = {
  LoginOnboardingInApp: LoginOnboardingInAppRouteParams;
  ActiveTicketPromptInApp: ActiveTicketPromptInAppRouteParams;
  PhoneInputInApp: PhoneInputInAppRouteParams;
  ConfirmCodeInApp: ConfirmCodeInAppRouteParams;
  LoginOptionsScreen: LoginOptionsRouteParams;
};
export type LoginInAppRootProps = RootStackScreenProps<'LoginInApp'>;

export type LoginInAppScreenProps<T extends keyof LoginInAppStackParams> =
  CompositeScreenProps<
    StackScreenProps<LoginInAppStackParams, T>,
    LoginInAppRootProps
  >;
