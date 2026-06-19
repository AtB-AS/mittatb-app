import React from 'react';
import {View} from 'react-native';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {useTranslation} from '@atb/translations';
import {ShmoHelpTexts} from '@atb/translations/screens/ShmoHelp';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {BrandingImage} from '@atb/modules/mobility';
import {ThemedContactIllustration} from '@atb/theme/ThemedAssets';
import {ArrowRight, ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {NativeBlockButton} from '@atb/components/native-button';
import {ThemeIcon} from '@atb/components/theme-icon';
import {openUrl} from '@atb/utils/open-url';
import {MobilityOperatorType} from '@atb/modules/configuration';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {Signalling} from '@atb/assets/svg/mono-icons/status';

type Props = {
  operatorName: string | undefined;
  operatorLogoUrl: string | undefined;
  contactInfo: MobilityOperatorType['support'];
  formFactor: FormFactor | undefined;
  onContactFormPress: () => void;
  onReportParkingPress: () => void;
};

export const ShmoContactSection = ({
  operatorName,
  operatorLogoUrl,
  contactInfo,
  formFactor,
  onContactFormPress,
  onReportParkingPress,
}: Props) => {
  const {t} = useTranslation();
  const style = useStyles();
  const {theme} = useThemeContext();
  const {isParkingViolationsReportingEnabled} = useFeatureTogglesContext();

  const isBicycle = formFactor === FormFactor.Bicycle;

  const websiteDomain = contactInfo?.websiteUrl
    ? extractDomain(contactInfo.websiteUrl)
    : undefined;

  return (
    <>
      <View style={style.illustration}>
        <ThemedContactIllustration width={130} height={130} />
      </View>
      <Section>
        {(!!operatorName || !!contactInfo?.phone) && (
          <GenericSectionItem>
            <View style={style.operatorInfoContainer}>
              {!!operatorName && (
                <View style={style.operatorHeader}>
                  {!!operatorLogoUrl && (
                    <View style={style.operatorLogo}>
                      <BrandingImage logoUrl={operatorLogoUrl} logoSize={28} />
                    </View>
                  )}
                  <ThemeText typography="heading__xl">{operatorName}</ThemeText>
                </View>
              )}
            </View>
          </GenericSectionItem>
        )}

        {contactInfo?.phone && (
          <GenericSectionItem>
            <NativeBlockButton
              onPress={onContactFormPress}
              accessibilityRole="link"
              style={style.linkRow}
            >
              <ThemeText style={style.linkText}>
                {t(ShmoHelpTexts.telephonePrefix)}{' '}
                <ThemeText
                  typography="body__m__underline"
                  color={theme.color.interactive[0].default.background}
                >
                  {contactInfo.phone}
                </ThemeText>
              </ThemeText>
              <ThemeIcon svg={Signalling} size="normal" />
            </NativeBlockButton>
          </GenericSectionItem>
        )}

        <LinkSectionItem
          text={t(ShmoHelpTexts.contactForm)}
          rightIcon={{svg: ArrowRight}}
          onPress={onContactFormPress}
        />

        {!!contactInfo?.chatUrl && (
          <LinkSectionItem
            text={t(ShmoHelpTexts.chatInBrowser)}
            rightIcon={{svg: ExternalLink}}
            onPress={() => openUrl(contactInfo.chatUrl!)}
          />
        )}

        {!isBicycle && isParkingViolationsReportingEnabled && (
          <LinkSectionItem
            text={t(ShmoHelpTexts.reportParking)}
            rightIcon={{svg: ArrowRight}}
            onPress={onReportParkingPress}
          />
        )}

        {!!contactInfo?.websiteUrl && !!websiteDomain && (
          <GenericSectionItem>
            <NativeBlockButton
              onPress={() => openUrl(contactInfo.websiteUrl!)}
              accessibilityRole="link"
              style={style.linkRow}
            >
              <ThemeText style={style.linkText}>
                {t(ShmoHelpTexts.readMoreAtPrefix)}{' '}
                <ThemeText
                  typography="body__m__underline"
                  color={theme.color.interactive[0].default.background}
                >
                  {websiteDomain}
                </ThemeText>
              </ThemeText>
              <ThemeIcon svg={ExternalLink} size="normal" />
            </NativeBlockButton>
          </GenericSectionItem>
        )}
      </Section>
    </>
  );
};

function extractDomain(url: string): string | undefined {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return undefined;
  }
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  illustration: {
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  operatorInfoContainer: {
    gap: theme.spacing.medium,
  },
  operatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.medium,
  },
  operatorLogo: {
    borderRadius: theme.border.radius.regular,
    overflow: 'hidden',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
  linkText: {
    flex: 1,
  },
}));
