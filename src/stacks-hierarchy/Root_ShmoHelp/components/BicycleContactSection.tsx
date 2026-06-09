import React from 'react';
import {Pressable, View} from 'react-native';
import {StyleSheet, Theme} from '@atb/theme';
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
import {openUrl} from '@atb/utils/open-url';
import {MobilityOperatorType} from '@atb/modules/configuration';

type Props = {
  operatorName: string | undefined;
  operatorLogoUrl: string | undefined;
  contactInfo: MobilityOperatorType['support'];
  onContactFormPress: () => void;
};

export const BicycleContactSection = ({
  operatorName,
  operatorLogoUrl,
  contactInfo,
  onContactFormPress,
}: Props) => {
  const {t} = useTranslation();
  const style = useStyles();

  const chatDomain = contactInfo?.chatUrl
    ? extractDomain(contactInfo.chatUrl)
    : undefined;
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
                      <BrandingImage logoUrl={operatorLogoUrl} logoSize={40} />
                    </View>
                  )}
                  <ThemeText typography="heading__m">{operatorName}</ThemeText>
                </View>
              )}
              {!!contactInfo?.phone && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => openUrl(`tel:${contactInfo.phone}`)}
                >
                  <ThemeText typography="body__xs" type="secondary">
                    {t(ShmoHelpTexts.phone)}
                  </ThemeText>
                  <ThemeText typography="body__m">
                    {contactInfo.phone}
                  </ThemeText>
                </Pressable>
              )}
            </View>
          </GenericSectionItem>
        )}

        <LinkSectionItem
          text={t(ShmoHelpTexts.contactForm)}
          rightIcon={{svg: ArrowRight}}
          onPress={onContactFormPress}
        />

        {!!contactInfo?.chatUrl && !!chatDomain && (
          <LinkSectionItem
            text={t(ShmoHelpTexts.chatInBrowser(chatDomain))}
            rightIcon={{svg: ExternalLink}}
            onPress={() => openUrl(contactInfo.chatUrl!)}
          />
        )}

        {!!contactInfo?.websiteUrl && !!websiteDomain && (
          <LinkSectionItem
            text={t(ShmoHelpTexts.readMoreAbout(websiteDomain))}
            rightIcon={{svg: ExternalLink}}
            onPress={() => openUrl(contactInfo.websiteUrl!)}
          />
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
}));
