import {ThemeIcon} from '@atb/components/theme-icon';
import {useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {getTransportModeSvg} from '@atb/components/icon-box';
import {NearestStopPlaceNode, StopPlace} from '@atb/api/types/departures';
import {DeparturesTexts} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {useHumanizeDistance} from '@atb/utils/location';
import {
  getSituationOrNoticeA11yLabel,
  isSituationValidAtDate,
  SituationOrNoticeIcon,
} from '@atb/modules/situations';
import {SituationFragment} from '@atb/api/types/generated/fragments/situations';
import {getTranslatedModeName} from '@atb/utils/transportation-names';
import {GenericClickableSectionItem, Section} from '@atb/components/sections';

type StopPlaceItemProps = {
  stopPlaceNode: NearestStopPlaceNode;
  onPress: (place: StopPlace) => void;
  testID: string;
};

export const StopPlaceItem = ({
  stopPlaceNode,
  onPress,
  testID,
}: StopPlaceItemProps): React.JSX.Element => {
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
    <Section>
      <GenericClickableSectionItem
        onPress={() => onPress(place)}
        accessibilityLabel={a11yLabel}
        accessibilityHint={t(
          DeparturesTexts.stopPlaceList.a11yStopPlaceItemHint,
        )}
      >
        <View style={styles.stopPlaceContainer} testID={testID}>
          <View style={styles.stopPlaceInfo}>
            <ThemeText typography="heading__component" testID={testID + 'Name'}>
              {place.name}
            </ThemeText>
            <ThemeText
              typography="body__secondary"
              style={styles.stopDescription}
            >
              {description}
            </ThemeText>
            {humanizedDistance && (
              <ThemeText typography="body__secondary" color="secondary">
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
              svg={getTransportModeSvg(mode).svg}
            />
          ))}
        </View>
      </GenericClickableSectionItem>
    </Section>
  );
};

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
    marginVertical: theme.spacing.xSmall,
  },
  stopPlaceIcon: {
    marginLeft: theme.spacing.medium,
  },
}));
