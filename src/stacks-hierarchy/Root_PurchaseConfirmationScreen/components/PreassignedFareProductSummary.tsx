import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {MessageInfoText} from '@atb/components/message-info-text';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {
  FareProductTypeConfig,
  PreassignedFareProduct,
  FareZone,
  getReferenceDataName,
} from '@atb/modules/configuration';
import {
  GlobalMessage,
  GlobalMessageContextEnum,
} from '@atb/modules/global-messages';
import {StyleSheet} from '@atb/theme';
import {
  Language,
  PurchaseConfirmationTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {formatToLongDateTime, secondsToDuration} from '@atb/utils/date';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils';
import React from 'react';
import {View} from 'react-native';
import {TicketRecipientType} from '@atb/modules/ticketing';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {LegsSummary} from '@atb/components/journey-legs-summary';
import type {Leg} from '@atb/api/types/trips';

type Props = {
  preassignedFareProduct: PreassignedFareProduct;
  fareProductTypeConfig: FareProductTypeConfig;
  recipient?: TicketRecipientType;
  isSearchingOffer: boolean;
  fromPlace: FareZone | StopPlaceFragment | undefined;
  toPlace: FareZone | StopPlaceFragment | undefined;
  validDurationSeconds?: number;
  travelDate?: string;
  legs?: Leg[];
};

export const PreassignedFareContractSummary = ({
  preassignedFareProduct,
  fareProductTypeConfig,
  recipient,
  isSearchingOffer,
  fromPlace,
  toPlace,
  validDurationSeconds,
  travelDate,
  legs,
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

  function summary(text?: string) {
    if (!text) return null;
    return (
      <ThemeText
        style={styles.smallTopMargin}
        typography="body__s"
        color="secondary"
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
        <View accessible={true} style={styles.ticketInfoContainer}>
          <ThemeText>
            {getReferenceDataName(preassignedFareProduct, language)}
          </ThemeText>
          {recipient && (
            <ThemeText
              typography="body__s"
              color="secondary"
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
          {!isSearchingOffer &&
            !!validDurationSeconds &&
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
      </GenericSectionItem>
      {!!legs?.length && (
        <GenericSectionItem>
          <LegsSummary legs={legs} compact={false} />
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

const useStyles = StyleSheet.createThemeHook((theme) => ({
  sendingToText: {
    marginTop: theme.spacing.xSmall,
  },
  ticketInfoContainer: {
    flex: 1,
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
