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
import {useGeolocationState} from '@atb/GeolocationContext';
import {StyleSheet} from '@atb/theme';
import {TicketsTexts, useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import groupBy from 'lodash.groupby';
import React, {useEffect, useState} from 'react';
import {Button, View} from 'react-native';
import {themeColor} from '../Onboarding/WelcomeScreen';

const FavouritesWidget: React.FC = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {favoriteDepartures} = useFavorites();
  const {location} = useGeolocationState();

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

  console.log('## current location', location);

  return (
    <View style={styles.container}>
      <ThemeText
        type="body__secondary"
        color="background_accent_0"
        style={styles.sectionText}
      >
        {t(DeparturesTexts.widget.heading)}
      </ThemeText>
      <Button onPress={() => setCount(count + 1)} title="Fetch" />
      <ThemeText>{'hello'}</ThemeText>

      {favResults.map((stopPlaceGroup) => {
        const stopPlaceInfo = stopPlaceGroup.stopPlace;
        return (
          <>
            {stopPlaceGroup.quays.map((quay) => {
              return (
                <QuaySection
                  quayGroup={quay}
                  stop={stopPlaceInfo}
                  searchDate={searchDate}
                  currentLocation={location || undefined}
                />
              );
            })}
          </>
        );
      })}
    </View>
  );
};

export default FavouritesWidget;

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacings.medium,
  },
  sectionText: {
    marginBottom: theme.spacings.medium,
  },
}));

