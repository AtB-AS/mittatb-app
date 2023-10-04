import {ParkingViolationType} from '@atb/api/types/mobility';
import {Button} from '@atb/components/button';
import {Checkbox} from '@atb/components/checkbox';
import {MessageBox} from '@atb/components/message-box';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useState} from 'react';
import {
  ActivityIndicator,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useParkingViolationsState} from './ParkingViolationsContext';
import {ScreenContainer} from './ScreenContainer';
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

  const handleViolationSelect = (violation: ParkingViolationType) => {
    setSelectedViolations((current) =>
      current.includes(violation)
        ? current.filter((it) => it !== violation)
        : [...current, violation],
    );
  };

  return (
    <ScreenContainer
      title={t(ParkingViolationTexts.selectViolation.title)}
      buttons={
        <Button
          interactiveColor="interactive_0"
          onPress={() =>
            navigation.navigate('ParkingViolations_Photo', {selectedViolations})
          }
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
        violations.map((violation) => (
          <SelectableViolation
            style={style.violation}
            violation={violation}
            onSelect={handleViolationSelect}
            key={violation.id}
          />
        ))}
    </ScreenContainer>
  );
};

type SelectableViolationProps = {
  violation: ParkingViolationType;
  onSelect: (violation: ParkingViolationType) => void;
  style?: StyleProp<ViewStyle>;
};
const SelectableViolation = ({
  style: containerStyle,
  violation,
  onSelect,
}: SelectableViolationProps) => {
  const style = useSelectableViolationStyle();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const [isSlected, setIsSelected] = useState(false);

  const background = theme.static.background.background_0.background;
  const selectedBackground = theme.interactive.interactive_2.active.background;
  const selectedBorder = theme.interactive.interactive_0.default.background;

  const handleSelect = () => {
    setIsSelected((val) => !val);
    onSelect(violation);
  };

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        onPress={handleSelect}
        style={{
          ...style.container,
          backgroundColor: isSlected ? selectedBackground : background,
          borderColor: isSlected ? selectedBorder : background,
        }}
      >
        <Checkbox style={style.checkbox} checked={isSlected} />
        <SvgXml
          style={{
            ...style.image,
            borderColor: isSlected ? selectedBorder : background,
          }}
          height={ICON_SIZE}
          width={ICON_SIZE}
          xml={violation.icon}
        />
        <ThemeText style={style.description}>
          {t(
            ParkingViolationTexts.selectViolation.violationDescription(
              violation.code,
            ),
          )}
        </ThemeText>
      </TouchableOpacity>
    </View>
  );
};

const useSelectableViolationStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background.background_0.background,
    borderRadius: theme.border.radius.regular,
    borderWidth: 2,
    paddingVertical: theme.spacings.medium,
    paddingHorizontal: theme.spacings.xLarge,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: theme.spacings.medium,
  },
  image: {
    borderRadius: ICON_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 2,
    marginRight: theme.spacings.medium,
  },
  description: {},
}));

const useStyles = StyleSheet.createThemeHook((theme) => ({
  indicator: {alignSelf: 'center'},
  violation: {
    marginBottom: theme.spacings.medium,
  },
}));
