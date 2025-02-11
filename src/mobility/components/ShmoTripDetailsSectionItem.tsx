import {useTranslation} from '@atb/translations';
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
      {withHeader && (
        <View style={styles.heading}>
          <ThemeText typography="body__secondary" color="secondary">
            {t(MobilityTexts.time)}
          </ThemeText>
          <ThemeText typography="body__secondary" color="secondary">
            {t(MobilityTexts.totalCost)}
          </ThemeText>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.timeWrapper}>
          <ThemeIcon svg={Duration} color="primary" size="large" />
          <ThemeText typography="body__primary--big">{timeUsed}</ThemeText>
        </View>
        <ThemeText typography="body__primary--big">{totalAmount} kr</ThemeText>
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.medium,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
}));
