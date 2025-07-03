import React, {useCallback, useState} from 'react';
import {KeyboardAvoidingView, View} from 'react-native';
import {Button} from '@atb/components/button';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {EnrollmentTexts, useTranslation} from '@atb/translations';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {
  GenericSectionItem,
  Section,
  TextInputSectionItem,
} from '@atb/components/sections';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {enrollIntoBetaGroups} from '@atb/api/enrollment';
import analytics from '@react-native-firebase/analytics';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';
import {ThemedBeacons} from '@atb/theme/ThemedAssets';
import {ThemeText} from '@atb/components/text';
import {useFontScale} from '@atb/utils/use-font-scale';

export const Profile_EnrollmentScreen = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[0];
  const [inviteCode, setInviteCode] = useState<string>('');
  const fontScale = useFontScale();

  const {onEnroll, hasError, isLoading, isEnrolled} = useEnroll();

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
      <FullScreenView
        headerProps={{
          title: t(EnrollmentTexts.header),
          leftButton: {type: 'back', withIcon: true},
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
                  <ThemeText typography="body__secondary" color="secondary">
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
            <MessageInfoBox type="valid" message={t(EnrollmentTexts.success)} />
          )}
          <Button
            expanded={true}
            onPress={() => onEnroll(inviteCode)}
            text={t(EnrollmentTexts.button)}
            interactiveColor={interactiveColor}
            loading={isLoading}
          />
        </View>
      </FullScreenView>
    </KeyboardAvoidingView>
  );
};

type UserProperties = {[key: string]: string | null};

const useEnroll = () => {
  const {refresh} = useRemoteConfigContext();

  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const onEnroll = useCallback(
    async function onEnroll(key: string) {
      setHasError(false);
      setIsLoading(true);
      try {
        const {data: enrollment} = await enrollIntoBetaGroups(key);
        if (enrollment && enrollment.status === 'ok') {
          const userProperties = enrollment.groups.reduce<UserProperties>(
            (acc, group) => ({...acc, [group]: 'true'}),
            {},
          );
          await analytics().setUserProperties(userProperties);
          refresh();
          setIsEnrolled(true);
        }
      } catch (err) {
        console.warn(err);
        setHasError(true);
        setIsEnrolled(false);
      } finally {
        setIsLoading(false);
      }
    },
    [setHasError, setIsLoading, setIsEnrolled, refresh],
  );

  return {
    hasError,
    isLoading,
    isEnrolled,
    onEnroll,
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
