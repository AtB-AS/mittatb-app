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
import {
  formatLocaleTime,
  formatToLongDateTime,
  secondsToDuration,
} from '@atb/utils/date';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils';
import React from 'react';
import {View} from 'react-native';
import {TicketRecipientType} from '@atb/modules/ticketing';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {AnyMode, TransportationIconBox} from '@atb/components/icon-box';
import {SalesTripPatternLeg} from '@atb/api/types/sales';
import SharedTexts from '@atb/translations/shared';

type Props = {
  preassignedFareProduct: PreassignedFareProduct;
  fareProductTypeConfig: FareProductTypeConfig;
  recipient?: TicketRecipientType;
  isSearchingOffer: boolean;
  fromPlace: FareZone | StopPlaceFragment | undefined;
  toPlace: FareZone | StopPlaceFragment | undefined;
  validDurationSeconds?: number;
  travelDate?: string;
  legs?: SalesTripPatternLeg[];
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
        typography="body__secondary"
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

  const LegSection = () => {
    if (!legs || legs.length === 0) return null;

    return (
      <GenericSectionItem>
        <ThemeText typography="body__primary" color="secondary">
          {t(PurchaseConfirmationTexts.confirmations.onlyValidDeparture)}
        </ThemeText>
        {legs.map(
          ({
            fromStopPlaceName,
            toStopPlaceName,
            expectedStartTime,
            expectedEndTime,
            lineNumber,
            mode,
            subMode,
          }) => (
            <View accessible={true} style={styles.legSection}>
              <View style={[styles.legSectionItem, styles.mediumTopMargin]}>
                <TransportationIconBox
                  style={styles.sectionItemSpacing}
                  type="standard"
                  mode={mode as AnyMode}
                  subMode={subMode}
                  lineNumber={lineNumber}
                />
                <ThemeText typography="body__primary">
                  {fromPlaceName}
                </ThemeText>
                <ThemeText
                  typography="body__primary--bold"
                  style={styles.legSectionItemTime}
                >
                  {travelDate && formatLocaleTime(travelDate, language)}
                </ThemeText>
              </View>
              <View style={styles.mediumTopMargin}>
                <View style={styles.legSectionItem}>
                  <ThemeText
                    typography="body__secondary"
                    color="secondary"
                    style={styles.legLabel}
                  >
                    {t(SharedTexts.from)}:
                  </ThemeText>
                  <ThemeText typography="body__secondary" color="secondary">
                    {fromStopPlaceName}
                  </ThemeText>
                  <ThemeText
                    typography="body__secondary"
                    color="secondary"
                    style={styles.legSectionItemTime}
                  >
                    {expectedStartTime &&
                      formatLocaleTime(expectedStartTime, language)}
                  </ThemeText>
                </View>
                <View style={styles.legSectionItem}>
                  <ThemeText
                    typography="body__secondary"
                    color="secondary"
                    style={styles.legLabel}
                  >
                    {t(SharedTexts.to)}:
                  </ThemeText>
                  <ThemeText typography="body__secondary" color="secondary">
                    {toStopPlaceName}
                  </ThemeText>
                  <ThemeText
                    typography="body__secondary"
                    color="secondary"
                    style={styles.legSectionItemTime}
                  >
                    {expectedEndTime &&
                      formatLocaleTime(expectedEndTime, language)}
                  </ThemeText>
                </View>
              </View>
            </View>
          ),
        )}
      </GenericSectionItem>
    );
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
              typography="body__secondary"
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
      <LegSection />
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
  legSection: {
    flexGrow: 1,
  },
  sectionItemSpacing: {
    marginRight: theme.spacing.medium,
  },
  legLabel: {
    minWidth: 30,
    marginRight: theme.spacing.xSmall,
  },
  legSectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
  },
  legSectionItemTime: {
    textAlign: 'right',
    flexGrow: 1,
  },
}));
