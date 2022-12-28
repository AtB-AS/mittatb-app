import ThemeIcon from '@atb/components/theme-icon';
import {useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import * as Sections from '@atb/components/sections';
import {Bus} from '@atb/assets/svg/mono-icons/transportation';
import {getTransportModeSvg} from '@atb/components/transportation-icon';
import {NearestStopPlaceNode, StopPlace} from '@atb/api/types/departures';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {StyleSheet} from '@atb/theme';
import {useHumanizeDistance} from '@atb/utils/location';
import {
  getSituationOrNoticeA11yLabel,
  isSituationValidAtDate,
  SituationOrNoticeIcon,
} from '@atb/situations';
import {SituationFragment} from '@atb/api/types/generated/fragments/situations';
import {getTranslatedModeName} from '@atb/utils/transportation-names';

type StopPlaceItemProps = {
  stopPlaceNode: NearestStopPlaceNode;
  onPress: (place: StopPlace) => void;
  testID: string;
};

export default function StopPlaceItem({
  stopPlaceNode,
  onPress,
  testID,
}: StopPlaceItemProps): JSX.Element {
  const styles = useStyles();
  const {t} = useTranslation();

  const humanizedDistance = useHumanizeDistance(stopPlaceNode.distance);

  const place = stopPlaceNode.place;
  if (!place) return <></>;

  const description =
    place.description || t(DeparturesTexts.stopPlaceList.stopPlace);

  const allQuaySituations =
    place.quays?.reduce<SituationFragment[]>(
      (all, quay) => [
        ...all,
        ...quay.situations.filter(isSituationValidAtDate(new Date())),
      ],
      [],
    ) || [];

  const a11yLabel = [
    place.name,
    description,
    humanizedDistance,
    getSituationOrNoticeA11yLabel(allQuaySituations, [], false, t),
    place.transportMode
      ?.map((mode) => t(getTranslatedModeName(mode)))
      .join(','),
  ]
    .filter(Boolean)
    .join(',');

  return (
    <Sections.Section withPadding>
      <Sections.GenericClickableItem
        onPress={() => onPress(place)}
        accessibilityLabel={a11yLabel}
        accessibilityHint={t(
          DeparturesTexts.stopPlaceList.a11yStopPlaceItemHint,
        )}
      >
        <View style={styles.stopPlaceContainer} testID={testID}>
          <View style={styles.stopPlaceInfo}>
            <ThemeText type="heading__component" testID={testID + 'Name'}>
              {place.name}
            </ThemeText>
            <ThemeText type="body__secondary" style={styles.stopDescription}>
              {description}
            </ThemeText>
            {humanizedDistance && (
              <ThemeText type="body__secondary" color="secondary">
                {humanizedDistance}
              </ThemeText>
            )}
          </View>
          <SituationOrNoticeIcon situations={allQuaySituations} />
          {place.transportMode?.map((mode) => (
            <ThemeIcon
              key={mode}
              style={styles.stopPlaceIcon}
              size="large"
              svg={getTransportModeSvg(mode) || Bus}
            />
          ))}
        </View>
      </Sections.GenericClickableItem>
    </Sections.Section>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  stopPlaceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexGrow: 1,
  },
  stopPlaceInfo: {
    flexShrink: 1,
    flexGrow: 1,
  },
  stopDescription: {
    marginVertical: theme.spacings.xSmall,
  },
  stopPlaceIcon: {
    marginLeft: theme.spacings.medium,
  },
}));
