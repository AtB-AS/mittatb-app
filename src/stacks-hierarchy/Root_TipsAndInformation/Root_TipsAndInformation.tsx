import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {FullScreenHeader} from '@atb/components/screen-header';
import {
  getTextForLanguage,
  TicketingTexts,
  useTranslation,
} from '@atb/translations';
import {StyleSheet, Theme} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {themeColor} from '@atb/stacks-hierarchy/Root_OnboardingStack/Onboarding_WelcomeScreen';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import firestore from '@react-native-firebase/firestore';
import {
  TipRaw,
  TipType,
} from '@atb/stacks-hierarchy/Root_TipsAndInformation/types';
import {mapToTips} from '@atb/stacks-hierarchy/Root_TipsAndInformation/converters';
import {ExpandableSectionItem, Section} from '@atb/components/sections';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {sortTipsByTitle} from '@atb/stacks-hierarchy/Root_TipsAndInformation/sort-tips-by-title';

type Props = RootStackScreenProps<'Root_TipsAndInformation'>;

export const Root_TipsAndInformation = ({}: Props) => {
  const styles = useScreenStyle();
  const {t, language} = useTranslation();
  const [currentlyOpen, setCurrentlyOpen] = useState<number>();
  const {bottom: safeAreaBottom} = useSafeAreaInsets();

  const [tips, setTips] = useState<TipType[]>([]);

  useEffect(
    () =>
      firestore()
        .collection<TipRaw>('tipsAndInformation')
        .onSnapshot(
          async (snapshot) => {
            const newTips = mapToTips(snapshot.docs);
            const sortedTips = sortTipsByTitle(newTips, language);
            setTips(sortedTips);
          },
          (err) => {
            console.warn(err);
          },
        ),
    [],
  );

  return (
    <View style={[styles.container, {paddingBottom: safeAreaBottom}]}>
      <FullScreenHeader leftButton={{type: 'close'}} />

      <ScrollView>
        <ThemeText
          type="heading--jumbo"
          style={styles.title}
          accessibilityLabel={t(TicketingTexts.tipsAndInformationTile.title)}
          color={themeColor}
        >
          {t(TicketingTexts.tipsAndInformationTile.title)}
        </ThemeText>
        <View style={styles.innerContainer}>
          <Section style={styles.tipsContainer}>
            {tips.map((tip, index) => {
              const title = getTextForLanguage(tip.title, language);
              const emoji = tip.emoji;
              const description = getTextForLanguage(tip.description, language);

              if (!emoji || !title || !description) return null;

              return (
                <ExpandableSectionItem
                  key={index}
                  textType="body__primary--bold"
                  text={emoji + ' ' + title}
                  showIconText={false}
                  expanded={currentlyOpen === index}
                  onPress={() => {
                    setCurrentlyOpen(index);
                  }}
                  expandContent={
                    <ThemeText
                      type="body__secondary"
                      style={styles.expandedContent}
                      isMarkdown={true}
                    >
                      {description}
                    </ThemeText>
                  }
                />
              );
            })}
          </Section>
        </View>
      </ScrollView>
    </View>
  );
};

const useScreenStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_accent_0.background,
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
