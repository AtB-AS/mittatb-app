import {ParkingViolationType} from '@atb/api/types/mobility';
import {MessageBox} from '@atb/components/message-box';
import {StyleSheet, useTheme} from '@atb/theme';
import {isDefined} from '@atb/utils/presence';
import {useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useParkingViolationsState} from './ParkingViolationsContext';
import {themeColor} from './Root_ParkingViolationsReportingStack';
import {ScreenContainer} from './ScreenContainer';
import {ParkingViolationsScreenProps} from './navigation-types';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useTranslation} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import {Button} from '@atb/components/button';

export type SelectViolationScreenProps =
  ParkingViolationsScreenProps<'ParkingViolations_SelectViolation'>;

const ICON_SIZE = 100;

export const ParkingViolations_SelectViolation = ({
  navigation,
}: SelectViolationScreenProps) => {
  const style = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {isLoading, error, violations} = useParkingViolationsState();
  const [selectedViolations, setSelectedViolations] = useState<number[]>([]);

  const groupedViolations = violations.reduce<
    [ParkingViolationType, ParkingViolationType | undefined][]
  >((grouped, current, index, arr) => {
    if (index % 2 === 0) return [...grouped, [current, arr[index + 1]]];
    return grouped;
  }, []);

  const handleViolationSelect = (id: number) => {
    setSelectedViolations((current) =>
      current.includes(id)
        ? current.filter((it) => it !== id)
        : [...current, id],
    );
  };

  const isViolationSelected = (id: number) => selectedViolations.includes(id);

  return (
    <ScreenContainer
      title={t(ParkingViolationTexts.selectViolation.title)}
      buttons={
        <Button
          interactiveColor="interactive_0"
          onPress={() => navigation.navigate('ParkingViolations_Photo')}
          text={t(ParkingViolationTexts.selectViolation.nextButton)}
          testID="nextButton"
          accessibilityHint={''} //TODO
        />
      }
    >
      {isLoading && !error && (
        <ActivityIndicator
          color={theme.text.colors.primary}
          style={style.indicator}
        />
      )}
      {error && (
        <MessageBox
          message={t(ParkingViolationTexts.loadingError)}
          type={'error'}
        />
      )}
      {!isLoading &&
        !error &&
        groupedViolations.map((violationGroup) => (
          <View style={style.violations}>
            {violationGroup.filter(isDefined).map((violation) => (
              <View style={style.violation} key={violation.id}>
                <TouchableOpacity
                  onPress={() => handleViolationSelect(violation.id)}
                  style={{
                    ...style.violationImage,
                    borderColor: isViolationSelected(violation.id)
                      ? theme.static.status['valid'].background
                      : theme.static.background[themeColor].background,
                  }}
                >
                  <SvgXml
                    height={ICON_SIZE}
                    width={ICON_SIZE}
                    xml={violation.icon}
                  />
                </TouchableOpacity>
                <ThemeText color={themeColor} style={{textAlign: 'center'}}>
                  {t(
                    ParkingViolationTexts.selectViolation.violationDescription(
                      violation.code,
                    ),
                  )}
                </ThemeText>
              </View>
            ))}
          </View>
        ))}
    </ScreenContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  indicator: {alignSelf: 'center'},
  violations: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: theme.spacings.medium,
  },
  violation: {
    flexDirection: 'column',
    maxWidth: '40%',
    alignItems: 'center',
  },
  violationImage: {
    borderRadius: ICON_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 2,
  },
}));
