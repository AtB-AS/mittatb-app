import React from 'react';
import {FareContractType} from '@atb-as/utils';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {useTimeContext} from '@atb/modules/time';
import {useAuthContext} from '@atb/modules/auth';
import {formatToLongDateTime} from '@atb/utils/date';
import {toDate} from 'date-fns';
import {getFareContractInfo} from '../utils';
import {useMobileTokenContext} from '@atb/modules/mobile-token';
import {useGetOperatorsQuery} from '@atb/modules/mobility';
import {getOperatorNameById} from '@atb/api/utils';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';

type Props = {
  fareContract: FareContractType;
};

export const FareContractShmoHeaderSectionItem = ({
  fareContract: fc,
  ...props
}: SectionItemProps<Props>) => {
  const {topContainer} = useSectionItem(props);
  const styles = useStyles();

  const {t, language} = useTranslation();
  const {serverNow} = useTimeContext();
  const {abtCustomerId: currentUserId} = useAuthContext();
  const {isInspectable} = useMobileTokenContext();
  const {theme} = useThemeContext();

  const {validTo} = getFareContractInfo(serverNow, fc, currentUserId);
  const dateTime = formatToLongDateTime(toDate(validTo), language);
  const label = t(FareContractTexts.shmoDetails.tripEnded(dateTime));
  const {data: operatorsData} = useGetOperatorsQuery();
  const operatorName = getOperatorNameById(operatorsData, fc?.operatorId);

  return (
    <View style={[topContainer, styles.container]}>
      {!!operatorName && !!fc.formFactor && (
        <ThemeText
          typography="body__s__strong"
          accessibilityLabel={fc?.formFactor + operatorName}
          color={theme.color.foreground.dynamic.secondary}
          style={styles.headerText}
        >
          {t(MobilityTexts.fareContractHeader(fc.formFactor, operatorName))}
        </ThemeText>
      )}

      <ThemeText
        style={styles.validityText}
        typography="heading__l"
        accessibilityLabel={
          !isInspectable
            ? label +
              ', ' +
              t(FareContractTexts.fareContractInfo.noInspectionIconA11yLabel)
            : undefined
        }
      >
        {label}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: theme.spacing.small,
  },
  validityText: {
    textAlign: 'center',
  },
  headerText: {
    textAlign: 'left',
  },
}));
