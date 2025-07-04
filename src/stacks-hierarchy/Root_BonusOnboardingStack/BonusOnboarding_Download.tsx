import {BonusProgramTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {BonusOnboardingScreenProps} from './navigation-types';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {ThemedPushNotification} from '@atb/theme/ThemedAssets';
import {useNavigation} from '@react-navigation/native';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {RootNavigationProps} from '../navigation-types';
import {BrandingImage, findOperatorBrandImageUrl} from '@atb/modules/mobility';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {ThemeText} from '@atb/components/text';
import {Linking, Platform, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {PressableOpacity} from '@atb/components/pressable-opacity';

export type DownloadScreenProps =
  BonusOnboardingScreenProps<'BonusOnboarding_DownloadScreen'>;

export const BonusOnboarding_DownloadScreen = ({}: DownloadScreenProps) => {
  const {t} = useTranslation();
  const navigation = useNavigation<RootNavigationProps>();

  return (
    <OnboardingScreenComponent
      illustration={<ThemedPushNotification height={140} />}
      title={t(BonusProgramTexts.onboarding.download.title)}
      description={t(BonusProgramTexts.onboarding.download.description)}
      footerButton={{
        onPress: () => navigation.getParent()?.goBack(),
        text: t(BonusProgramTexts.onboarding.download.buttonText),
        expanded: true,
        rightIcon: {svg: Confirm},
      }}
      contentNode={<DownloadButtons />}
      testID="downloadBonusOnboarding"
    />
  );
};

const downloadOperatorIds = [
  'HYR:Operator:Hyre',
  'YTR:Operator:trondheimbysykkel',
];

export const DownloadButtons = () => {
  const {mobilityOperators} = useFirestoreConfigurationContext();
  const styles = useStyles();

  const openAppURL = async (url: string) => {
    await Linking.openURL(url);
  };

  const getPlatformAppUrl = (operatorId: string) => {
    const appUrl = mobilityOperators?.find(
      (op) => op.id === operatorId,
    )?.appUrl;
    return (Platform.OS === 'ios' ? appUrl?.ios : appUrl?.android) ?? '';
  };

  return (
    <View style={styles.container}>
      {downloadOperatorIds.map((operatorId) => {
        const appUrl = getPlatformAppUrl(operatorId);

        return (
          <PressableOpacity
            key={operatorId}
            style={styles.operatorSection}
            accessibilityRole="button"
            onPress={() => openAppURL(appUrl)}
          >
            <BrandingImage
              logoUrl={findOperatorBrandImageUrl(operatorId, mobilityOperators)}
              logoSize={50}
              style={styles.logo}
            />
            <ThemeText
              style={styles.operatorText}
              typography="body__secondary--bold"
            >
              {mobilityOperators?.find((op) => op.id === operatorId)?.name}
            </ThemeText>
          </PressableOpacity>
        );
      })}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: theme.spacing.large,
  },
  operatorSection: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
  operatorText: {
    textAlign: 'center',
    maxWidth: 130,
  },
  logo: {
    marginTop: theme.spacing.xLarge,
    borderRadius: theme.border.radius.regular,
    overflow: 'hidden',
  },
}));
