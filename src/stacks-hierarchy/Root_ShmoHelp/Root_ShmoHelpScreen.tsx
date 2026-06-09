import React, {useState} from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {ShmoHelpTexts} from '@atb/translations/screens/ShmoHelp';
import {ExpandableSectionItem, Section} from '@atb/components/sections';
import {ContentHeading, ScreenHeading} from '@atb/components/heading';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {FullScreenView} from '@atb/components/screen-view';
import {useOperators} from '@atb/modules/mobility';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {ScooterContactSection} from './components/ScooterContactSection';
import {BicycleContactSection} from './components/BicycleContactSection';

export type ShmoHelpScreenProps = RootStackScreenProps<'Root_ShmoHelpScreen'>;

export const Root_ShmoHelpScreen = ({
  navigation,
  route,
}: ShmoHelpScreenProps) => {
  /* vehicleId is only for support request body in Root_ContactShmoOperatorScreen,
     it can be null when there is an active booking.
     The support api accepts either vehicleId(as assetId), bookingId, or stationId */
  const {operatorId, formFactor} = route.params;
  const vehicleId =
    'vehicleId' in route.params ? route.params?.vehicleId : undefined;
  const bookingId =
    'bookingId' in route.params ? route.params?.bookingId : undefined;
  const stationId =
    'stationId' in route.params ? route.params?.stationId : undefined;

  const isBicycle = formFactor === FormFactor.Bicycle;

  const operators = useOperators();
  const operator = operators.byId(operatorId);
  const operatorName = operator?.name;

  const style = useStyles();
  const {t, language} = useTranslation();
  const {scooterFaqs, bicycleFaqs} = useFirestoreConfigurationContext();
  const contactInfo = operator?.support;

  const faqs = isBicycle ? bicycleFaqs : scooterFaqs;
  const [currentlyOpenFaqIndex, setCurrentlyOpenFaqIndex] = useState<number>();
  const focusRef = useFocusOnLoad(navigation);

  const contactParams = vehicleId
    ? {operatorId, vehicleId}
    : bookingId
      ? {operatorId, bookingId}
      : stationId
        ? {operatorId, stationId}
        : {operatorId, vehicleId: undefined};

  const navigateToContactForm = () =>
    navigation.navigate(
      'Root_ContactShmoOperatorScreen',
      Object.assign(
        {transitionOverride: 'slide-from-right' as const},
        contactParams,
      ),
    );

  return (
    <FullScreenView
      focusRef={focusRef}
      headerProps={{
        title: t(ShmoHelpTexts.title),
        rightButton: {type: 'close'},
      }}
      headerContent={(focusRef) => (
        <ScreenHeading ref={focusRef} text={t(ShmoHelpTexts.title)} />
      )}
    >
      <View style={style.container}>
        {isBicycle ? (
          <BicycleContactSection
            operatorName={operatorName}
            operatorLogoUrl={operator?.brandAssets?.brandImageUrl}
            contactInfo={contactInfo}
            onContactFormPress={navigateToContactForm}
          />
        ) : (
          <ScooterContactSection
            operatorName={operatorName}
            onContactFormPress={navigateToContactForm}
            onReportParkingPress={() =>
              navigation.navigate('Root_ParkingViolationsSelectScreen', {
                transitionOverride: 'slide-from-right',
              })
            }
          />
        )}

        <ContentHeading text={t(ShmoHelpTexts.faq)} />
        <Section>
          {faqs?.map((item, index) => (
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
