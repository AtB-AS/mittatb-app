import React, {useState} from 'react';
import {View} from 'react-native';
import {FullScreenHeader} from '@atb/components/screen-header';
import {useTranslation, TipsAndInformationTexts} from '@atb/translations';
import {StyleSheet, Theme} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {themeColor} from '@atb/stacks-hierarchy/Root_OnboardingStack/Onboarding_WelcomeScreen';
import * as Sections from '@atb/components/sections';
import {Button} from '@atb/components/button';

export const Root_TipsAndInformation = ({navigation}: {navigation: any}) => {
  //const {enable_ticketing} = useRemoteConfig();
  const styles = useScreenStyle();

  const {t} = useTranslation();

  const [current, setCurrentExpanded] = useState<number>(1);

  const setCurrentExpandedFunc = (index: number) => {
    setCurrentExpanded(index);
    console.log(index);
  };
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
          {TipsAndInformationTexts.tips.map(({emoji, title, tip}, index) => (
            <Sections.ExpandableSectionItem
              key={index}
              textType={'body__primary--bold'}
              leftIcon={emoji}
              text={t(title)}
              showIconText={false}
              onPress={() => {
                setCurrentExpandedFunc(index);
              }}
              expanded={current === index}
              expandContent={
                <ThemeText
                  type={'body__tertiary'}
                  style={styles.expandedContent}
                  isMarkdown={true}
                >
                  {t(tip)}
                </ThemeText>
              }
            />
          ))}
          <Sections.ExpandableSectionItem
            textType={'body__primary--bold'}
            leftIcon={TipsAndInformationTexts.ticketAssistantTip.emoji}
            text={t(TipsAndInformationTexts.ticketAssistantTip.title)}
            showIconText={false}
            expandContent={
              <View>
                <ThemeText
                  type={'body__tertiary'}
                  style={styles.expandedContent}
                  isMarkdown={true}
                >
                  {t(TipsAndInformationTexts.ticketAssistantTip.tip)}
                </ThemeText>
                <Button
                  style={styles.goToAssistantButton}
                  onPress={() => {
                    navigation.navigate('Root_TicketAssistantStack');
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
    alignContent: 'center',
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
    paddingTop: theme.spacings.xLarge,
    paddingHorizontal: theme.spacings.xLarge,
  },
}));
