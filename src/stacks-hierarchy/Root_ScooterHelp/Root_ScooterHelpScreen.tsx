import React, {useState} from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {RootNavigationProps, RootStackScreenProps} from '@atb/stacks-hierarchy';
import {ScooterHelpTexts} from '@atb/translations/screens/ScooterHelp';
import {
  ExpandableSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {ContentHeading, ScreenHeading} from '@atb/components/heading';
import {useNavigation} from '@react-navigation/native';
import {useFirestoreConfigurationContext} from '@atb/configuration';
import {FullScreenView} from '@atb/components/screen-view';
import {useOperators} from '@atb/mobility/use-operators';

export type ScooterHelpScreenProps =
  RootStackScreenProps<'Root_ScooterHelpScreen'>;

export const Root_ScooterHelpScreen = ({route}: ScooterHelpScreenProps) => {
  /* vehicleId is only for support request body in Root_ContactScooterOperatorScreen,
     it can be null when there is an active booking.
     The support api accepts either vehicleId(as assetId) or a bookingId */
  const {operatorId, vehicleId} = route.params;
  const operators = useOperators();
  const operatorName = operators.byId(operatorId)?.name;
  const style = useStyles();
  const {t, language} = useTranslation();
  const navigation = useNavigation<RootNavigationProps>();
  const {scooterFaqs} = useFirestoreConfigurationContext();
  const [currentlyOpenFaqIndex, setCurrentlyOpenFaqIndex] = useState<number>();

  return (
    <FullScreenView
      headerProps={{
        title: t(ScooterHelpTexts.title),
        rightButton: {type: 'close', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading ref={focusRef} text={t(ScooterHelpTexts.title)} />
      )}
    >
      <View style={style.container}>
        <ContentHeading text={t(ScooterHelpTexts.contactAndReport)} />
        <Section>
          {operatorId != undefined && operatorName && (
            <LinkSectionItem
              text={t(ScooterHelpTexts.contactOperator(operatorName))}
              onPress={() => {
                navigation.navigate('Root_ContactScooterOperatorScreen', {
                  vehicleId,
                  operatorId,
                  transitionOverride: 'slide-from-right',
                });
              }}
            />
          )}
          <LinkSectionItem
            text={t(ScooterHelpTexts.reportParking)}
            onPress={() =>
              navigation.navigate('Root_ParkingViolationsSelectScreen', {
                transitionOverride: 'slide-from-right',
              })
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
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacing.small,
    margin: theme.spacing.medium,
    marginBottom: theme.spacing.xLarge,
  },
}));
