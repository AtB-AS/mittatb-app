import {ParkingViolationType} from '@atb/api/types/mobility';
import {Button} from '@atb/components/button';
import {Processing} from '@atb/components/loading';
import {MessageBox} from '@atb/components/message-box';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import {dictionary, useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useState} from 'react';
import {Linking, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SvgXml} from 'react-native-svg';
import {
  PermissionReqiredError,
  useParkingViolationsState,
} from './ParkingViolationsContext';
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
      leftHeaderButton={{type: 'close'}}
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
        <View style={style.processing}>
          <Processing message={t(dictionary.loading)} />
        </View>
      )}
      {error && <ErrorMessage error={error} />}
      {!isLoading && !error && (
        <ScrollView style={style.container}>
          <SelectGroup
            multiple
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
        </ScrollView>
      )}
    </ScreenContainer>
  );
};

type ErrorMessageProps = {error: unknown};
const ErrorMessage = ({error}: ErrorMessageProps) => {
  const {t} = useTranslation();

  if (error instanceof PermissionReqiredError) {
    return (
      <MessageBox
        title={t(ParkingViolationTexts.error.position.title)}
        message={t(ParkingViolationTexts.error.position.message)}
        onPressConfig={{
          text: t(ParkingViolationTexts.error.position.action),
          action: () => Linking.openSettings(),
        }}
        type={'warning'}
      />
    );
  }
  return (
    <MessageBox
      title={t(ParkingViolationTexts.error.loading.title)}
      message={t(ParkingViolationTexts.error.loading.message)}
      type={'error'}
    />
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
  },
  processing: {
    flex: 1,
    justifyContent: 'center',
  },
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
