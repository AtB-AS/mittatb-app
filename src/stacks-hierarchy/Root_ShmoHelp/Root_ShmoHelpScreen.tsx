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
import {
  formatOpeningHoursSchedule,
  useOperators,
  useShmoBookingQuery,
  useSystemOpeningHoursQuery,
} from '@atb/modules/mobility';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {ShmoContactSection} from './components/ShmoContactSection';

export type ShmoHelpScreenProps = RootStackScreenProps<'Root_ShmoHelpScreen'>;

// Firestore FAQ ids are free-form content-editor strings, not guaranteed distinct from a fixed
// sentinel -- tagging the opening-hours entry with its own variant (rather than comparing it
// against FAQ ids as plain strings) rules out a collision expanding both at once.
type OpenAccordionItem = {type: 'opening-hours'} | {type: 'faq'; id: string};

export const Root_ShmoHelpScreen = ({
  navigation,
  route,
}: ShmoHelpScreenProps) => {
  /* vehicleId is only for support request body in Root_ContactShmoOperatorScreen,
     it can be null when there is an active booking.
     The support api accepts either vehicleId(as assetId), bookingId, or stationId */
  const {operatorId, formFactor, systemId} = route.params;
  const vehicleId =
    'vehicleId' in route.params ? route.params?.vehicleId : undefined;
  const bookingId =
    'bookingId' in route.params ? route.params?.bookingId : undefined;
  const stationId =
    'stationId' in route.params ? route.params?.stationId : undefined;
  const vehicleTypeId =
    'vehicleTypeId' in route.params ? route.params?.vehicleTypeId : undefined;

  const isBicycle = formFactor === FormFactor.Bicycle;

  const operators = useOperators();
  const operator = operators.byId(operatorId);
  const operatorName = operator?.name;

  const style = useStyles();
  const {t, language} = useTranslation();
  const {scooterFaqs, bicycleFaqs} = useFirestoreConfigurationContext();
  const contactInfo = operator?.support;

  const faqs = isBicycle ? bicycleFaqs : scooterFaqs;
  // Fare-contract details only has a bookingId, no systemId -- fall back to the booking for it.
  const {data: fallbackBooking} = useShmoBookingQuery(
    !systemId && !!bookingId,
    bookingId,
    false,
  );
  const resolvedSystemId =
    systemId ?? fallbackBooking?.asset.systemId ?? undefined;
  const {data: openingHours} = useSystemOpeningHoursQuery(resolvedSystemId);
  const [openAccordionItem, setOpenAccordionItem] =
    useState<OpenAccordionItem>();
  const focusRef = useFocusOnLoad(navigation);

  const contactParams = {
    operatorId,
    formFactor,
    ...(vehicleId
      ? {vehicleId}
      : bookingId
        ? {bookingId}
        : stationId
          ? {stationId, vehicleTypeId}
          : {vehicleId: undefined}),
  };

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
        <ShmoContactSection
          operatorName={operatorName}
          operatorLogoUrl={operator?.brandAssets?.brandImageUrl}
          contactInfo={contactInfo}
          formFactor={formFactor}
          onContactFormPress={navigateToContactForm}
          onReportParkingPress={() =>
            navigation.navigate('Root_ParkingViolationsSelectScreen', {
              transitionOverride: 'slide-from-right',
            })
          }
        />

        <ContentHeading text={t(ShmoHelpTexts.faq)} />
        <Section>
          {!!openingHours?.schedule?.length && (
            <ExpandableSectionItem
              text={t(ShmoHelpTexts.openingHours)}
              textType="body__m"
              showIconText={false}
              expanded={openAccordionItem?.type === 'opening-hours'}
              onPress={() => {
                setOpenAccordionItem({type: 'opening-hours'});
              }}
              expandContent={
                <ThemeText type="secondary">
                  {formatOpeningHoursSchedule(
                    openingHours.schedule,
                    language,
                    t,
                  ).join('\n')}
                </ThemeText>
              }
            />
          )}
          {faqs?.map((item) => (
            <ExpandableSectionItem
              key={item.id}
              text={getTextForLanguage(item.title, language) ?? ''}
              textType="body__m"
              showIconText={false}
              expanded={
                openAccordionItem?.type === 'faq' &&
                openAccordionItem.id === item.id
              }
              onPress={() => {
                setOpenAccordionItem({type: 'faq', id: item.id});
              }}
              expandContent={
                <ThemeText isMarkdown={true} type="secondary">
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
