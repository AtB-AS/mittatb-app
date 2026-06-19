import {type Leg} from '@atb/api/types/trips';
import {InterchangeFragment} from '@atb/api/types/generated/fragments/interchanges';
import {
  Language,
  type TranslateFunction,
  TripDetailsTexts,
  useTranslation,
} from '@atb/translations';
import {secondsToDuration} from '@atb/utils/date';
import {useTransportColor} from '@atb/utils/use-transport-color';
import {StyleSheet} from '@atb/theme';
import {View} from 'react-native';
import {TripLegDecoration} from './TripLegDecoration';
import {NEW_TRIP_DIMENSIONS, TripRow} from './TripRow';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Connection, StaySeated} from '@atb/assets/svg/mono-icons/miscellaneous';
import {ThemeText} from '@atb/components/text';

export const InterchangeSection = ({leg}: {leg: Leg}) => {
  const {t, language} = useTranslation();
  const style = useStyles();
  const legColor = useTransportColor().secondary;

  const interchange = leg.interchangeFrom;

  if (!interchange?.guaranteed) return null;

  const interchangeTexts = getInterchangeTexts(interchange, t, language);

  return (
    <View style={style.container}>
      <TripLegDecoration
        dimensionOverrides={NEW_TRIP_DIMENSIONS}
        color={legColor.background}
        hasStart={false}
        hasEnd={false}
      />
      <TripRow
        dimensionOverrides={NEW_TRIP_DIMENSIONS}
        accessibilityLabel={`${interchangeTexts.title}. ${interchangeTexts.body}`}
        accessible={true}
      >
        <View style={style.interchangeInfo}>
          <ThemeIcon
            size="normal"
            svg={interchange.staySeated ? StaySeated : Connection}
          />
          <View style={style.interchangeText}>
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
  interchangeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
  interchangeText: {flex: 1},
}));
