import React from 'react';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {calculateCarnetDisplayData} from './calculate-carnet-display-data';
import {useSchoolCarnetInfoQuery} from '@atb/modules/ticketing';
import {FareContractType, getAccesses} from '@atb-as/utils';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {formatToClock, formatToDateWithDayOfWeek} from '@atb/utils/date';
import {ValidityStatus} from '../utils';

type Props = {
  validityStatus: ValidityStatus;
  fareContract: FareContractType;
};

export const CarnetFooter: React.FC<Props> = ({
  validityStatus,
  fareContract,
}) => {
  const styles = useStyles();
  const {t, language} = useTranslation();

  const {
    data: schoolCarnetInfo,
    isError: isSchoolCarnetInfoError,
    isFetching: isSchoolCarnetInfoFetching,
  } = useSchoolCarnetInfoQuery(fareContract, validityStatus);

  const accessInfo = getAccesses(fareContract);
  if (!accessInfo) return null;

  const {accessesRemaining, multiCarnetArray, unusedArray, usedArray} =
    calculateCarnetDisplayData(
      validityStatus === 'valid',
      accessInfo.maximumNumberOfAccesses,
      accessInfo.numberOfUsedAccesses,
      schoolCarnetInfo,
    );

  if (isSchoolCarnetInfoFetching) return <View />;
  if (isSchoolCarnetInfoError)
    return (
      <MessageInfoBox
        type="error"
        message={t(FareContractTexts.carnet.consumableInformationError)}
      />
    );

  return (
    <View style={styles.container}>
      <View
        accessible={true}
        accessibilityLabel={t(
          FareContractTexts.carnet.numberOfUsedAccessesRemaining(
            accessesRemaining,
          ),
        )}
      >
        <ThemeText typography="body__s">
          {t(
            FareContractTexts.carnet.numberOfUsedAccessesRemaining(
              accessesRemaining,
            ),
          )}
        </ThemeText>
      </View>
      <View style={styles.dotContainer}>
        {multiCarnetArray.map((count, idx) => (
          <MultiCarnet key={idx} count={count} />
        ))}
        {unusedArray.map((_, idx) => (
          <View key={idx} style={styles.dot} />
        ))}
        {validityStatus === 'valid' && (
          <View style={styles.dot}>
            <View style={styles.dotFill__activeViewBox}>
              <View style={styles.dotFill__activeFill} />
            </View>
          </View>
        )}
        {usedArray.map((_, idx) => (
          <View key={idx} style={[styles.dot, styles.dot__unused]} />
        ))}
      </View>
      {schoolCarnetInfo?.nextConsumableDateTime &&
        validityStatus !== 'valid' && (
          <MessageInfoBox
            type="info"
            message={t(
              FareContractTexts.carnet.nextConsumptionDayMessage(
                formatToDateWithDayOfWeek(
                  schoolCarnetInfo.nextConsumableDateTime,
                  language,
                ),
                formatToClock(
                  schoolCarnetInfo.nextConsumableDateTime,
                  language,
                  'trunc',
                  false,
                ),
              ),
            )}
          />
        )}
    </View>
  );
};

function MultiCarnet({count}: {count: number}) {
  const styles = useStyles();
  return (
    <View>
      <View style={[styles.dot, {marginRight: 8}]} />
      <View
        style={[styles.dot, {opacity: 0.8, position: 'absolute', left: 8}]}
      />
      <View style={styles.box}>
        <View style={styles.triangle} />
      </View>
      <View style={styles.count}>
        <ThemeText typography="body__xs">{count}</ThemeText>
      </View>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'column',
    flex: 1,
    gap: theme.spacing.medium,
  },
  dotContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: theme.spacing.large,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.color.background.neutral[1].background,
  },
  box: {
    alignItems: 'center',
    marginTop: theme.spacing.small,
    flex: 1,
  },
  count: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xSmall,
    borderRadius: 3,
    backgroundColor: theme.color.background.neutral[1].background,
  },
  dot: {
    backgroundColor: theme.color.foreground.dynamic.secondary,
    borderRadius: 20,
    borderColor: theme.color.foreground.dynamic.secondary,
    borderWidth: 2,
    width: 16,
    height: 16,
  },
  dot__unused: {
    backgroundColor: 'transparent',
  },
  dotFill__activeViewBox: {
    height: '100%',
    width: '50%',
    overflow: 'hidden',
    alignSelf: 'flex-end',
  },
  dotFill__activeFill: {
    borderRadius: 20,
    height: '100%',
    width: '200%',
    alignSelf: 'flex-end',
    backgroundColor: theme.color.background.neutral[0].background,
  },
}));
