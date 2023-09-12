import {Linking, ScrollView, View} from 'react-native';
import {StyleSheet} from '@atb/theme';

import {
  getTextForLanguage,
  TicketAssistantTexts,
  translation as _,
  useTranslation,
} from '@atb/translations';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import React, {useEffect, useState} from 'react';
import {Button} from '@atb/components/button';
import {themeColor} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_WelcomeScreen';
import {DashboardBackground} from '@atb/assets/svg/color/images';
import {TicketAssistantScreenProps} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/navigation-types';
import {useOfferDefaults} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/use-offer-defaults';
import {useFirestoreConfiguration} from '@atb/configuration';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {useAccessibilityContext} from '@atb/AccessibilityContext';
import {Traveller} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/types';
import {useTicketAssistantState} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import {ExpandableSectionItem, Section} from '@atb/components/sections';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {PressableOpacity} from '@atb/components/pressable-opacity';

type CategoryPickerProps =
  TicketAssistantScreenProps<'TicketAssistant_CategoryPickerScreen'>;
export const TicketAssistant_CategoryPickerScreen = ({
  navigation,
}: CategoryPickerProps) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  const a11yContext = useAccessibilityContext();
  const focusRef = useFocusOnLoad();

  const {fareProductTypeConfigs} = useFirestoreConfiguration();

  const offerDefaults = useOfferDefaults(
    undefined,
    fareProductTypeConfigs[0].type,
  );
  const {updateInputParams} = useTicketAssistantState();

  const {selectableTravellers} = offerDefaults;
  const defaultTravellerIndex = selectableTravellers.findIndex(
    (a) => a.count > 0,
  );
  const [currentlyOpen, setCurrentlyOpen] = useState<number>(
    defaultTravellerIndex > 0 ? defaultTravellerIndex : 0,
  );

  function updateCategory(traveller: Traveller) {
    updateInputParams({traveller: traveller});
  }

  const unsubscribe = navigation.addListener('blur', () => {
    const traveller = selectableTravellers[currentlyOpen];
    updateCategory({
      id: traveller.userTypeString,
      userType: traveller.userTypeString,
    });
  });

  useEffect(() => {
    return unsubscribe;
  }, [navigation]);

  function getAdditionalTitleText(userTypeString: string) {
    switch (userTypeString) {
      case 'CHILD':
        return t(_('/ungdom', '/youth', '/ungdom'));
      default:
        return '';
    }
  }
  function AdditionalDescription(userTypeString: string) {
    const preLinkText = {
      nb: 'Ungdomsbillett fra 16 til og med 19 år er ikke med i billettveilederen og kan ikke kjøpes i AtB-appen.',
      en: 'Youth ticket from 16 up to and including 19 years is not included in the ticket guide and cannot be purchased in the AtB app.',
      nn: 'Ungdomsbillett frå 16 til og med 19 år er ikkje med i billettvegleiaren og kan ikkje kjøpast i AtB-appen.',
    };

    const linkText = {
      nb: 'Les mer om ungdomsbillett.',
      en: 'Read more about the youth ticket.',
      nn: 'Les meir om ungdomsbillett.',
    };

    const handleLinkPress = () => {
      Linking.openURL('https://atb.no/ungdomsbillett/');
    };

    if (userTypeString === 'CHILD') {
      return (
        <>
          <ThemeText type={'body__secondary'} style={styles.expandedContent}>
            {`\n\n${preLinkText[language]} `}
          </ThemeText>
          <ThemeText
            type={'body__secondary'}
            style={[styles.expandedContent, {textDecorationLine: 'underline'}]}
            onPress={handleLinkPress}
          >
            {linkText[language]}
          </ThemeText>
        </>
      );
    }

    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.backdrop}>
        <DashboardBackground width={'100%'} height={'100%'} />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View ref={focusRef} accessible={true}>
          <ThemeText
            type={'heading--big'}
            style={styles.header}
            accessibilityRole={'header'}
            color={themeColor}
            accessibilityLabel={t(TicketAssistantTexts.categoryPicker.title)}
          >
            {t(TicketAssistantTexts.categoryPicker.title)}
          </ThemeText>
        </View>

        {!a11yContext.isScreenReaderEnabled ? (
          <Section style={styles.categoriesContainer}>
            {selectableTravellers.map((u, index) => {
              return (
                <ExpandableSectionItem
                  key={index}
                  textType={'body__primary--bold'}
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
                        type={'body__secondary'}
                        style={styles.expandedContent}
                        isMarkdown={true}
                      >
                        {getTextForLanguage(
                          u.alternativeDescriptions,
                          language,
                        )}
                        {AdditionalDescription(u.userTypeString)}
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
            {selectableTravellers.map((u, index) => {
              const title = getReferenceDataName(u, language);
              const description = getTextForLanguage(
                u.alternativeDescriptions,
                language,
              );
              const accessibilityLabel = [title, description].join(
                screenReaderPause,
              );
              return (
                <View key={index} style={styles.a11yCategoryCards}>
                  <PressableOpacity
                    onPress={() => {
                      setCurrentlyOpen(index);
                      navigation.navigate('TicketAssistant_FrequencyScreen');
                    }}
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
                        type={'body__primary--bold'}
                        isMarkdown={true}
                      >
                        {title}
                      </ThemeText>
                      <ThemeText
                        type={'body__tertiary'}
                        style={styles.expandedContent}
                        isMarkdown={true}
                      >
                        {description}
                      </ThemeText>
                    </View>
                  </PressableOpacity>
                </View>
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
    padding: theme.spacings.medium,
    backgroundColor: theme.static.background.background_0.background,
    margin: theme.spacings.medium,
    borderRadius: theme.border.radius.regular,
    gap: theme.spacings.medium,
  },
  a11yTitle: {
    marginBottom: theme.spacings.small,
  },
  header: {
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_accent_0.background,
  },
  scrollView: {
    flex: 1,
  },
  test: {
    flex: 1,
    marginTop: theme.spacings.xLarge,
  },
  chooseButton: {
    marginTop: theme.spacings.medium,
  },
  expandedContent: {
    color: theme.text.colors.secondary,
  },
  categoriesContainer: {
    marginTop: theme.spacings.xLarge,
    borderRadius: theme.border.radius.regular,
    backgroundColor: theme.static.background.background_1.background,
    marginHorizontal: theme.spacings.xLarge,
  },
}));
