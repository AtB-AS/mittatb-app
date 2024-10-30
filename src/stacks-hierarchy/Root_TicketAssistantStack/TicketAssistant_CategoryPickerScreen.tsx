import {Linking, ScrollView, View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';

import {
  getTextForLanguage,
  TicketAssistantTexts,
  translation as _,
  useTranslation,
} from '@atb/translations';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import React, {useCallback, useEffect, useState} from 'react';
import {Button} from '@atb/components/button';
import {getThemeColor} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_WelcomeScreen';
import {DashboardBackground} from '@atb/assets/svg/color/images';
import {TicketAssistantScreenProps} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/navigation-types';
import {useOfferDefaults} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/use-offer-defaults';
import {useFirestoreConfiguration} from '@atb/configuration';
import {getReferenceDataName} from '@atb/configuration';
import {useAccessibilityContext} from '@atb/AccessibilityContext';
import {Traveller} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/types';
import {useTicketAssistantState} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import {ExpandableSectionItem, Section} from '@atb/components/sections';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {TICKET_ASSISTANT_FREQUENCY_SCREEN} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/Root_TicketAssistantStack';

type CategoryPickerProps =
  TicketAssistantScreenProps<'TicketAssistant_CategoryPickerScreen'>;
export const TicketAssistant_CategoryPickerScreen = ({
  navigation,
}: CategoryPickerProps) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  const {theme} = useTheme();
  const themeColor = getThemeColor(theme);
  const a11yContext = useAccessibilityContext();

  const focusRef = useFocusOnLoad();

  const {fareProductTypeConfigs} = useFirestoreConfiguration();

  const offerDefaults = useOfferDefaults(undefined, fareProductTypeConfigs[0]);
  const {updateInputParams} = useTicketAssistantState();

  const {selection} = offerDefaults;
  const defaultTravellerIndex = selection.userProfilesWithCount.findIndex(
    (a) => a.count > 0,
  );
  const [currentlyOpen, setCurrentlyOpen] = useState<number>(
    defaultTravellerIndex > 0 ? defaultTravellerIndex : 0,
  );

  const updateCategory = useCallback(
    (traveller: Traveller) => {
      updateInputParams({traveller: traveller});
    },
    [updateInputParams],
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      const traveller = selection.userProfilesWithCount[currentlyOpen];
      updateCategory({
        id: traveller.userTypeString,
        userType: traveller.userTypeString,
      });
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, selection, currentlyOpen, updateCategory]);

  function getAdditionalTitleText(userTypeString: string) {
    switch (userTypeString) {
      case 'CHILD':
        return t(_('/ungdom', '/youth', '/ungdom'));
      default:
        return '';
    }
  }
  function additionalDescription(userTypeString: string) {
    const handleLinkPress = () => {
      Linking.openURL('https://atb.no/ungdomsbillett/');
    };

    if (userTypeString === 'CHILD') {
      return (
        <>
          <ThemeText type="body__secondary" style={styles.expandedContent}>
            {'\n\n' +
              t(TicketAssistantTexts.categoryPicker.childPreLinkText) +
              ' '}
          </ThemeText>
          <ThemeText
            type="body__secondary"
            style={[styles.expandedContent, {textDecorationLine: 'underline'}]}
            onPress={handleLinkPress}
            accessibilityRole="link"
          >
            {t(TicketAssistantTexts.categoryPicker.childLinkText)}
          </ThemeText>
        </>
      );
    }

    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.backdrop}>
        <DashboardBackground width="100%" height="100%" />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View accessible={true} ref={focusRef}>
          <ThemeText
            type="heading--big"
            style={styles.header}
            accessibilityRole="header"
            color={themeColor}
            accessibilityLabel={t(TicketAssistantTexts.categoryPicker.title)}
          >
            {t(TicketAssistantTexts.categoryPicker.title)}
          </ThemeText>
        </View>

        {!a11yContext.isScreenReaderEnabled ? (
          <Section style={styles.categoriesContainer}>
            {selection.userProfilesWithCount.map((u, index) => {
              return (
                <ExpandableSectionItem
                  key={index}
                  textType="body__primary--bold"
                  text={
                    (u.emoji ? u.emoji + ' ' : '') +
                    getReferenceDataName(u, language) +
                    getAdditionalTitleText(u.userTypeString)
                  }
                  onPress={() => {
                    setCurrentlyOpen(index);
                  }}
                  expanded={currentlyOpen === index}
                  showIconText={false}
                  expandContent={
                    <View>
                      <ThemeText
                        type="body__secondary"
                        style={styles.expandedContent}
                        isMarkdown={true}
                      >
                        {getTextForLanguage(
                          u.alternativeDescriptions,
                          language,
                        )}
                        {additionalDescription(u.userTypeString)}
                      </ThemeText>
                      <Button
                        style={styles.chooseButton}
                        onPress={() => {
                          updateCategory({
                            id: u.userTypeString,
                            userType: u.userTypeString,
                          });
                          navigation.navigate(
                            'TicketAssistant_FrequencyScreen',
                          );
                        }}
                        text={t(
                          TicketAssistantTexts.categoryPicker.chooseButton,
                        )}
                      />
                    </View>
                  }
                />
              );
            })}
          </Section>
        ) : (
          <>
            {selection.userProfilesWithCount.map((u, index) => {
              const title = getReferenceDataName(u, language);
              const description = getTextForLanguage(
                u.alternativeDescriptions,
                language,
              );
              const accessibilityLabel = [title, description].join(
                screenReaderPause,
              );
              return (
                <PressableOpacity
                  key={u.id}
                  onPress={() => {
                    setCurrentlyOpen(index);
                    navigation.navigate(TICKET_ASSISTANT_FREQUENCY_SCREEN);
                  }}
                  style={styles.a11yCategoryCards}
                  accessible={true}
                  accessibilityLabel={accessibilityLabel}
                  accessibilityHint={t(
                    TicketAssistantTexts.categoryPicker.a11yChooseButtonHint({
                      value: getReferenceDataName(u, language),
                    }),
                  )}
                >
                  <View style={styles.contentContainer}>
                    <ThemeText
                      style={styles.a11yTitle}
                      type="body__primary--bold"
                      isMarkdown={true}
                    >
                      {title}
                    </ThemeText>
                    <ThemeText
                      type="body__tertiary"
                      style={styles.expandedContent}
                      isMarkdown={true}
                    >
                      {description}
                    </ThemeText>
                  </View>
                </PressableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  backdrop: {
    position: 'absolute',
    height: 250,
    left: 0,
    right: 0,
    bottom: 45,
    padding: 0,
    margin: 0,
  },
  contentContainer: {
    flexGrow: 1,
  },

  a11yCategoryCards: {
    flexDirection: 'row',
    padding: theme.spacing.medium,
    backgroundColor: theme.color.background.neutral[0].background,
    margin: theme.spacing.medium,
    borderRadius: theme.border.radius.regular,
    gap: theme.spacing.medium,
  },
  a11yTitle: {
    marginBottom: theme.spacing.small,
  },
  header: {
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: theme.color.background.accent[0].background,
  },
  scrollView: {
    flex: 1,
  },
  test: {
    flex: 1,
    marginTop: theme.spacing.xLarge,
  },
  chooseButton: {
    marginTop: theme.spacing.medium,
  },
  expandedContent: {
    color: theme.color.foreground.dynamic.secondary,
  },
  categoriesContainer: {
    marginTop: theme.spacing.xLarge,
    borderRadius: theme.border.radius.regular,
    backgroundColor: theme.color.background.neutral[1].background,
    marginHorizontal: theme.spacing.xLarge,
  },
}));
