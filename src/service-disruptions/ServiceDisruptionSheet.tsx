import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {ServiceDisruptionsTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {Linking} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {Section} from '@atb/components/sections';
import {GlobalMessage, GlobalMessageContextEnum} from '@atb/global-messages';
import {StyleSheet, useTheme} from '@atb/theme';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {FullScreenFooter} from '@atb/components/screen-footer';

export const ServiceDisruptionSheet = () => {
  const {t} = useTranslation();
  const {service_disruption_url} = useRemoteConfig();
  const hasValidServiceDisruptionUrl = !!service_disruption_url;
  const style = useStyle();
  const {theme} = useTheme();

  return (
    <BottomSheetContainer
      title={t(ServiceDisruptionsTexts.header.title)}
      testID="serviceDisruptionsBottomSheet"
    >
      <FullScreenFooter>
        <GlobalMessage
          style={style.globalMessages}
          globalMessageContext={GlobalMessageContextEnum.appServiceDisruptions}
          includeDismissed={true}
          textColor={theme.color.background.neutral[1]}
        />

        {hasValidServiceDisruptionUrl && (
          <>
            <Section style={style.serviceDisruptionText}>
              <ThemeText>{t(ServiceDisruptionsTexts.body)}</ThemeText>
            </Section>
            <Button
              mode="secondary"
              text={t(ServiceDisruptionsTexts.button.text)}
              accessibilityHint={t(ServiceDisruptionsTexts.button.a11yHint)}
              accessibilityRole="link"
              rightIcon={{svg: ExternalLink}}
              onPress={() => {
                Linking.openURL(service_disruption_url);
              }}
              testID="navigateToServiceDisruptions"
            />
          </>
        )}
      </FullScreenFooter>
    </BottomSheetContainer>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  globalMessages: {
    marginBottom: theme.spacing.medium,
  },
  serviceDisruptionText: {
    marginBottom: theme.spacing.medium,
  },
}));
