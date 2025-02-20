import {dictionary, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {Duration} from '@atb/assets/svg/mono-icons/mobility';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {getTimeBetweenFormatted} from '@atb/utils/date';

type Props = {
  startDateTime: Date;
  endDateTime: Date;
  totalAmount: string;
  withHeader: boolean;
};

export const ShmoTripDetailsSectionItem = ({
  startDateTime,
  endDateTime,
  totalAmount,
  withHeader,
  ...props
}: SectionItemProps<Props>) => {
  const {t} = useTranslation();

  const styles = useStyles();
  const {topContainer} = useSectionItem(props);

  const timeUsed = getTimeBetweenFormatted(startDateTime, endDateTime);
  return (
    <View style={[topContainer, styles.container]}>
      <View
        style={styles.leftSection}
        accessible={true}
        accessibilityLabel={`${t(MobilityTexts.time)} ${timeUsed} ${t(
          dictionary.date.units.long.minute,
        )}`}
      >
        {withHeader && (
          <ThemeText
            typography="body__secondary"
            color="secondary"
            accessibilityRole="header"
          >
            {t(MobilityTexts.time)}
          </ThemeText>
        )}
        <View style={styles.timeWrapper}>
          <ThemeIcon svg={Duration} color="primary" size="large" />
          <ThemeText typography="body__primary--big">{timeUsed}</ThemeText>
        </View>
      </View>

      <View
        style={styles.rightSection}
        accessible={true}
        accessibilityLabel={`${t(MobilityTexts.totalCost)} ${totalAmount} ${t(
          dictionary.currency.nok.a11yLabel,
        )}`}
      >
        {withHeader && (
          <ThemeText
            typography="body__secondary"
            color="secondary"
            accessibilityRole="header"
          >
            {t(MobilityTexts.totalCost)}
          </ThemeText>
        )}
        <ThemeText typography="body__primary--big">
          {totalAmount} {t(dictionary.currency.nok.label)}
        </ThemeText>
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'column',
    gap: theme.spacing.medium,
  },
  rightSection: {
    flexDirection: 'column',
    gap: theme.spacing.medium,
    alignItems: 'flex-end',
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
}));
