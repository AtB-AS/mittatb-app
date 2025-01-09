import {useState} from 'react';
import {Linking, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {ScrollView} from 'react-native-gesture-handler';
import {Statuses, StyleSheet, useThemeContext} from '@atb/theme';
import {Button} from '@atb/components/button';
import {MessageInfoBox, OnPressConfig} from '@atb/components/message-info-box';
import {ThemeText} from '@atb/components/text';
import {useTranslation} from '@atb/translations';
import {ParkingViolationType} from '@atb/api/types/mobility';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {ScreenContainer} from './components/ScreenContainer';
import {SelectGroup} from './components/SelectGroup';
import {useParkingViolations} from '@atb/parking-violations-reporting';
import {useGeolocationContext} from '@atb/GeolocationContext';

export type SelectViolationScreenProps =
  RootStackScreenProps<'Root_ParkingViolationsSelectScreen'>;

const ICON_SIZE = 50;

export const Root_ParkingViolationsSelectScreen = ({
  navigation,
}: SelectViolationScreenProps) => {
  const style = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const {parkingViolationsState, isLoading, violations} =
    useParkingViolations();
  const [selectedViolations, setSelectedViolations] = useState<
    ParkingViolationType[]
  >([]);
  const {locationIsAvailable, location} = useGeolocationContext();

  const preReqs =
    locationIsAvailable && location && parkingViolationsState === 'success';

  return (
    <ScreenContainer
      leftHeaderButton={{type: 'close'}}
      title={t(ParkingViolationTexts.selectViolation.title)}
      secondaryText={t(ParkingViolationTexts.selectViolation.description)}
      buttons={
        <Button
          expanded={true}
          disabled={!preReqs}
          onPress={() => {
            navigation.navigate('Root_ParkingViolationsPhotoScreen', {
              selectedViolations,
            });
          }}
          text={t(ParkingViolationTexts.selectViolation.nextButton)}
        />
      }
      isLoading={isLoading}
    >
      {!preReqs ? (
        <IssueMessageBox />
      ) : (
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
                      ? theme.color.interactive[2].outline.background
                      : theme.color.background.neutral[0].background,
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

type ViolationsReportingIssue = 'general' | 'positionNotGranted' | 'noLocation';

const IssueMessageBox = () => {
  const {t} = useTranslation();
  const style = useStyles();

  const {status: locationPermissionStatus, location} = useGeolocationContext();

  let titleAndMessageTexts: ViolationsReportingIssue = 'general';
  let type: Statuses = 'error';
  let onPressConfig: OnPressConfig | undefined = undefined;

  if (
    locationPermissionStatus === 'denied' ||
    locationPermissionStatus === 'blocked'
  ) {
    titleAndMessageTexts = 'positionNotGranted';
    type = 'warning';
    onPressConfig = {
      text: t(ParkingViolationTexts.issue.positionNotGranted.action),
      action: () => Linking.openSettings(),
    };
  }
  if (locationPermissionStatus === 'granted' && !location) {
    titleAndMessageTexts = 'noLocation';
    type = 'warning';
  }
  return (
    <View style={style.issueMessageBoxContainer}>
      <MessageInfoBox
        title={t(ParkingViolationTexts.issue[titleAndMessageTexts].title)}
        message={t(ParkingViolationTexts.issue[titleAndMessageTexts].message)}
        type={type}
        onPressConfig={onPressConfig}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.medium,
  },
  violation: {
    marginBottom: theme.spacing.medium,
  },
  itemImage: {
    marginRight: theme.spacing.medium,
    borderColor: theme.color.interactive[2].outline.background,
    borderRadius: ICON_SIZE / 2,
    height: ICON_SIZE,
    width: ICON_SIZE,
    borderWidth: 1,
  },
  itemDescription: {
    flexShrink: 1,
  },
  issueMessageBoxContainer: {
    paddingHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
  },
}));
