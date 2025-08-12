import {GenericSectionItem} from '@atb/components/sections';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {PurchaseConfirmationTexts, useTranslation} from '@atb/translations';
import {AnyMode, TransportationIconBox} from '@atb/components/icon-box';
import {formatLocaleTime} from '@atb/utils/date';
import SharedTexts from '@atb/translations/shared';
import React from 'react';
import type {SalesTripPatternLeg} from '@atb/api/types/sales';
import {StyleSheet} from '@atb/theme';

export function JourneyLegsSummary({legs}: {legs?: SalesTripPatternLeg[]}) {
  console.log('Legs in JourneyLegsSummary:', legs);
  const styles = useStyles();
  const {t, language} = useTranslation();
  if (!legs || legs.length === 0) return null;

  return (
    <GenericSectionItem radius="bottom">
      <View style={styles.legSection}>
        <ThemeText typography="body__primary" color="secondary">
          {t(PurchaseConfirmationTexts.confirmations.onlyValidDeparture)}
        </ThemeText>
        {legs.map(
          (
            {
              fromStopPlaceName,
              toStopPlaceName,
              expectedStartTime,
              expectedEndTime,
              lineNumber,
              lineName,
              mode,
              subMode,
            },
            i,
          ) => (
            <View
              accessible={true}
              style={styles.legSection}
              id={lineNumber}
              key={`leg-${i}`}
            >
              <View style={[styles.legSectionItem, styles.mediumTopMargin]}>
                <TransportationIconBox
                  style={[styles.sectionItemSpacing, styles.centered]}
                  type="standard"
                  mode={mode as AnyMode}
                  subMode={subMode}
                  lineNumber={lineNumber}
                />
                <ThemeText
                  typography="body__primary"
                  style={[styles.legName, styles.centered]}
                >
                  {lineName}
                </ThemeText>
                <ThemeText
                  typography="body__primary--bold"
                  style={[styles.legSectionItemTime, styles.centered]}
                >
                  {expectedStartTime &&
                    formatLocaleTime(expectedStartTime, language)}
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
                  <ThemeText
                    typography="body__secondary"
                    color="secondary"
                    style={styles.legName}
                  >
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
                  <ThemeText
                    typography="body__secondary"
                    color="secondary"
                    style={styles.legName}
                  >
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
      </View>
    </GenericSectionItem>
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
