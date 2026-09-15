import {type Leg} from '@atb/api/types/trips';
import {InterchangeFragment} from '@atb/api/types/generated/fragments/interchanges';
import {
  Language,
  type TranslateFunction,
  TripDetailsTexts,
  useTranslation,
} from '@atb/translations';
import {secondsToDuration} from '@atb/utils/date';
import {StyleSheet} from '@atb/theme';
import {View} from 'react-native';
import {TripIconRow} from './TripIconRow';
import {Connection, StaySeated} from '@atb/assets/svg/mono-icons/miscellaneous';
import {ThemeText} from '@atb/components/text';

export const InterchangeSection = ({leg}: {leg: Leg}) => {
  const {t, language} = useTranslation();
  const style = useStyles();

  const interchange = leg.interchangeFrom;

  if (!interchange?.guaranteed) return null;

  const isStaySeated = !!interchange.staySeated;
  const interchangeTexts = getInterchangeTexts(interchange, t, language);

  return (
    <View style={style.container}>
      <TripIconRow
        boxed={isStaySeated}
        svg={isStaySeated ? StaySeated : Connection}
        accessibilityLabel={`${interchangeTexts.title}. ${interchangeTexts.body}`}
        accessible={true}
      >
        <ThemeText typography="body__m">{interchangeTexts.title}</ThemeText>
        <ThemeText typography="body__s" type="secondary">
          {interchangeTexts.body}
        </ThemeText>
      </TripIconRow>
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
}));
