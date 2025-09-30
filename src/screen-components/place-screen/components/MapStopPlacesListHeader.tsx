import {View} from 'react-native';
import {DeparturesTexts, useTranslation} from '@atb/translations';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import DeparturesDialogSheetTexts from '@atb/translations/components/DeparturesDialogSheet';
import {WalkingDistance} from '@atb/components/walking-distance';
import {StyleSheet} from '@atb/theme';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {StopPlace} from '@atb/api/types/departures';

type Props = {
  setTravelTarget?: (target: string) => void;
  distance?: number | undefined;
  showTimeNavigation?: boolean;
  stopPlaces: StopPlace[];
};

export function MapStopPlacesListHeader({
  setTravelTarget,
  distance,
  stopPlaces,
}: Props) {
  const styles = useStyles();
  const {t} = useTranslation();
  const analytics = useAnalyticsContext();

  return (
    <>
      <WalkingDistance distance={distance} style={styles.walkingDistance} />
      <View style={styles.buttonsContainer}>
        <View style={styles.travelButton}>
          <Button
            expanded={true}
            text={t(DeparturesDialogSheetTexts.travelFrom.title)}
            onPress={() => {
              analytics.logEvent(
                'Map',
                'Stop place travelFrom button clicked',
                {id: stopPlaces[0].id},
              );
              setTravelTarget && setTravelTarget('fromLocation');
            }}
            mode="primary"
            style={styles.travelFromButtonPadding}
          />
        </View>
        <View style={styles.travelButton}>
          <Button
            expanded={true}
            text={t(DeparturesDialogSheetTexts.travelTo.title)}
            onPress={() => {
              analytics.logEvent('Map', 'Stop place travelTo button clicked', {
                id: stopPlaces[0].id,
              });
              setTravelTarget && setTravelTarget('toLocation');
            }}
            mode="primary"
            style={styles.travelToButtonPadding}
          />
        </View>
      </View>
      <ThemeText
        typography="body__secondary"
        color="secondary"
        style={styles.title}
      >
        {t(DeparturesTexts.header.title)}
      </ThemeText>
    </>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  messageBox: {
    marginHorizontal: theme.spacing.medium,
  },
  marginBottom: {
    marginBottom: theme.spacing.medium,
  },
  buttonsContainer: {
    padding: theme.spacing.medium,
    flexDirection: 'row',
  },
  travelButton: {
    flex: 1,
  },
  travelFromButtonPadding: {
    marginRight: theme.spacing.medium / 2,
  },
  travelToButtonPadding: {
    marginLeft: theme.spacing.medium / 2,
  },
  title: {
    marginTop: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
  },
  walkingDistance: {
    paddingBottom: theme.spacing.medium,
  },
}));
