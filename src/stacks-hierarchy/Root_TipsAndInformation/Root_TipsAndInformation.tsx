import React, {useState} from 'react';
import {View} from 'react-native';
import {FullScreenHeader} from '@atb/components/screen-header';
import {TipsAndInformationTexts, useTranslation} from '@atb/translations';
import {StyleSheet, Theme} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {themeColor} from '@atb/stacks-hierarchy/Root_OnboardingStack/Onboarding_WelcomeScreen';
import * as Sections from '@atb/components/sections';
import {Button} from '@atb/components/button';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';

type Props = RootStackScreenProps<'Root_TipsAndInformation'>;

export const Root_TipsAndInformation = ({navigation}: Props) => {
  const styles = useScreenStyle();
  const {t} = useTranslation();
  const [currentlyOpen, setCurrentlyOpen] = useState<number>(0);

  const assistantTipIndex = TipsAndInformationTexts.tips.length;

  return (
    <View style={styles.container}>
      <FullScreenHeader leftButton={{type: 'close'}} />

      <ThemeText
        type="body__primary--jumbo--bold"
        style={styles.title}
        accessibilityLabel={t(TipsAndInformationTexts.title)}
        color={themeColor}
      >
        {t(TipsAndInformationTexts.title)}
      </ThemeText>

      <View style={styles.innerContainer}>
        <Sections.Section style={styles.tipsContainer}>
          {/* eslint-disable-next-line rulesdir/translations-warning */}
          {TipsAndInformationTexts.tips.map(({title, tip}, index) => (
            <Sections.ExpandableSectionItem
              key={index}
              textType="body__primary--bold"
              text={t(title)}
              showIconText={false}
              expanded={currentlyOpen === index}
              onPress={() => {
                setCurrentlyOpen(index);
              }}
              expandContent={
                <ThemeText
                  type="body__tertiary"
                  style={styles.expandedContent}
                  isMarkdown={true}
                >
                  {t(tip)}
                </ThemeText>
              }
            />
          ))}
          <Sections.ExpandableSectionItem
            textType="body__primary--bold"
            text={t(TipsAndInformationTexts.ticketAssistantTip.title)}
            showIconText={false}
            onPress={() => {
              setCurrentlyOpen(assistantTipIndex);
            }}
            expanded={currentlyOpen === assistantTipIndex}
            expandContent={
              <View>
                <ThemeText
                  type="body__tertiary"
                  style={styles.expandedContent}
                  isMarkdown={true}
                >
                  {t(TipsAndInformationTexts.ticketAssistantTip.tip)}
                </ThemeText>
                <Button
                  style={styles.goToAssistantButton}
                  onPress={() => {
                    navigation.navigate('Root_TicketAssistantStack');
                    setCurrentlyOpen(assistantTipIndex);
                  }}
                  text={t(TipsAndInformationTexts.goToAssistantButton.title)}
                />
              </View>
            }
          />
        </Sections.Section>
      </View>
    </View>
  );
};

const useScreenStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_accent_0.background,
  },
  goToAssistantButton: {
    marginTop: theme.spacings.medium,
  },
  expandedContent: {
    color: theme.text.colors.secondary,
  },
  tipsContainer: {
    borderRadius: theme.border.radius.regular,
    backgroundColor: theme.static.background.background_1.background,
  },
  contentContainer: {
    marginTop: theme.spacings.small,
    backgroundColor: theme.static.background.background_accent_0.background,
  },
  title: {
    width: '100%',
    textAlign: 'center',
    marginVertical: theme.spacings.xLarge,
  },
  innerContainer: {
    marginTop: theme.spacings.xLarge,
    paddingHorizontal: theme.spacings.xLarge,
  },
}));
