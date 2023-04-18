import {ScrollView, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import * as Sections from '@atb/components/sections';

import {
  getTextForLanguage,
  TicketAssistantTexts,
  useTranslation,
} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import React, {useState} from 'react';
import {Button} from '@atb/components/button';
import {themeColor} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_WelcomeScreen';
import {DashboardBackground} from '@atb/assets/svg/color/images';
import {useTicketAssistantState} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import {TicketAssistantScreenProps} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/navigation-types';
import {useOfferDefaults} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/use-offer-defaults';
import {useFirestoreConfiguration} from '@atb/configuration';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {Traveller} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/types';

type CategoryPickerProps =
  TicketAssistantScreenProps<'TicketAssistant_CategoryPickerScreen'>;
export const TicketAssistant_CategoryPickerScreen = ({
  navigation,
}: CategoryPickerProps) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();

  const {fareProductTypeConfigs} = useFirestoreConfiguration();

  const offerDefaults = useOfferDefaults(
    undefined,
    fareProductTypeConfigs[0].type,
  );

  const {selectableTravellers} = offerDefaults;
  const [currentlyOpen, setCurrentlyOpen] = useState<number>(
    selectableTravellers.findIndex((u) => u.count === 1),
  );

  const {data, updateData} = useTicketAssistantState();
  function updateCategory(traveller: Traveller) {
    const newData = {...data, traveller: traveller};
    updateData(newData);
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
        <ThemeText
          type={'body__primary--jumbo--bold'}
          style={styles.header}
          color={themeColor}
          accessibilityLabel={t(TicketAssistantTexts.welcome.titleA11yLabel)}
        >
          {t(TicketAssistantTexts.categoryPicker.title)}
        </ThemeText>

        <Sections.Section style={styles.categoriesContainer}>
          {/*eslint-disable-next-line rulesdir/translations-warning*/}
          {selectableTravellers.map((u, index) => {
            return (
              <Sections.ExpandableSectionItem
                key={index}
                textType={'body__primary--bold'}
                text={
                  (u.emoji ? u.emoji + ' ' : '') +
                  getReferenceDataName(u, language)
                }
                onPress={() => {
                  setCurrentlyOpen(index);
                }}
                expanded={currentlyOpen === index}
                showIconText={false}
                accessibility={{
                  accessibilityHint: t(
                    TicketAssistantTexts.categoryPicker.a11yHint,
                  ),
                }}
                expandContent={
                  <View>
                    <ThemeText
                      type={'body__tertiary'}
                      style={styles.expandedContent}
                      isMarkdown={true}
                    >
                      {getTextForLanguage(u.alternativeDescriptions, language)}
                    </ThemeText>
                    <Button
                      style={styles.chooseButton}
                      onPress={() => {
                        updateCategory({
                          id: u.userTypeString,
                          user_type: u.userTypeString,
                        });
                        navigation.navigate('TicketAssistant_DurationScreen');
                      }}
                      text={t(TicketAssistantTexts.categoryPicker.chooseButton)}
                      accessibilityHint={t(
                        TicketAssistantTexts.categoryPicker
                          .a11yChooseButtonHint,
                      )}
                    />
                  </View>
                }
              />
            );
          })}
        </Sections.Section>
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
    bottom: 250,
    padding: 0,
    margin: 0,
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    textAlign: 'center',
  },
  container: {
    flex: 1, //place content at top
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
