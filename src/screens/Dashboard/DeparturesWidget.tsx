import {getFavouriteDepartures} from '@atb/api/departures';
import {
  DepartureLineInfo,
  DepartureTime,
  StopPlaceGroup,
} from '@atb/api/departures/types';
import {FavouriteDepartureQuery} from '@atb/api/types/generated/FavouriteDepartures';
import ThemeText from '@atb/components/text';
import QuaySection from '@atb/departure-list/section-items/quay-section';
import {useFavorites} from '@atb/favorites';
import {StyleSheet} from '@atb/theme';
import {TicketsTexts, useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import groupBy from 'lodash.groupby';
import React, {useEffect, useState} from 'react';
import {Button, View} from 'react-native';

const FavouritesWidget: React.FC = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {favoriteDepartures} = useFavorites();

  console.log('## stored favourites', JSON.stringify(favoriteDepartures));

  const [favs, setFavs] = useState(null);
  const [count, setCount] = useState(0);
  const [favResults, setFavResults] = useState<StopPlaceGroup[]>([]);
  const [searchDate, setSearchDate] = useState<string>('');

  useEffect(() => {
    const fetch = async () => {
      const result = await getFavouriteDepartures(favoriteDepartures);
      return result;
    };
    const result = fetch()
      .catch((err) => {
        console.log('##Favorites error', JSON.stringify(err));
      })
      .then((data) => {
        console.log('## Fav results', JSON.stringify(data));
        if (data) {
          setFavResults(data);
          setSearchDate(new Date().toISOString());
        }
      });
  }, [count, favoriteDepartures]);

  return (
    <View>
      <ThemeText
        type="body__secondary"
        color="background_accent_0"
        style={styles.sectionText}
      >
        {t(DeparturesTexts.widget.heading)}
      </ThemeText>
      <Button onPress={() => setCount(count + 1)} title="Fetch" />

      {favResults?.forEach((stopPlaceGroup) => {
        const stopPlaceInfo = stopPlaceGroup.stopPlace;
        return stopPlaceGroup.quays.map((quay) => {
          return (
            <QuaySection
              quayGroup={quay}
              searchDate={searchDate}
              stop={stopPlaceInfo}
            />
          );
        });
      })}
    </View>
  );
};

export default FavouritesWidget;

const useStyles = StyleSheet.createThemeHook((theme) => ({
  sectionText: {
    marginLeft: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
}));

[
  {
    stopPlace: {
      __typename: 'StopPlace',
      id: 'NSR:StopPlace:43133',
      description: '',
      name: 'Solsiden',
      longitude: 10.413246,
      latitude: 63.434019,
    },
    quays: [
      {
        quay: {
          id: 'NSR:Quay:73975',
          name: 'Solsiden',
          stopPlaceId: 'NSR:StopPlace:43133',
        },
        group: [
          {
            lineInfo: {
              lineId: 'ATB:Line:2_12',
              lineName: 'Marienborg via sentrum',
              lineNumber: '12',
              quayId: 'NSR:Quay:73975',
              notices: [],
            },
            departures: [
              {
                aimedTime: '2022-08-26T14:44:00+02:00',
                serviceDate: '2022-08-26',
                time: '2022-08-26T14:48:29+02:00',
              },
              {
                aimedTime: '2022-08-26T14:55:00+02:00',
                serviceDate: '2022-08-26',
                time: '2022-08-26T14:56:09+02:00',
              },
              {
                aimedTime: '2022-08-26T15:05:00+02:00',
                serviceDate: '2022-08-26',
                time: '2022-08-26T15:05:42+02:00',
              },
              {
                aimedTime: '2022-08-26T15:15:00+02:00',
                serviceDate: '2022-08-26',
                time: '2022-08-26T15:15:41+02:00',
              },
              {
                aimedTime: '2022-08-26T15:35:00+02:00',
                serviceDate: '2022-08-26',
                time: '2022-08-26T15:35:42+02:00',
              },
              {
                aimedTime: '2022-08-26T15:45:00+02:00',
                serviceDate: '2022-08-26',
                time: '2022-08-26T15:45:42+02:00',
              },
              {
                aimedTime: '2022-08-26T15:55:00+02:00',
                serviceDate: '2022-08-26',
                time: '2022-08-26T15:55:42+02:00',
              },
            ],
          },
          {
            lineInfo: {
              lineId: 'ATB:Line:2_12',
              lineName: 'Trondheim Spektrum via sentrum',
              lineNumber: '12',
              quayId: 'NSR:Quay:73975',
              notices: [],
            },
            departures: [
              {
                aimedTime: '2022-08-26T15:25:00+02:00',
                serviceDate: '2022-08-26',
                time: '2022-08-26T15:25:42+02:00',
              },
              {
                aimedTime: '2022-08-26T16:25:00+02:00',
                serviceDate: '2022-08-26',
                time: '2022-08-26T16:25:00+02:00',
              },
              {
                aimedTime: '2022-08-26T17:14:00+02:00',
                serviceDate: '2022-08-26',
                time: '2022-08-26T17:15:44+02:00',
              },
              {
                aimedTime: '2022-08-26T17:54:00+02:00',
                serviceDate: '2022-08-26',
                time: '2022-08-26T17:54:00+02:00',
              },
              {
                aimedTime: '2022-08-26T18:34:00+02:00',
                serviceDate: '2022-08-26',
                time: '2022-08-26T18:34:00+02:00',
              },
              {
                aimedTime: '2022-08-26T19:14:00+02:00',
                serviceDate: '2022-08-26',
                time: '2022-08-26T19:14:00+02:00',
              },
              {
                aimedTime: '2022-08-26T19:54:00+02:00',
                serviceDate: '2022-08-26',
                time: '2022-08-26T19:54:00+02:00',
              },
            ],
          },
        ],
      },
    ],
  },
];