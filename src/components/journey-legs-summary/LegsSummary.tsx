import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {
  getTextForLanguage,
  PurchaseConfirmationTexts,
  useTranslation,
} from '@atb/translations';
import {AnyMode, TransportationIconBox} from '@atb/components/icon-box';
import {formatLocaleTime} from '@atb/utils/date';
import SharedTexts from '@atb/translations/shared';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import type {Leg} from '@atb/api/types/trips';
import {MessageInfoText} from '@atb/components/message-info-text';
import {
  findAllNoticesFromLeg,
  findAllSituationsFromLeg,
  getMessageTypeForSituation,
} from '@atb/modules/situations';

export function LegsSummary({
  legs,
  compact = false,
}: {
  legs?: Leg[];
  compact: boolean;
}) {
  const styles = useStyles();
  const {t, language} = useTranslation();
  if (!legs || legs.length === 0) return null;
  const legsAndMessages = legs.map((leg) => ({
    leg,
    situations: findAllSituationsFromLeg(leg),
    notices: findAllNoticesFromLeg(leg),
  }));

  return (
    <View style={styles.legSection}>
      {!compact && (
        <ThemeText typography="body__primary" color="secondary">
          {t(PurchaseConfirmationTexts.confirmations.onlyValidDeparture)}
        </ThemeText>
      )}
      {legsAndMessages.map(({leg, situations, notices}, i) => (
        <View
          accessible={true}
          style={styles.legSection}
          id={leg.line?.publicCode}
          key={`leg-${i}`}
        >
          <View style={styles.legSectionItem}>
            <TransportationIconBox
              style={[styles.sectionItemSpacing, styles.centered]}
              type="standard"
              mode={leg.mode as AnyMode}
              subMode={leg.transportSubmode}
              lineNumber={leg.line?.publicCode}
            />
            <ThemeText
              typography="body__primary"
              style={[styles.legName, styles.centered]}
            >
              {leg.line?.name}
            </ThemeText>
            <ThemeText
              typography="body__primary--bold"
              style={[styles.legSectionItemTime, styles.centered]}
            >
              {!!leg.expectedStartTime &&
                formatLocaleTime(leg.expectedStartTime, language)}
            </ThemeText>
          </View>
          {!compact && (
            <View>
              <View style={styles.legSectionItem}>
                <ThemeText
                  typography="body__secondary"
                  color="secondary"
                  style={styles.legLabel}
                >
                  {t(SharedTexts.from)}:
                </ThemeText>
                <ThemeText
                  typography="body__secondary"
                  color="secondary"
                  style={styles.legName}
                >
                  {leg.fromPlace.quay?.stopPlace?.name}
                </ThemeText>
                <ThemeText
                  typography="body__secondary"
                  color="secondary"
                  style={styles.legSectionItemTime}
                >
                  {!!leg.expectedStartTime &&
                    formatLocaleTime(leg.expectedStartTime, language)}
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
                <ThemeText
                  typography="body__secondary"
                  color="secondary"
                  style={styles.legName}
                >
                  {leg.toPlace.quay?.stopPlace?.name}
                </ThemeText>
                <ThemeText
                  typography="body__secondary"
                  color="secondary"
                  style={styles.legSectionItemTime}
                >
                  {!!leg.expectedEndTime &&
                    formatLocaleTime(leg.expectedEndTime, language)}
                </ThemeText>
              </View>
            </View>
          )}
          {situations.map((situation) => (
            <MessageInfoText
              type={getMessageTypeForSituation(situation)}
              message={
                getTextForLanguage(situation.description, language) ?? ''
              }
            />
          ))}
          {notices.map((notice) => (
            <MessageInfoText
              type="info"
              message={notice.text ?? ''}
              key={notice.id}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
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
  legSection: {
    flexGrow: 1,
    gap: theme.spacing.medium,
  },
  legSectionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexGrow: 1,
  },
  legSectionItemTime: {
    textAlign: 'right',
    alignSelf: 'flex-start',
    marginLeft: theme.spacing.xSmall,
  },

  legLabel: {
    marginRight: theme.spacing.xSmall,
    minWidth: 40,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  legName: {
    flex: 1,
    marginRight: theme.spacing.xSmall,
    flexWrap: 'wrap',
  },
}));
