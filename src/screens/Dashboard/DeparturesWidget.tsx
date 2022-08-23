import {getFavouriteDepartures} from '@atb/api/departures';
import {DepartureLineInfo, DepartureTime} from '@atb/api/departures/types';
import {FavouriteDepartureQuery} from '@atb/api/types/generated/FavouriteDepartures';
import ThemeText from '@atb/components/text';
import QuaySection from '@atb/departure-list/section-items/quay-section';
import {useFavorites} from '@atb/favorites';
import {StyleSheet} from '@atb/theme';
import {TicketsTexts, useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import React, {useEffect, useState} from 'react';
import {Button, View} from 'react-native';
import {call} from 'react-native-reanimated';

const FavouritesWidget: React.FC = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {favoriteDepartures} = useFavorites();

  console.log(favoriteDepartures);

  const [favs, setFavs] = useState(null);
  const [count, setCount] = useState(0);
  const [favResults, setFavResults] = useState<FavouriteDepartureQuery>();
  const [searchDate, setSearchDate] = useState<string>('');

  useEffect(() => {
    const fetch = async () => {
      const result = await getFavouriteDepartures(
        'NSR:Quay:72405',
        'ATB:Line:2_25',
      );
      return result;
    };
    const result = fetch()
      .catch((err) => {
        console.log('##Favorites error');
        console.log(err);
      })
      .then((data) => {
        console.log('## Fav results');
        console.log('res', data);
        if (data) {
          setFavResults(data);
          setSearchDate(new Date().toISOString());
        }
      });
  }, [count]);

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
      {favResults?.quays?.map((quay) => {
        const departureTimes: DepartureTime[] = quay.estimatedCalls.map(
          (call) => {
            return {
              aimedTime: call.aimedDepartureTime,
              serviceDate: call.date,
              situations: [], // not currently used by component
              time: call.expectedDepartureTime,
            };
          },
        );

        const line = quay.estimatedCalls.find((call) => call.serviceJourney)
          ?.serviceJourney?.line;

        const lineInfo: DepartureLineInfo | undefined = line
          ? {
              lineId: line.id,
              lineName: line.name ?? '',
              lineNumber: line.publicCode ?? '',
              quayId: quay.id,
              notices: [],
            }
          : undefined;

        return (
          <QuaySection
            quayGroup={{
              group: [{departures: departureTimes, lineInfo: lineInfo}],
              quay: {...quay, situations: []},
            }}
            searchDate={searchDate}
            stop={quay.stopPlace!} // jp3 says stopPlace is optional, but favourite departures should always have a stop place
          />
        );
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

/*
[
  {
    id: '051a3812-8f28-4407-a7cb-c602b2fbd52d',
    lineId: 'ATB:Line:2_25',
    lineLineNumber: '25',
    lineName: 'Hurtigbåtterm. via Singsaker',
    lineTransportationMode: 'bus',
    lineTransportationSubMode: 'localBus',
    quayId: 'NSR:Quay:72405',
    quayName: 'Gyldenløves gate',
    quayPublicCode: '',
    stopId: 'NSR:StopPlace:42284',
  },
  {
    id: 'd70b9340-75a2-4cc5-82bb-49648ee04a9a',
    lineId: 'ATB:Line:2_25',
    lineLineNumber: '25',
    lineName: 'Vikåsen via Singsaker',
    lineTransportationMode: 'bus',
    lineTransportationSubMode: 'localBus',
    quayId: 'NSR:Quay:72406',
    quayName: 'Gyldenløves gate',
    quayPublicCode: '',
    stopId: 'NSR:StopPlace:42284',
  },
];



*/

[
  {
    id: '051a3812-8f28-4407-a7cb-c602b2fbd52d',
    lineId: 'ATB:Line:2_25',
    lineLineNumber: '25',
    lineName: 'Hurtigbåtterm. via Singsaker',
    lineTransportationMode: 'bus',
    lineTransportationSubMode: 'localBus',
    quayId: 'NSR:Quay:72405',
    quayName: 'Gyldenløves gate',
    quayPublicCode: '',
    stopId: 'NSR:StopPlace:42284',
  },
  {
    id: 'd70b9340-75a2-4cc5-82bb-49648ee04a9a',
    lineId: 'ATB:Line:2_25',
    lineLineNumber: '25',
    lineName: 'Vikåsen via Singsaker',
    lineTransportationMode: 'bus',
    lineTransportationSubMode: 'localBus',
    quayId: '     ',
    quayName: 'Gyldenløves gate',
    quayPublicCode: '',
    stopId: 'NSR:StopPlace:42284',
  },
  {
    id: 'a455d715-36b5-44f4-8f84-8e64d99a8661',
    lineTransportationMode: 'bus',
    lineTransportationSubMode: 'localBus',
    quayId: 'NSR:Quay:75155',
    quayName: 'Festningsgata',
    quayPublicCode: '',
    stopId: 'NSR:StopPlace:43777',
  },
];

/*
{
  a1: quays(ids: "NSR:Quay:72406") {
    id
    name
    estimatedCalls(whiteListed: {lines: "ATB:Line:2_25"}, numberOfDepartures: 7) {
      serviceJourney {
        line {
          id
        }
      }
      aimedDepartureTime
      destinationDisplay {
        frontText
      }
    }
    name
  }
  a2: quays(ids: "NSR:Quay:72405") {
    id
    name
    estimatedCalls(whiteListed: {lines: "ATB:Line:2_25"}, numberOfDepartures: 7) {
      serviceJourney {
        line {
          id
        }
      }
      aimedDepartureTime
      destinationDisplay {
        frontText
      }
    }
    name
  }
}
  */
