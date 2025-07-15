import React from 'react';
import {FareContractType} from '@atb-as/utils';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ProductName} from '../components/ProductName';
import {ThemeText} from '@atb/components/text';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {useTimeContext} from '@atb/modules/time';
import {formatToLongDateTime} from '@atb/utils/date';
import {toDate} from 'date-fns';
import {useMobileTokenContext} from '@atb/modules/mobile-token';
import {useFareContractInfo} from '../useFareContractInfo';

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
  const {isInspectable} = useMobileTokenContext();
  const {validTo} = useFareContractInfo({now: serverNow, fc});

  const dateTime = formatToLongDateTime(toDate(validTo), language);
  const label = t(FareContractTexts.shmoDetails.tripEnded(dateTime));

  return (
    <View style={[topContainer, styles.container]}>
      <ProductName fc={fc} />
      <ThemeText
        style={styles.validityText}
        typography="heading--medium"
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
}));
