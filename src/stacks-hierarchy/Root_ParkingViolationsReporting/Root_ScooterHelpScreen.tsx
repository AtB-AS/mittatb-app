import React, {useState} from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {RootNavigationProps, RootStackScreenProps} from '@atb/stacks-hierarchy';
import {ScooterHelpTexts} from '@atb/translations/screens/ScooterHelp';
import {ScreenContainer} from './components/ScreenContainer';
import {
  ExpandableSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {ContentHeading} from '@atb/components/heading';
import {useNavigation} from '@react-navigation/native';
import {useVehicle} from '@atb/mobility/use-vehicle';
import {useFirestoreConfigurationContext} from '@atb/configuration';

export type ScooterHelpScreenProps =
  RootStackScreenProps<'Root_ScooterHelpScreen'>;

export const Root_ScooterHelpScreen = ({route}: ScooterHelpScreenProps) => {
  const {vehicleId} = route.params;
  const style = useStyles();
  const {t, language} = useTranslation();
  const navigation = useNavigation<RootNavigationProps>();
  const {scooterFaqs} = useFirestoreConfigurationContext();
  const [currentlyOpenFaqIndex, setCurrentlyOpenFaqIndex] = useState<number>();

  const {operatorName, operatorId} = useVehicle(vehicleId);

  return (
    <ScreenContainer
      leftHeaderButton={{type: 'close'}}
      title={t(ScooterHelpTexts.title)}
    >
      <View style={style.container}>
        <ContentHeading text={t(ScooterHelpTexts.contactAndReport)} />
        <Section>
          {operatorId != undefined && (
            <LinkSectionItem
              text={t(ScooterHelpTexts.contactOperator(operatorName))}
              onPress={() => {
                navigation.navigate('Root_ScooterContactOperatorScreen', {
                  vehicleId,
                  operatorId,
                });
              }}
            />
          )}
          <LinkSectionItem
            text={t(ScooterHelpTexts.reportParking)}
            onPress={() =>
              navigation.navigate('Root_ParkingViolationsSelectScreen')
            }
          />
        </Section>
        <ContentHeading text={t(ScooterHelpTexts.faq)} />
        <Section>
          {scooterFaqs?.map((item, index) => (
            <ExpandableSectionItem
              key={item.id}
              text={getTextForLanguage(item.title, language) ?? ''}
              textType="body__primary--bold"
              showIconText={false}
              expanded={currentlyOpenFaqIndex === index}
              onPress={() => {
                setCurrentlyOpenFaqIndex(index);
              }}
              expandContent={
                <ThemeText isMarkdown={true}>
                  {getTextForLanguage(item.description, language)}
                </ThemeText>
              }
            />
          ))}
        </Section>
      </View>
    </ScreenContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacing.small,
    margin: theme.spacing.medium,
  },
}));
