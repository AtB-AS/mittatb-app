import {ScrollView, Text, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import * as Sections from '@atb/components/sections';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {Button} from '@atb/components/button';

export const TicketAssistant_CategoryPickerScreen = () => {
  const styles = useThemeStyles();
  const {t} = useTranslation();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View>
        <Text>TODO</Text>
        <View style={styles.innerContainer}>
          <Sections.Section style={styles.tipsContainer}>
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
                        style={styles.goToAssistantButton}
                        onPress={() => {}}
                        text={t(
                          TicketAssistantTexts.categoryPicker.chooseButton,
                        )}
                      />
                    </View>
                  }
                />
              ),
            )}
          </Sections.Section>
        </View>
      </View>
    </ScrollView>
  );
};
const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
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
    paddingHorizontal: theme.spacings.xLarge,
  },
}));
