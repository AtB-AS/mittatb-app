import {ParkingViolationType} from '@atb/api/types/mobility';
import {Button} from '@atb/components/button';
import {Processing} from '@atb/components/loading';
import {MessageBox} from '@atb/components/message-box';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {dictionary, useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useState} from 'react';
import {Linking, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SvgXml} from 'react-native-svg';
import {ScreenContainer} from '@atb/stacks-hierarchy/Root_ParkingViolationsReportingStack/components/ScreenContainer';
import {SelectGroup} from '@atb/stacks-hierarchy/Root_ParkingViolationsReportingStack/components/SelectGroup';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
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
          interactiveColor="interactive_0"
          onPress={() => {
            navigation.navigate('Root_ParkingViolationsPhoto', {
              selectedViolations,
            });
          }}
          text={t(ParkingViolationTexts.selectViolation.nextButton)}
          testID="nextButton"
          accessibilityHint={''} //TODO
        />
      }
    >
      {isLoading && !isError && (
        <View style={style.processing}>
          <Processing message={t(dictionary.loading)} />
        </View>
      )}
      {isError && errors.map((error) => <ErrorMessage error={error} />)}
      {!isLoading && !isError && (
        <ScrollView style={style.container}>
          <SelectGroup
            multiple
            items={violations}
            keyExtractor={(item) => 'violation' + item.code}
            onSelect={setSelectedViolations}
            generateAccessibilityLabel={(violation) =>
              t(
                ParkingViolationTexts.selectViolation.violationDescription(
                  violation.code,
                ),
              )
            }
            renderItem={(violation) => (
              <>
                <SvgXml
                  style={style.itemImage}
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

  if (error instanceof PermissionRequiredError) {
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
    marginRight: theme.spacings.medium,
  },
  itemDescription: {
    flexShrink: 1,
  },
}));
