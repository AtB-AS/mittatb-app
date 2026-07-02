import {View} from 'react-native';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {
  dictionary,
  getTextForLanguage,
  PurchaseConfirmationTexts,
  type TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {TransportationIconBox} from '@atb/components/icon-box';
import {formatLocaleTime} from '@atb/utils/date';
import SharedTexts from '@atb/translations/shared';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {MessageInfoText} from '@atb/components/message-info-text';
import {getMessageTypeForSituation} from '@atb/modules/situations';
import type {SituationFragment} from '@atb/api/types/generated/fragments/situations';
import type {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import type {
  Mode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {isDefined} from '@atb/utils/presence';

export type BookingJourneySegment = {
  mode: Mode;
  transportSubmode?: TransportSubmode;
  line?: {publicCode?: string; name?: string};
  expectedStartTime?: string;
  expectedEndTime?: string;
  fromStopName?: string;
  toStopName?: string;
  situations: SituationFragment[];
  notices: NoticeFragment[];
};

export function BookingSummary({
  segments,
  compact = false,
}: {
  segments?: BookingJourneySegment[];
  compact: boolean;
}) {
  const styles = useStyles();
  const {t, language} = useTranslation();
  if (!segments || segments.length === 0) return null;

  return (
    <View style={styles.legSection}>
      {!compact && (
        <ThemeText typography="body__m" type="secondary">
          {t(PurchaseConfirmationTexts.confirmations.onlyValidDeparture)}
        </ThemeText>
      )}
      {segments.map((segment, i) => (
        <View
          accessible={true}
          style={styles.legSection}
          id={segment.line?.publicCode}
          key={`segment-${i}`}
        >
          <View style={styles.legSectionItem}>
            <View style={[styles.sectionItemSpacing, styles.centered]}>
              <TransportationIconBox
                mode={segment.mode}
                spacious={true}
                subMode={segment.transportSubmode}
                lineNumber={segment.line?.publicCode}
              />
            </View>
            <ThemeText
              typography="body__m"
              style={[styles.legName, styles.centered]}
            >
              {segment.line?.name}
            </ThemeText>
            <ThemeText
              typography="body__m__strong"
              style={[styles.legSectionItemTime, styles.centered]}
            >
              {!!segment.expectedStartTime &&
                formatLocaleTime(segment.expectedStartTime, language)}
            </ThemeText>
          </View>
          {!compact && (
            <View>
              <View style={styles.legSectionItem}>
                <ThemeText
                  typography="body__s"
                  type="secondary"
                  style={styles.legLabel}
                >
                  {t(SharedTexts.from)}:
                </ThemeText>
                <ThemeText
                  typography="body__s"
                  type="secondary"
                  style={styles.legName}
                >
                  {segment.fromStopName}
                </ThemeText>
                <ThemeText
                  typography="body__s"
                  type="secondary"
                  style={styles.legSectionItemTime}
                >
                  {!!segment.expectedStartTime &&
                    formatLocaleTime(segment.expectedStartTime, language)}
                </ThemeText>
              </View>
              <View style={styles.legSectionItem}>
                <ThemeText
                  typography="body__s"
                  type="secondary"
                  style={styles.legLabel}
                >
                  {t(SharedTexts.to)}:
                </ThemeText>
                <ThemeText
                  typography="body__s"
                  type="secondary"
                  style={styles.legName}
                >
                  {segment.toStopName}
                </ThemeText>
                <ThemeText
                  typography="body__s"
                  type="secondary"
                  style={styles.legSectionItemTime}
                >
                  {!!segment.expectedEndTime &&
                    formatLocaleTime(segment.expectedEndTime, language)}
                </ThemeText>
              </View>
            </View>
          )}
          {segment.situations.map((situation) => (
            <MessageInfoText
              key={situation.id}
              type={getMessageTypeForSituation(situation)}
              message={
                getTextForLanguage(situation.description, language) ?? ''
              }
              a11yLabel={getA11yLabelForSituation(situation, t)}
            />
          ))}
          {segment.notices.map((notice) => (
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
