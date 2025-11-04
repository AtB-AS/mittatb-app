import {View} from 'react-native';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {
  dictionary,
  getTextForLanguage,
  PurchaseConfirmationTexts,
  type TranslateFunction,
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
import type {SituationFragment} from '@atb/api/types/generated/fragments/situations';
import {isDefined} from '@atb/utils/presence';
import type {NoticeFragment} from '@atb/api/types/generated/fragments/notices';

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
        <ThemeText typography="body__m" color="secondary">
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
              typography="body__m"
              style={[styles.legName, styles.centered]}
            >
              {leg.line?.name}
            </ThemeText>
            <ThemeText
              typography="body__m__strong"
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
                  typography="body__s"
                  color="secondary"
                  style={styles.legLabel}
                >
                  {t(SharedTexts.from)}:
                </ThemeText>
                <ThemeText
                  typography="body__s"
                  color="secondary"
                  style={styles.legName}
                >
                  {leg.fromPlace.quay?.stopPlace?.name}
                </ThemeText>
                <ThemeText
                  typography="body__s"
                  color="secondary"
                  style={styles.legSectionItemTime}
                >
                  {!!leg.expectedStartTime &&
                    formatLocaleTime(leg.expectedStartTime, language)}
                </ThemeText>
              </View>
              <View style={styles.legSectionItem}>
                <ThemeText
                  typography="body__s"
                  color="secondary"
                  style={styles.legLabel}
                >
                  {t(SharedTexts.to)}:
                </ThemeText>
                <ThemeText
                  typography="body__s"
                  color="secondary"
                  style={styles.legName}
                >
                  {leg.toPlace.quay?.stopPlace?.name}
                </ThemeText>
                <ThemeText
                  typography="body__s"
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
              a11yLabel={getA11yLabelForSituation(situation, t)}
            />
          ))}
          {notices.map((notice) => (
            <MessageInfoText
              type="info"
              message={notice.text ?? ''}
              key={notice.id}
              a11yLabel={getA11yLabelForNotice(notice, t)}
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

function getA11yLabelForSituation(
  situation: SituationFragment,
  t: TranslateFunction,
) {
  const messageType = getMessageTypeForSituation(situation);
  const criticalityPrefix = t(dictionary.messageTypes[messageType]);
  return [
    criticalityPrefix,
    situation.summary,
    situation.description,
    situation.advice,
  ]
    .filter(isDefined)
    .join(screenReaderPause);
}

function getA11yLabelForNotice(notice: NoticeFragment, t: TranslateFunction) {
  return [t(dictionary.messageTypes.info), notice.text]
    .filter(isDefined)
    .join(screenReaderPause);
}
