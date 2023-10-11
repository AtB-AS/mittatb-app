import {ParkingViolationType} from '@atb/api/types/mobility';
import {Button} from '@atb/components/button';
import {MessageBox} from '@atb/components/message-box';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SvgXml} from 'react-native-svg';
import {useParkingViolationsState} from './ParkingViolationsContext';
import {ScreenContainer} from './ScreenContainer';
import {SelectGroup} from './SelectGroup';
import {ParkingViolationsScreenProps} from './navigation-types';

export type SelectViolationScreenProps =
  ParkingViolationsScreenProps<'ParkingViolations_SelectViolation'>;

const ICON_SIZE = 50;

export const ParkingViolations_SelectViolation = ({
  navigation,
}: SelectViolationScreenProps) => {
  const style = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {isLoading, error, violations} = useParkingViolationsState();
  const [selectedViolations, setSelectedViolations] = useState<
    ParkingViolationType[]
  >([]);

  return (
    <ScreenContainer
      title={t(ParkingViolationTexts.selectViolation.title)}
      buttons={
        <Button
          interactiveColor="interactive_0"
          onPress={() => {
            navigation.navigate('ParkingViolations_Photo', {
              selectedViolations,
            });
          }}
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
      {!isLoading && error && (
        <MessageBox
          message={t(ParkingViolationTexts.loadingError)}
          type={'error'}
        />
      )}
      <ScrollView style={style.container}>
        {!isLoading && !error && (
          <SelectGroup
            multiple={true}
            items={violations}
            keyExtractor={(item) => 'violation' + item.id}
            onSelect={setSelectedViolations}
            generateAccessibilityLabel={(violation) =>
              t(
                ParkingViolationTexts.selectViolation.violationDescription(
                  violation.code,
                ),
              )
            }
            renderItem={(violation, isSelected) => (
              <>
                <SvgXml
                  style={{
                    ...style.itemImage,
                    borderColor: isSelected
                      ? theme.interactive.interactive_0.default.background
                      : theme.static.background.background_0.background,
                  }}
                  height={ICON_SIZE}
                  width={ICON_SIZE}
                  xml={violation.icon}
                />
                <ThemeText style={style.itemDescription}>
                  {t(
                    ParkingViolationTexts.selectViolation.violationDescription(
                      violation.code,
                    ),
                  )}
                </ThemeText>
              </>
            )}
          />
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
  },
  indicator: {alignSelf: 'center'},
  violation: {
    marginBottom: theme.spacings.medium,
  },
  itemImage: {
    borderRadius: ICON_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 2,
    marginRight: theme.spacings.medium,
  },
  itemDescription: {
    flexShrink: 1,
  },
}));
