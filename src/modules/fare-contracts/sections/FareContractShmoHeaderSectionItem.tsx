import React from 'react';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ProductName} from '../components/ProductName';
import {ThemeText} from '@atb/components/text';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {useTimeContext} from '@atb/modules/time';
import {useAuthContext} from '@atb/modules/auth';
import {formatToLongDateTime} from '@atb/utils/date';
import {toDate} from 'date-fns';
import {useMobileTokenContext} from '@atb/modules/mobile-token';
import {FareContractInfo} from '../use-fare-contract-info';

type Props = {
  fc: FareContractInfo;
};

export const FareContractShmoHeaderSectionItem = ({
  fc,
  ...props
}: SectionItemProps<Props>) => {
  const {topContainer} = useSectionItem(props);
  const styles = useStyles();

  const {t, language} = useTranslation();
  const {serverNow} = useTimeContext();
  const {abtCustomerId: currentUserId} = useAuthContext();
  const {isInspectable} = useMobileTokenContext();

  const {validTo} = fc.getValidityInfo(serverNow, currentUserId);
  const dateTime = formatToLongDateTime(toDate(validTo), language);
  const label = t(FareContractTexts.shmoDetails.tripEnded(dateTime));

  return (
    <View style={[topContainer, styles.container]}>
      <ProductName fc={fc} />
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
}));
