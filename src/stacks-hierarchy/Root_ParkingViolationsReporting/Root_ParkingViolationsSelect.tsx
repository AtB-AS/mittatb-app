import {useState} from 'react';
import {Linking, View, ViewProps} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {ScrollView} from 'react-native-gesture-handler';
import {StyleSheet, useTheme} from '@atb/theme';
import {Button} from '@atb/components/button';
import {MessageBox} from '@atb/components/message-box';
import {ThemeText} from '@atb/components/text';
import {useTranslation} from '@atb/translations';
import {ParkingViolationType} from '@atb/api/types/mobility';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {ScreenContainer} from './components/ScreenContainer';
import {SelectGroup} from './components/SelectGroup';
import {useParkingViolations} from './use-parking-violations';
import {PermissionRequiredError} from './use-user-location';

export type SelectViolationScreenProps =
  RootStackScreenProps<'Root_ParkingViolationsSelect'>;

const ICON_SIZE = 50;

export const Root_ParkingViolationsSelect = ({
  navigation,
}: SelectViolationScreenProps) => {
  const style = useStyles();
  const {t} = useTranslation();
  const {theme} = useTheme();
  const {isLoading, isError, errors, violations} = useParkingViolations();
  const [selectedViolations, setSelectedViolations] = useState<
    ParkingViolationType[]
  >([]);

  return (
    <ScreenContainer
      leftHeaderButton={{type: 'close'}}
      title={t(ParkingViolationTexts.selectViolation.title)}
      buttons={
        <Button
          disabled={isError}
          onPress={() => {
            navigation.navigate('Root_ParkingViolationsPhoto', {
              selectedViolations,
            });
          }}
          text={t(ParkingViolationTexts.selectViolation.nextButton)}
        />
      }
      isLoading={isLoading}
    >
      {isError &&
        errors.map((error) => (
          <ErrorMessage style={style.container} error={error} />
        ))}
      {!isError && (
        <ScrollView style={style.container}>
          <SelectGroup
            mode="checkbox"
            items={violations}
            keyExtractor={(violation) => 'violation' + violation.code}
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
                      ? theme.interactive.interactive_2.outline.background
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
        </ScrollView>
      )}
    </ScreenContainer>
  );
};

type ErrorMessageProps = ViewProps & {error: unknown};
const ErrorMessage = (props: ErrorMessageProps) => {
  const {t} = useTranslation();

  if (props.error instanceof PermissionRequiredError) {
    return (
      <View {...props}>
        <MessageBox
          title={t(ParkingViolationTexts.error.position.title)}
          message={t(ParkingViolationTexts.error.position.message)}
          onPressConfig={{
            text: t(ParkingViolationTexts.error.position.action),
            action: () => Linking.openSettings(),
          }}
          type="warning"
        />
      </View>
    );
  }
  return (
    <View {...props}>
      <MessageBox
        title={t(ParkingViolationTexts.error.loading.title)}
        message={t(ParkingViolationTexts.error.loading.message)}
        type="error"
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacings.medium,
  },
  violation: {
    marginBottom: theme.spacings.medium,
  },
  itemImage: {
    marginRight: theme.spacings.medium,
    borderColor: theme.interactive.interactive_2.outline.background,
    borderRadius: ICON_SIZE / 2,
    height: ICON_SIZE,
    width: ICON_SIZE,
    borderWidth: 1,
  },
  itemDescription: {
    flexShrink: 1,
  },
}));
