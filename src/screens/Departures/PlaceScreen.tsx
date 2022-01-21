import FullScreenHeader from '@atb/components/screen-header/full-header';
import * as Sections from '@atb/components/sections';
import {StyleSheet, useTheme} from '@atb/theme';
import React, {useMemo, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {useTranslation} from '@atb/translations';
import {Expand, ExpandLess} from '@atb/assets/svg/icons/navigation';
import {
  EstimatedCall,
  Quay,
  StopPlacePosition,
} from '@atb/api/types/departures';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {DeparturesStackParams} from '.';
import EstimatedCallItem from './components/EstimatedCallItem';
import QuayScreen from './QuayScreen';
import StopPlaceScreen from './StopPlaceScreen';

export type PlaceScreenParams = {
  stopPlacePosition: StopPlacePosition;
  selectedQuay?: Quay;
};

type PlaceScreenRouteProps = RouteProp<DeparturesStackParams, 'PlaceScreen'>;

type quayChipData = {
  item: Quay;
};

export type PlaceScreenProps = {
  navigation: StackNavigationProp<DeparturesStackParams>;
  route: PlaceScreenRouteProps;
};

export default function PlaceScreen({
  navigation,
  route: {
    params: {stopPlacePosition, selectedQuay},
  },
}: PlaceScreenProps) {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const stopPlace = stopPlacePosition.node?.place;

  const navigateToDetails = (
    serviceJourneyId?: string,
    date?: string,
    fromQuayId?: string,
  ) => {
    if (!serviceJourneyId || !date) return;
    navigation.navigate('DepartureDetails', {
      items: [
        {
          serviceJourneyId,
          date,
          fromQuayId,
        },
      ],
    });
  };
  const navigateToQuay = (quay: Quay) => {
    navigation.setParams({selectedQuay: quay});
  };

  return (
    <View style={styles.container}>
      <FullScreenHeader title={stopPlace?.name} leftButton={{type: 'back'}} />
      <FlatList
        data={stopPlace?.quays}
        style={styles.quayChipContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Button
            onPress={() => {
              navigation.setParams({selectedQuay: undefined});
            }}
            text={t(DeparturesTexts.quayChips.allStops)}
            color={selectedQuay ? 'secondary_2' : 'secondary_3'}
            style={[styles.quayChip, {marginLeft: theme.spacings.medium}]}
          ></Button>
        }
        renderItem={({item}: quayChipData) => (
          <Button
            onPress={() => {
              navigation.setParams({selectedQuay: item});
            }}
            text={
              item.publicCode ? item.name + ' ' + item.publicCode : item.name
            }
            color={selectedQuay?.id === item.id ? 'secondary_3' : 'secondary_2'}
            style={styles.quayChip}
          ></Button>
        )}
      />
      {selectedQuay ? (
        <QuayScreen
          quay={selectedQuay}
          navigateToDetails={navigateToDetails}
          navigateToQuay={navigateToQuay}
        ></QuayScreen>
      ) : (
        <StopPlaceScreen
          stopPlacePosition={stopPlacePosition}
          navigateToDetails={navigateToDetails}
          navigateToQuay={navigateToQuay}
        ></StopPlaceScreen>
      )}
    </View>
  );
}

function getDeparturesForQuay(
  departures: EstimatedCall[] | null,
  quay: Quay,
): EstimatedCall[] {
  if (!departures) return [];
  return departures.filter(
    (departure) => departure && departure.quay?.id === quay.id,
  );
}

function SeparatorLine(): JSX.Element {
  const {theme} = useTheme();
  return (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: theme.colors.background_1.backgroundColor,
      }}
    />
  );
}

type QuaySectionProps = {
  quay: Quay;
  isSelected: boolean;
  data: EstimatedCall[] | null;
  navigateToQuay: (arg0: Quay) => void;
  navigateToDetails: (
    serviceJourneyId?: string,
    date?: string,
    fromQuayId?: string,
  ) => void;
};

export function QuaySection({
  quay,
  isSelected,
  data,
  navigateToQuay,
  navigateToDetails,
}: QuaySectionProps): JSX.Element {
  const [isHidden, setIsHidden] = useState(false);
  const styles = useStyles();
  const departures = getDeparturesForQuay(data, quay);
  const {t} = useTranslation();

  return (
    <View>
      <Sections.Section withPadding>
        <Sections.GenericClickableItem
          type="inline"
          onPress={() => {
            setIsHidden(!isHidden);
          }}
          accessibilityHint={
            isHidden
              ? t(DeparturesTexts.quaySection.a11yExpand)
              : t(DeparturesTexts.quaySection.a11yMinimize)
          }
        >
          <View style={styles.stopPlaceHeader}>
            <View style={styles.stopPlaceHeaderText}>
              <ThemeText
                type="body__secondary--bold"
                color="secondary"
                style={styles.rightMargin}
              >
                {quay.publicCode
                  ? quay.name + ' ' + quay.publicCode
                  : quay.name}
              </ThemeText>
              {!!quay.description && (
                <ThemeText
                  style={styles.rightMargin}
                  type="body__secondary"
                  color="secondary"
                >
                  {quay.description}
                </ThemeText>
              )}
            </View>
            <ThemeIcon svg={isHidden ? Expand : ExpandLess}></ThemeIcon>
          </View>
        </Sections.GenericClickableItem>
        {!isHidden && (
          <FlatList
            ItemSeparatorComponent={SeparatorLine}
            data={departures}
            renderItem={({item, index}) => (
              <Sections.GenericItem
                radius={
                  isSelected && index === departures.length - 1
                    ? 'bottom'
                    : undefined
                }
              >
                <EstimatedCallItem
                  departure={item}
                  navigateToDetails={navigateToDetails}
                ></EstimatedCallItem>
              </Sections.GenericItem>
            )}
            keyExtractor={(item) => item.serviceJourney?.id || ''}
            ListEmptyComponent={
              <>
                {data && (
                  <Sections.GenericItem
                    radius={isSelected ? 'bottom' : undefined}
                  >
                    <ThemeText color="secondary">
                      {t(DeparturesTexts.noDepartures)}
                    </ThemeText>
                  </Sections.GenericItem>
                )}
              </>
            }
          />
        )}
        {!data && (
          <Sections.GenericItem>
            <View style={{width: '100%'}}>
              <ActivityIndicator></ActivityIndicator>
            </View>
          </Sections.GenericItem>
        )}
        {!isSelected && !isHidden && (
          <Sections.LinkItem
            icon="arrow-right"
            text={
              quay.publicCode ? quay.name + ' ' + quay.publicCode : quay.name
            }
            textType="body__primary--bold"
            onPress={() => navigateToQuay(quay)}
            accessibility={{
              accessibilityHint: t(DeparturesTexts.quaySection.a11yToQuayHint),
            }}
          ></Sections.LinkItem>
        )}
      </Sections.Section>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.colors.background_1.backgroundColor,
    flex: 1,
  },
  quayChipContainer: {
    backgroundColor: theme.colors.background_accent.backgroundColor,
    paddingVertical: theme.spacings.medium,
    flexShrink: 0,
    flexGrow: 0,
  },
  quayChip: {
    marginRight: theme.spacings.medium,
  },
  stopPlaceHeader: {
    flexDirection: 'row',
    maxWidth: '100%',
    alignItems: 'center',
  },
  stopPlaceHeaderText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  rightMargin: {
    marginRight: theme.spacings.medium,
  },
}));
