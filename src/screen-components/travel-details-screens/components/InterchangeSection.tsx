import {type Leg} from '@atb/api/types/trips';
import {InterchangeFragment} from '@atb/api/types/generated/fragments/interchanges';
import {
  Language,
  type TranslateFunction,
  TripDetailsTexts,
  useTranslation,
} from '@atb/translations';
import {secondsToDuration} from '@atb/utils/date';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {View} from 'react-native';
import {DimensionOverrides, NEW_TRIP_DIMENSIONS, TripRow} from './TripRow';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Connection, StaySeated} from '@atb/assets/svg/mono-icons/miscellaneous';
import {ThemeText} from '@atb/components/text';

/** The x that `TripLegDecoration` centres the leg line on. */
const DECORATION_AXIS =
  (NEW_TRIP_DIMENSIONS.labelWidth ?? 0) +
  (NEW_TRIP_DIMENSIONS.decorationContainerWidth ?? 0) / 2;

export const InterchangeSection = ({leg}: {leg: Leg}) => {
  const {t, language} = useTranslation();
  const style = useStyles();
  const {theme} = useThemeContext();

  const interchange = leg.interchangeFrom;

  if (!interchange?.guaranteed) return null;

  const interchangeTexts = getInterchangeTexts(interchange, t, language);

  const iconWidth = interchange.staySeated
    ? theme.icon.size.small + theme.spacing.small * 2
    : theme.icon.size.large;

  // This row draws no leg decoration, so the icon stands in for the line:
  // centre it on the decoration axis, then spacing.small across to the text.
  const dimensionOverrides: DimensionOverrides = {
    ...NEW_TRIP_DIMENSIONS,
    labelWidth: DECORATION_AXIS - iconWidth / 2,
    decorationContainerWidth: 0,
  };

  return (
    <View style={style.container}>
      <TripRow
        dimensionOverrides={dimensionOverrides}
        accessibilityLabel={`${interchangeTexts.title}. ${interchangeTexts.body}`}
        accessible={true}
      >
        <View style={style.row}>
          {interchange.staySeated ? (
            <View style={style.iconBox}>
              <ThemeIcon size="small" svg={StaySeated} />
            </View>
          ) : (
            <ThemeIcon size="large" svg={Connection} />
          )}
          <View style={style.message}>
            <ThemeText typography="body__m">{interchangeTexts.title}</ThemeText>
            <ThemeText typography="body__s" type="secondary">
              {interchangeTexts.body}
            </ThemeText>
          </View>
        </View>
      </TripRow>
    </View>
  );
};

const getInterchangeTexts = (
  interchange: InterchangeFragment,
  t: TranslateFunction,
  language: Language,
): {title: string; body: string} => {
  const maxWaitTime =
    interchange.maximumWaitTime && interchange.maximumWaitTime > 0
      ? secondsToDuration(interchange.maximumWaitTime, language)
      : undefined;

  const fromPublicCode = getPublicCode(interchange.fromServiceJourney);
  const toPublicCode = getPublicCode(interchange.toServiceJourney);

  if (interchange.staySeated) {
    return {
      title: t(TripDetailsTexts.messages.staySeatedMainText),
      body: t(
        TripDetailsTexts.messages.staySeatedSubText(
          fromPublicCode,
          toPublicCode,
        ),
      ),
    };
  }

  return {
    title: t(TripDetailsTexts.messages.interchangeMainText),
    body: t(TripDetailsTexts.messages.interchangeSubText(maxWaitTime)),
  };
};

const getPublicCode = (
  serviceJourney: InterchangeFragment['fromServiceJourney'],
) => serviceJourney?.publicCode ?? serviceJourney?.line.publicCode;

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginBottom: theme.spacing.large, // Note: Should rather gap on parent
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
  message: {
    flex: 1,
  },
  iconBox: {
    padding: theme.spacing.small,
    borderRadius: theme.border.radius.regular,
    backgroundColor: theme.color.transport.walk.primary.background,
  },
}));
