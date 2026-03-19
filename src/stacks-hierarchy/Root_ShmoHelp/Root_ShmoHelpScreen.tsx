import React, {useState} from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {ShmoHelpTexts} from '@atb/translations/screens/ShmoHelp';
import {
  ExpandableSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {ContentHeading, ScreenHeading} from '@atb/components/heading';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {FullScreenView} from '@atb/components/screen-view';
import {useOperators} from '@atb/modules/mobility';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

export type ShmoHelpScreenProps = RootStackScreenProps<'Root_ShmoHelpScreen'>;

export const Root_ShmoHelpScreen = ({
  navigation,
  route,
}: ShmoHelpScreenProps) => {
  /* vehicleId is only for support request body in Root_ContactScooterOperatorScreen,
     it can be null when there is an active booking.
     The support api accepts either vehicleId(as assetId), bookingId, or stationId */
  const {operatorId} = route.params;
  const vehicleId =
    'vehicleId' in route.params ? route.params?.vehicleId : undefined;
  const bookingId =
    'bookingId' in route.params ? route.params?.bookingId : undefined;
  const stationId =
    'stationId' in route.params ? route.params?.stationId : undefined;

  const operators = useOperators();
  const operatorName = operators.byId(operatorId)?.name;
  const style = useStyles();
  const {t, language} = useTranslation();
  const {scooterFaqs} = useFirestoreConfigurationContext();
  const [currentlyOpenFaqIndex, setCurrentlyOpenFaqIndex] = useState<number>();
  const focusRef = useFocusOnLoad(navigation);

  return (
    <FullScreenView
      focusRef={focusRef}
      headerProps={{
        title: t(ShmoHelpTexts.title),
        rightButton: {type: 'close'},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading ref={focusRef} text={t(ShmoHelpTexts.title)} />
      )}
    >
      <View style={style.container}>
        <ContentHeading text={t(ShmoHelpTexts.contactAndReport)} />
        <Section>
          {operatorId != undefined && operatorName && (
            <LinkSectionItem
              text={t(ShmoHelpTexts.contactOperator(operatorName))}
              onPress={() => {
                if (vehicleId) {
                  navigation.navigate('Root_ContactShmoOperatorScreen', {
                    vehicleId,
                    operatorId,
                    transitionOverride: 'slide-from-right',
                  });
                } else if (bookingId) {
                  navigation.navigate('Root_ContactShmoOperatorScreen', {
                    operatorId,
                    bookingId,
                    transitionOverride: 'slide-from-right',
                  });
                } else if (stationId) {
                  navigation.navigate('Root_ContactShmoOperatorScreen', {
                    operatorId,
                    stationId,
                    transitionOverride: 'slide-from-right',
                  });
                }
              }}
            />
          )}
          <LinkSectionItem
            text={t(ShmoHelpTexts.reportParking)}
            onPress={() =>
              navigation.navigate('Root_ParkingViolationsSelectScreen', {
                transitionOverride: 'slide-from-right',
              })
            }
          />
        </Section>
        <ContentHeading text={t(ShmoHelpTexts.faq)} />
        <Section>
          {scooterFaqs?.map((item, index) => (
            <ExpandableSectionItem
              key={item.id}
              text={getTextForLanguage(item.title, language) ?? ''}
              textType="body__m__strong"
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
