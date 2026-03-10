import React, {useCallback, useState} from 'react';
import {KeyboardAvoidingView, View} from 'react-native';
import {Button} from '@atb/components/button';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  EnrollmentTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {
  GenericSectionItem,
  Section,
  TextInputSectionItem,
} from '@atb/components/sections';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';
import {ThemedBeacons} from '@atb/theme/ThemedAssets';
import {ThemeText} from '@atb/components/text';
import {useFontScale} from '@atb/utils/use-font-scale';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {ProfileScreenProps} from './navigation-types';
import {
  isKnownProgramId,
  KnownProgramId,
  useEnrollIntoProgramMutation,
} from '@atb/modules/enrollment';
import {OnboardingCarouselConfigId} from '@atb/modules/onboarding';

const programsWithOnboarding: OnboardingCarouselConfigId[] = [
  KnownProgramId.BONUS,
];

type Props = ProfileScreenProps<'Profile_EnrollmentScreen'>;

export const Profile_EnrollmentScreen = ({navigation}: Props) => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[0];
  0;
  const [inviteCode, setInviteCode] = useState<string>('');
  const fontScale = useFontScale();

  const {onEnroll, enrollMutation} = useEnroll();

  const hasError = enrollMutation.isError;
  const isLoading = enrollMutation.isPending;
  const isEnrolled = enrollMutation.isSuccess;

  const focusRef = useFocusOnLoad(navigation);

  const programTitle = getTextForLanguage(
    enrollMutation.data?.programTitle,
    language,
  );

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
      <FullScreenView
        focusRef={focusRef}
        headerProps={{
          title: t(EnrollmentTexts.header),
          leftButton: {type: 'back'},
        }}
        parallaxContent={(focusRef) => (
          <ScreenHeading ref={focusRef} text={t(EnrollmentTexts.header)} />
        )}
      >
        <View style={styles.contentContainer}>
          <Section>
            <GenericSectionItem>
              <View style={styles.horizontalContainer}>
                <ThemedBeacons
                  height={61 * fontScale}
                  width={61 * fontScale}
                  style={{
                    alignSelf: 'flex-start',
                  }}
                />
                <View style={styles.headerTextContainer}>
                  <ThemeText typography="body__s" color="secondary">
                    {t(EnrollmentTexts.info)}
                  </ThemeText>
                </View>
              </View>
            </GenericSectionItem>
          </Section>

          <TextInputSectionItem
            radius="top-bottom"
            inlineLabel={false}
            label={t(EnrollmentTexts.label)}
            placeholder={t(EnrollmentTexts.placeholder)}
            value={inviteCode}
            onChangeText={setInviteCode}
            autoCapitalize="none"
            errorText={hasError ? t(EnrollmentTexts.warning) : undefined}
          />
          {isEnrolled && (
            <MessageInfoBox
              type="valid"
              message={t(EnrollmentTexts.success(programTitle ?? ''))}
            />
          )}
          <Button
            expanded={true}
            onPress={() => onEnroll(inviteCode, () => setInviteCode(''))}
            text={t(EnrollmentTexts.button)}
            interactiveColor={interactiveColor}
            loading={isLoading}
          />
        </View>
      </FullScreenView>
    </KeyboardAvoidingView>
  );
};

export const useEnroll = () => {
  const navigation = useNavigation<RootNavigationProps>();
  const enrollMutation = useEnrollIntoProgramMutation();

  const onEnroll = useCallback(
    async (code: string, clearCode: () => void) => {
      const enrollment = await enrollMutation.mutateAsync(code);

      clearCode();

      if (
        isKnownProgramId(enrollment.programId) &&
        programsWithOnboarding.includes(enrollment.programId)
      ) {
        navigation.navigate('Root_OnboardingCarouselStack', {
          configId: enrollment.programId,
        });
      }

      return enrollment;
    },
    [enrollMutation, navigation],
  );

  return {
    onEnroll,
    enrollMutation,
  };
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  contentContainer: {
    padding: theme.spacing.medium,
    rowGap: theme.spacing.medium,
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.medium,
  },
  headerTextContainer: {
    flex: 1,
    gap: theme.spacing.xSmall,
  },
}));
