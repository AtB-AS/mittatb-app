import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {ServiceDisruptionsTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {Linking, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {Section} from '@atb/components/sections';
import {GlobalMessage, GlobalMessageContextEnum} from '@atb/global-messages';
import {StyleSheet} from '@atb/theme';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {FullScreenFooter} from '@atb/components/screen-footer';

export const ServiceDisruptionSheet = () => {
  const {t} = useTranslation();
  const {service_disruption_url} = useRemoteConfig();
  const hasValidServiceDisruptionUrl = !!service_disruption_url;
  const style = useStyle();

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
          textColor="background_1"
        />

        {hasValidServiceDisruptionUrl && (
          <>
            <Section style={style.serviceDisruptionText}>
              <View>
                <ThemeText>{t(ServiceDisruptionsTexts.body)}</ThemeText>
              </View>
            </Section>
            <Button
              interactiveColor="interactive_2"
              mode="secondary"
              text={t(ServiceDisruptionsTexts.button.text)}
              accessibilityHint={t(ServiceDisruptionsTexts.button.a11yHint)}
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
    marginBottom: theme.spacings.medium,
  },
  serviceDisruptionText: {
    marginBottom: theme.spacings.medium,
  },
}));
