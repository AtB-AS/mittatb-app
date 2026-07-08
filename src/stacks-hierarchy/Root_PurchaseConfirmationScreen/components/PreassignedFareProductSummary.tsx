import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {MessageInfoText} from '@atb/components/message-info-text';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {
  FareProductTypeConfig,
  FareZone,
  getReferenceDataName,
} from '@atb/modules/configuration';
import type {PreassignedFareProduct} from '@atb/modules/ticketing';
import {GlobalMessage} from '@atb/modules/global-messages';
import {GlobalMessageContextEnum} from '@atb/modules/global-messages';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  Language,
  PurchaseConfirmationTexts,
  getTextForLanguage,
  useTranslation,
  dictionary,
} from '@atb/translations';
import {formatToLongDateTime, secondsToDuration} from '@atb/utils/date';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils';
import React from 'react';
import {View} from 'react-native';
import {NativeBlockButton} from '@atb/components/native-button';
import {TicketRecipientType} from '@atb/modules/ticketing';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {
  BookingSummary,
  type BookingJourneySegment,
} from '@atb/components/booking-summary';
import type {Leg} from '@atb/api/types/trips';
import {
  findAllNoticesFromLeg,
  findAllSituationsFromLeg,
} from '@atb/modules/situations';
import SvgEdit from '@atb/assets/svg/mono-icons/actions/Edit';
import {ThemeIcon} from '@atb/components/theme-icon';

type Props = {
  preassignedFareProduct: PreassignedFareProduct;
  fareProductTypeConfig: FareProductTypeConfig;
  recipient?: TicketRecipientType;
  fromPlace: FareZone | StopPlaceFragment | undefined;
  toPlace: FareZone | StopPlaceFragment | undefined;
  validDurationSeconds?: number;
  travelDate?: string;
  legs?: Leg[];
  onEdit?: () => void;
};

export const PreassignedFareContractSummary = ({
  preassignedFareProduct,
  fareProductTypeConfig,
  recipient,
  fromPlace,
  toPlace,
  validDurationSeconds,
  travelDate,
  legs,
  onEdit,
}: Props) => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const {isShowValidTimeInfoEnabled} = useFeatureTogglesContext();

  const {zoneSelectionMode} = fareProductTypeConfig.configuration;

  const fromPlaceName = fromPlace ? getPlaceName(fromPlace, language) : '';
  const toPlaceName = toPlace ? getPlaceName(toPlace, language) : '';

  const travelDateText = travelDate
    ? t(
        PurchaseConfirmationTexts.travelDate.futureDate(
          formatToLongDateTime(travelDate, language),
        ),
      )
    : t(PurchaseConfirmationTexts.travelDate.now);

  const {theme} = useThemeContext();

  function summary(text?: string) {
    if (!text) return null;
    return (
      <ThemeText
        style={styles.smallTopMargin}
        typography="body__s"
        type="secondary"
        testID="summaryText"
      >
        {text}
      </ThemeText>
    );
  }

  const SummaryText = () => {
    switch (zoneSelectionMode) {
      case 'multiple-stop-harbor':
        return summary(
          t(
            PurchaseConfirmationTexts.validityTexts.harbor.messageInHarborZones,
          ),
        );
      case 'none':
        return summary(
          getTextForLanguage(
            preassignedFareProduct.description ?? [],
            language,
          ),
        );
      default:
        return summary(
          fromPlace?.id === toPlace?.id
            ? t(
                PurchaseConfirmationTexts.validityTexts.zone.single(
                  fromPlaceName,
                ),
              )
            : t(
                PurchaseConfirmationTexts.validityTexts.zone.multiple(
                  fromPlaceName,
                  toPlaceName,
                ),
              ),
        );
    }
  };

  return (
    <Section>
      <GenericSectionItem>
        <View style={styles.ticketInfoContainer}>
          <View style={styles.headerRow}>
            <ThemeText>
              {getReferenceDataName(preassignedFareProduct, language)}
            </ThemeText>
            {onEdit && (
              <NativeBlockButton
                onPress={onEdit}
                style={styles.editButton}
                accessibilityRole="button"
                accessibilityLabel={t(dictionary.edit)}
              >
                <ThemeText color={theme.color.foreground.emphasis.interactive}>
                  {t(dictionary.edit)}
                </ThemeText>
                <ThemeIcon
                  svg={SvgEdit}
                  color={theme.color.foreground.emphasis.interactive}
                />
              </NativeBlockButton>
            )}
          </View>
          <View accessible={true}>
            {recipient && (
              <ThemeText
                typography="body__s"
                type="secondary"
                style={styles.sendingToText}
                testID="onBehalfOfText"
              >
                {t(
                  PurchaseConfirmationTexts.sendingTo(
                    recipient.name || formatPhoneNumber(recipient.phoneNumber),
                  ),
                )}
              </ThemeText>
            )}
            {fareProductTypeConfig.direction &&
              summary(
                t(
                  PurchaseConfirmationTexts.validityTexts.direction[
                    fareProductTypeConfig.direction
                  ](fromPlaceName, toPlaceName),
                ),
              )}
            <SummaryText />
            {!!validDurationSeconds &&
              isShowValidTimeInfoEnabled &&
              summary(
                t(
                  PurchaseConfirmationTexts.validityTexts.time(
                    secondsToDuration(validDurationSeconds, language),
                  ),
                ),
              )}
            <GlobalMessage
              style={styles.globalMessage}
              globalMessageContext={
                GlobalMessageContextEnum.appPurchaseConfirmation
              }
              textColor="secondary"
              ruleVariables={{
                preassignedFareProductType: preassignedFareProduct.type,
              }}
            />
            {!fareProductTypeConfig.isCollectionOfAccesses && (
              <MessageInfoText
                style={styles.smallTopMargin}
                type="info"
                message={travelDateText}
                textColor="secondary"
              />
            )}
          </View>
        </View>
      </GenericSectionItem>
      {!!legs?.length && (
        <GenericSectionItem>
          <BookingSummary
            segments={legs.map(legToBookingJourneySegment)}
            compact={false}
          />
        </GenericSectionItem>
      )}
    </Section>
  );
};

function getPlaceName(place: FareZone | StopPlaceFragment, language: Language) {
  return 'geometry' in place
    ? getReferenceDataName(place, language)
    : place.name;
}

function legToBookingJourneySegment(leg: Leg): BookingJourneySegment {
  return {
    mode: leg.mode,
    transportSubmode: leg.transportSubmode,
    line: leg.line
      ? {publicCode: leg.line.publicCode, name: leg.line.name}
      : undefined,
    expectedStartTime: leg.expectedStartTime,
    expectedEndTime: leg.expectedEndTime,
    fromStopName: leg.fromPlace.quay?.stopPlace?.name,
    toStopName: leg.toPlace.quay?.stopPlace?.name,
    situations: findAllSituationsFromLeg(leg),
    notices: findAllNoticesFromLeg(leg),
  };
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  sendingToText: {
    marginTop: theme.spacing.xSmall,
  },
  ticketInfoContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flexDirection: 'row',
    gap: theme.spacing.small,
  },
  globalMessage: {
    marginTop: theme.spacing.small,
  },
  smallTopMargin: {
    marginTop: theme.spacing.xSmall,
  },
  mediumTopMargin: {
    marginTop: theme.spacing.medium,
  },
  sectionItemSpacing: {
    marginRight: theme.spacing.medium,
  },
  centered: {
    alignSelf: 'center',
  },
}));
