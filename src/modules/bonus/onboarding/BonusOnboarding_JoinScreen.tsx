import {BonusProgramTexts, dictionary, useTranslation} from '@atb/translations';
import React from 'react';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {ThemedBonusBagCarry} from '@atb/theme/ThemedAssets';
import {View} from 'react-native';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {useThemeContext} from '@atb/theme/ThemeContext';
import {StyleSheet} from '@atb/theme/StyleSheet';
import {Star} from '@atb/assets/svg/mono-icons/bonus';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {openInAppBrowser} from '@atb/modules/in-app-browser';
import {Delete, Feedback} from '@atb/assets/svg/mono-icons/actions';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {
  KnownProgramId,
  useEnrollIntoProgramWithIdMutation,
  useIsEnrolled,
} from '@atb/modules/enrollment';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {Activity} from '@atb/assets/svg/mono-icons/miscellaneous';
import {useNestedProfileScreenParams} from '@atb/utils/use-nested-profile-screen-params';

export const BonusOnboarding_JoinScreen = () => {
  const focusRef = useFocusOnLoad();
  const {t} = useTranslation();
  const navigation = useNavigation<RootNavigationProps>();
  const enrollMutation = useEnrollIntoProgramWithIdMutation();
  const isEnrolled = useIsEnrolled(KnownProgramId.BONUS);
  const bonusScreenParams = useNestedProfileScreenParams('Profile_BonusScreen');

  const onPress = async () => {
    try {
      if (!isEnrolled) {
        await enrollMutation.mutateAsync(KnownProgramId.BONUS);
      }
      navigation.navigate('Root_TabNavigatorStack', bonusScreenParams);
    } catch {
      // Error state is handled via enrollMutation.error and shown in the UI
    }
  };

  return (
    <OnboardingScreenComponent
      footerButton={{
        onPress,
        text: t(BonusProgramTexts.terms.button.text),
        expanded: true,
      }}
      illustration={<ThemedBonusBagCarry width={120} height={120} />}
      title={t(BonusProgramTexts.terms.title)}
      focusRef={focusRef}
      contentNode={<Terms error={enrollMutation.error} />}
      headerProps={{
        rightButton: {type: 'cancel'},
      }}
    />
  );
};

export const Terms = ({error}: {error: Error | null}) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();

  return (
    <>
      <Section style={styles.topSpacing}>
        <GenericSectionItem>
          <View style={styles.horizontalContainer}>
            <ThemeIcon
              color={theme.color.foreground.dynamic.primary}
              svg={Star}
              size="large"
            />
            <ThemeText
              typography="body__m"
              type="primary"
              style={styles.termDescription}
            >
              {t(BonusProgramTexts.terms.term1)}
            </ThemeText>
          </View>
        </GenericSectionItem>

        <GenericSectionItem>
          <View style={styles.horizontalContainer}>
            <ThemeIcon
              color={theme.color.foreground.dynamic.primary}
              svg={Delete}
              size="large"
            />
            <ThemeText
              typography="body__m"
              type="primary"
              style={styles.termDescription}
            >
              {t(BonusProgramTexts.terms.term2)}
            </ThemeText>
          </View>
        </GenericSectionItem>

        <GenericSectionItem>
          <View style={styles.horizontalContainer}>
            <ThemeIcon
              color={theme.color.foreground.dynamic.primary}
              svg={Feedback}
              size="large"
            />
            <ThemeText
              typography="body__m"
              type="primary"
              style={styles.termDescription}
            >
              {t(BonusProgramTexts.terms.term3)}
            </ThemeText>
          </View>
        </GenericSectionItem>

        <GenericSectionItem>
          <View style={styles.horizontalContainer}>
            <ThemeIcon
              color={theme.color.foreground.dynamic.primary}
              svg={Activity}
              size="large"
            />
            <ThemeText
              typography="body__m"
              type="primary"
              style={styles.termDescription}
            >
              {t(BonusProgramTexts.terms.term4)}
            </ThemeText>
          </View>
        </GenericSectionItem>
      </Section>
      <Section style={styles.topSpacing}>
        <LinkSectionItem
          text={t(BonusProgramTexts.terms.termsLink)}
          rightIcon={{svg: ExternalLink}}
          onPress={() =>
            openInAppBrowser(
              'https://www.atb.no/vilkar/personvernerklaering-for-kundetjenester/',
              'close',
            )
          }
          accessibility={{
            accessibilityHint: t(
              dictionary.appNavigation.a11yHintForExternalContent,
            ),
            accessibilityRole: 'link',
          }}
        />
      </Section>
      {error && (
        <MessageInfoBox
          style={styles.topSpacing}
          type="error"
          title={t(BonusProgramTexts.terms.error.title)}
          message={t(BonusProgramTexts.terms.error.description)}
        />
      )}
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.medium,
  },
  termDescription: {
    flex: 1,
  },
  topSpacing: {
    marginTop: theme.spacing.medium,
  },
}));
