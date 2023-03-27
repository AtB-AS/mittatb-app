import {ScrollView, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import * as Sections from '@atb/components/sections';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import React, {useContext} from 'react';
import {Button} from '@atb/components/button';
import {themeColor} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_WelcomeScreen';
import {DashboardBackground} from '@atb/assets/svg/color/images';
import TicketAssistantContext from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';

export const TicketAssistant_CategoryPickerScreen = () => {
  const styles = useThemeStyles();
  const {t} = useTranslation();

  const contextValue = useContext(TicketAssistantContext);

  if (!contextValue) throw new Error('Context is undefined!');

  const {data, updateData} = contextValue;
  function updateCategory(value: number) {
    const newData = {...data, category: value.toString()};
    updateData(newData);
    console.log('Context Data \n' + JSON.stringify(newData, null, 2));
  }

  return (
    <View style={styles.container}>
      <View style={styles.backdrop}>
        <DashboardBackground width={'100%'} height={'100%'} />
      </View>
      <ScrollView>
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
          {TicketAssistantTexts.categoryPicker.categories.map(
            ({title, description}, index) => (
              <Sections.ExpandableSectionItem
                key={index}
                textType={'body__primary--bold'}
                text={t(title)}
                showIconText={false}
                expandContent={
                  <View>
                    <ThemeText
                      type={'body__tertiary'}
                      style={styles.expandedContent}
                      isMarkdown={true}
                    >
                      {t(description)}
                    </ThemeText>
                    <Button
                      style={styles.chooseButton}
                      onPress={() => {
                        updateCategory(index);
                      }}
                      text={t(TicketAssistantTexts.categoryPicker.chooseButton)}
                    />
                  </View>
                }
              />
            ),
          )}
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
  header: {
    textAlign: 'center',
  },
  container: {
    height: '100%',
    flex: 1,
    //place content at top
    backgroundColor: theme.static.background.background_accent_0.background,
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
