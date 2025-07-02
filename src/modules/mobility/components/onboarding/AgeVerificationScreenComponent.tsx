import React, {useEffect, useState} from 'react';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {dictionary, LoginTexts, useTranslation} from '@atb/translations';
import {ThemedTokenPhone} from '@atb/theme/ThemedAssets';
import {Linking} from 'react-native';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';
import {VIPPS_CALLBACK_URL} from '@atb/api/vipps-login/api';
import {closeInAppBrowseriOS} from '@atb/modules/in-app-browser';
import {storage} from '@atb/modules/storage';
import {VippsSignInErrorCode} from '@atb/modules/auth';
import {useCompleteAgeVerificationMutation} from '../../queries/use-complete-age-verification-mutation';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {StyleSheet} from '@atb/theme';
import {useInitAgeVerificationMutation} from '../../index';

export type AgeVerificationScreenComponentProps = {
  legalAge: number;
};

export const AgeVerificationScreenComponent = ({
  legalAge,
}: AgeVerificationScreenComponentProps) => {
  const {t} = useTranslation();
  const appStatus = useAppStateStatus();
  const [error, setError] = useState<VippsSignInErrorCode>();
  const styles = useStyles();

  const {
    mutateAsync: completeAgeVerification,
    isLoading: isCompleting,
    error: completeError,
  } = useCompleteAgeVerificationMutation(legalAge);

  const {
    mutateAsync: initAgeVerification,
    isLoading: isAuthorizing,
    error: authorizeError,
  } = useInitAgeVerificationMutation();

  useEffect(() => {
    const handleUrl = async ({url}: {url: string}) => {
      if (url.includes(VIPPS_CALLBACK_URL)) {
        closeInAppBrowseriOS();
        const parsed = new URL(url);
        const code = parsed.searchParams.get('code');
        const state = parsed.searchParams.get('state');
        const initialState = await storage.get('vipps_state');

        if (code && state && state === initialState) {
          if (initialState?.toString() !== state?.toString()) {
            setError('unknown_error');
          } else {
            try {
              completeAgeVerification(code);
              await storage.set('vipps_state', '');
              await storage.set('vipps_nonce', '');
            } catch (err) {
              setError('unknown_error');
            }
          }
        } else {
          const error = parsed.searchParams.get('error');

          if (error) {
            if (error === 'outdated_app_version' || error === 'access_denied') {
              setError(error);
            } else {
              setError('unknown_error');
            }
          }
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleUrl);

    return () => {
      subscription.remove();
    };
  }, [appStatus, completeAgeVerification]);

  const getErrorMessage = () => {
    if (error && error !== 'access_denied') {
      return t(LoginTexts.vipps.errors[error]);
    }

    if (completeError || authorizeError) {
      return t(dictionary.genericErrorMsg);
    }

    return null;
  };

  return (
    <OnboardingScreenComponent
      illustration={<ThemedTokenPhone height={220} />}
      title={t(MobilityTexts.shmoRequirements.ageVerification.title)}
      description={t(
        MobilityTexts.shmoRequirements.ageVerification.description,
      )}
      vippsButton={{
        onPress: () => initAgeVerification(),
        expanded: true,
        loading: isAuthorizing || isCompleting,
        disabled: isAuthorizing || isCompleting,
      }}
      contentNode={
        getErrorMessage() ? (
          <MessageInfoBox
            style={styles.errorMessage}
            type="error"
            message={getErrorMessage() ?? ''}
          />
        ) : undefined
      }
      headerProps={{
        rightButton: {type: 'close', withIcon: true},
      }}
    />
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    errorMessage: {
      marginBottom: theme.spacing.medium,
    },
  };
});