[
  {
    id: 'NSR:Quay:73975',
    name: 'Solsiden',
    stopPlace: {
      id: 'NSR:StopPlace:43133',
      description: '',
      name: 'Solsiden',
      longitude: 10.413246,
      latitude: 63.434019,
    },
    estimatedCalls: [
      {
        date: '2022-08-29',
        expectedDepartureTime: '2022-08-29T15:17:47+02:00',
        aimedDepartureTime: '2022-08-29T15:15:00+02:00',
        quay: {
          id: 'NSR:Quay:73975',
        },
        destinationDisplay: {
          frontText: 'Marienborg via sentrum',
        },
        serviceJourney: {
          id: 'ATB:ServiceJourney:12_220330132301407_108',
          line: {
            id: 'ATB:Line:2_12',
            publicCode: '12',
            transportMode: 'bus',
            transportSubmode: 'localBus',
            name: 'Dragvoll-Øya/Marienborg',
          },
        },
      },
      {
        date: '2022-08-29',
        expectedDepartureTime: '2022-08-29T15:25:16+02:00',
        aimedDepartureTime: '2022-08-29T15:25:00+02:00',
        quay: {
          id: 'NSR:Quay:73975',
        },
        destinationDisplay: {
          frontText: 'Trondheim Spektrum via sentrum',
        },
        serviceJourney: {
          id: 'ATB:ServiceJourney:12_220330132301481_110',
          line: {
            id: 'ATB:Line:2_12',
            publicCode: '12',
            transportMode: 'bus',
            transportSubmode: 'localBus',
            name: 'Dragvoll-Øya/Marienborg',
          },
        },
      },
      {
        date: '2022-08-29',
        expectedDepartureTime: '2022-08-29T15:36:09+02:00',
        aimedDepartureTime: '2022-08-29T15:35:00+02:00',
        quay: {
          id: 'NSR:Quay:73975',
        },
        destinationDisplay: {
          frontText: 'Marienborg via sentrum',
        },
        serviceJourney: {
          id: 'ATB:ServiceJourney:12_220330132301408_112',
          line: {
            id: 'ATB:Line:2_12',
            publicCode: '12',
            transportMode: 'bus',
            transportSubmode: 'localBus',
            name: 'Dragvoll-Øya/Marienborg',
          },
        },
      },
      {
        date: '2022-08-29',
        expectedDepartureTime: '2022-08-29T15:46:53+02:00',
        aimedDepartureTime: '2022-08-29T15:45:00+02:00',
        quay: {
          id: 'NSR:Quay:73975',
        },
        destinationDisplay: {
          frontText: 'Marienborg via sentrum',
        },
        serviceJourney: {
          id: 'ATB:ServiceJourney:12_220330132301409_114',
          line: {
            id: 'ATB:Line:2_12',
            publicCode: '12',
            transportMode: 'bus',
            transportSubmode: 'localBus',
            name: 'Dragvoll-Øya/Marienborg',
          },
        },
      },
      {
        date: '2022-08-29',
        expectedDepartureTime: '2022-08-29T15:56:07+02:00',
        aimedDepartureTime: '2022-08-29T15:55:00+02:00',
        quay: {
          id: 'NSR:Quay:73975',
        },
        destinationDisplay: {
          frontText: 'Marienborg via sentrum',
        },
        serviceJourney: {
          id: 'ATB:ServiceJourney:12_220330132301410_116',
          line: {
            id: 'ATB:Line:2_12',
            publicCode: '12',
            transportMode: 'bus',
            transportSubmode: 'localBus',
            name: 'Dragvoll-Øya/Marienborg',
          },
        },
      },
      {
        date: '2022-08-29',
        expectedDepartureTime: '2022-08-29T16:05:00+02:00',
        aimedDepartureTime: '2022-08-29T16:05:00+02:00',
        quay: {
          id: 'NSR:Quay:73975',
        },
        destinationDisplay: {
          frontText: 'Marienborg via sentrum',
        },
        serviceJourney: {
          id: 'ATB:ServiceJourney:12_220330132301411_118',
          line: {
            id: 'ATB:Line:2_12',
            publicCode: '12',
            transportMode: 'bus',
            transportSubmode: 'localBus',
            name: 'Dragvoll-Øya/Marienborg',
          },
        },
      },
      {
        date: '2022-08-29',
        expectedDepartureTime: '2022-08-29T16:16:05+02:00',
        aimedDepartureTime: '2022-08-29T16:15:00+02:00',
        quay: {
          id: 'NSR:Quay:73975',
        },
        destinationDisplay: {
          frontText: 'Marienborg via sentrum',
        },
        serviceJourney: {
          id: 'ATB:ServiceJourney:12_220330132301412_120',
          line: {
            id: 'ATB:Line:2_12',
            publicCode: '12',
            transportMode: 'bus',
            transportSubmode: 'localBus',
            name: 'Dragvoll-Øya/Marienborg',
          },
        },
      },
      {
        date: '2022-08-29',
        expectedDepartureTime: '2022-08-29T16:25:00+02:00',
        aimedDepartureTime: '2022-08-29T16:25:00+02:00',
        quay: {
          id: 'NSR:Quay:73975',
        },
        destinationDisplay: {
          frontText: 'Trondheim Spektrum via sentrum',
        },
        serviceJourney: {
          id: 'ATB:ServiceJourney:12_220330132301482_122',
          line: {
            id: 'ATB:Line:2_12',
            publicCode: '12',
            transportMode: 'bus',
            transportSubmode: 'localBus',
            name: 'Dragvoll-Øya/Marienborg',
          },
        },
      },
      {
        date: '2022-08-29',
        expectedDepartureTime: '2022-08-29T16:36:06+02:00',
        aimedDepartureTime: '2022-08-29T16:35:00+02:00',
        quay: {
          id: 'NSR:Quay:73975',
        },
        destinationDisplay: {
          frontText: 'Marienborg via sentrum',
        },
        serviceJourney: {
          id: 'ATB:ServiceJourney:12_220330132301511_124',
          line: {
            id: 'ATB:Line:2_12',
            publicCode: '12',
            transportMode: 'bus',
            transportSubmode: 'localBus',
            name: 'Dragvoll-Øya/Marienborg',
          },
        },
      },
      {
        date: '2022-08-29',
        expectedDepartureTime: '2022-08-29T17:16:09+02:00',
        aimedDepartureTime: '2022-08-29T17:14:00+02:00',
        quay: {
          id: 'NSR:Quay:73975',
        },
        destinationDisplay: {
          frontText: 'Trondheim Spektrum via sentrum',
        },
        serviceJourney: {
          id: 'ATB:ServiceJourney:12_220330132301574_132',
          line: {
            id: 'ATB:Line:2_12',
            publicCode: '12',
            transportMode: 'bus',
            transportSubmode: 'localBus',
            name: 'Dragvoll-Øya/Marienborg',
          },
        },
      },
      {
        date: '2022-08-29',
        expectedDepartureTime: '2022-08-29T17:56:06+02:00',
        aimedDepartureTime: '2022-08-29T17:54:00+02:00',
        quay: {
          id: 'NSR:Quay:73975',
        },
        destinationDisplay: {
          frontText: 'Trondheim Spektrum via sentrum',
        },
        serviceJourney: {
          id: 'ATB:ServiceJourney:12_220330132301575_140',
          line: {
            id: 'ATB:Line:2_12',
            publicCode: '12',
            transportMode: 'bus',
            transportSubmode: 'localBus',
            name: 'Dragvoll-Øya/Marienborg',
          },
        },
      },
      {
        date: '2022-08-29',
        expectedDepartureTime: '2022-08-29T18:34:00+02:00',
        aimedDepartureTime: '2022-08-29T18:34:00+02:00',
        quay: {
          id: 'NSR:Quay:73975',
        },
        destinationDisplay: {
          frontText: 'Trondheim Spektrum via sentrum',
        },
        serviceJourney: {
          id: 'ATB:ServiceJourney:12_220330132301576_148',
          line: {
            id: 'ATB:Line:2_12',
            publicCode: '12',
            transportMode: 'bus',
            transportSubmode: 'localBus',
            name: 'Dragvoll-Øya/Marienborg',
          },
        },
      },
      {
        date: '2022-08-29',
        expectedDepartureTime: '2022-08-29T19:14:00+02:00',
        aimedDepartureTime: '2022-08-29T19:14:00+02:00',
        quay: {
          id: 'NSR:Quay:73975',
        },
        destinationDisplay: {
          frontText: 'Trondheim Spektrum via sentrum',
        },
        serviceJourney: {
          id: 'ATB:ServiceJourney:12_220330132301577_156',
          line: {
            id: 'ATB:Line:2_12',
            publicCode: '12',
            transportMode: 'bus',
            transportSubmode: 'localBus',
            name: 'Dragvoll-Øya/Marienborg',
          },
        },
      },
      {
        date: '2022-08-29',
        expectedDepartureTime: '2022-08-29T19:54:00+02:00',
        aimedDepartureTime: '2022-08-29T19:54:00+02:00',
        quay: {
          id: 'NSR:Quay:73975',
        },
        destinationDisplay: {
          frontText: 'Trondheim Spektrum via sentrum',
        },
        serviceJourney: {
          id: 'ATB:ServiceJourney:12_220330132301578_164',
          line: {
            id: 'ATB:Line:2_12',
            publicCode: '12',
            transportMode: 'bus',
            transportSubmode: 'localBus',
            name: 'Dragvoll-Øya/Marienborg',
          },
        },
      },
    ],
  },
];
