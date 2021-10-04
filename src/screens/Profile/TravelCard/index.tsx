import {usePreferences} from '@atb/preferences';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {UserProfileSettingsTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import ThemeText from '@atb/components/text';
import {View} from 'react-native';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import MessageBox from '@atb/components/message-box';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import * as Sections from '@atb/components/sections';
import {Warning} from '@atb/assets/svg/situations';
import {Add, Edit} from '@atb/assets/svg/icons/actions';
import {RootStackParamList} from '@atb/navigation';
import {StackNavigationProp} from '@react-navigation/stack';
import {CompositeNavigationProp} from '@react-navigation/native';
import {ProfileStackParams} from '..';

export type TravelCardNavigationProp = StackNavigationProp<
  ProfileStackParams,
  'TravelCard'
>;

type TravelCardScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList>,
  TravelCardNavigationProp
>;

type TravelCardScreenProps = {
  navigation: TravelCardScreenNavigationProp;
};

export default function TravelCard({navigation}: TravelCardScreenProps) {
  const styles = useStyles();
  const {t, language} = useTranslation();

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title="Mitt reisebevis"
        leftButton={{type: 'back'}}
        color={'background_gray'}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.activeTravelCard}>
          <ThemeText
            type="body__secondary"
            color="primary_2"
            style={styles.activeTicketHeader}
          >
            Aktivt reisebevis
          </ThemeText>
          <ThemeText
            type="heading__title"
            color="primary_2"
            style={styles.activeTicketType}
          >
            T:kort
          </ThemeText>
          <ThemeText color="primary_2">
            Ta med deg t:kortet når du er ute og reiser. Ved en eventuell
            kontroll viser du frem t:kortet ditt for avlesning.
          </ThemeText>
          <View style={styles.activeTicketCard}>
            <View style={styles.cardNumber}>
              <ThemeText
                type="body__tertiary"
                color="primary_1"
                style={styles.transparentText}
              >
                XXXX XXXX{' '}
              </ThemeText>
              <ThemeText type="body__tertiary" color="primary_1">
                {'8224880'}
              </ThemeText>
              <ThemeText
                type="body__tertiary"
                color="primary_1"
                style={styles.transparentText}
              >
                {' '}
                X
              </ThemeText>
            </View>
            <View>
              <ThemeText
                type="body__tertiary"
                color="primary_1"
                style={styles.tcardicon}
              >
                {'\n'}
                t:kort
              </ThemeText>
            </View>
          </View>
          <MessageBox type="info">
            <ThemeText type="body__primary" color="primary_1">
              Du kan ha ett gyldig reisebevis til enhver tid.
            </ThemeText>
          </MessageBox>
        </View>

        <Sections.Section withTopPadding>
          <Sections.LinkItem
            text={'Endre reisebevis'}
            onPress={() => {
              navigation.navigate('SelectTravelCard');
            }}
            icon={<ThemeIcon svg={Edit}></ThemeIcon>}
          />
        </Sections.Section>

        <Sections.Section withTopPadding withBottomPadding>
          <Sections.HeaderItem text="Ofte stilte spørsmål" />
          <Sections.LinkItem
            text={'Hva er et reisebevis?'}
            onPress={() => {}}
            icon={<ThemeIcon svg={Add} />}
          />
          <Sections.LinkItem
            text={'Hva om jeg mister mobilen?'}
            onPress={() => {}}
            icon={<ThemeIcon svg={Add} />}
          />
          <Sections.LinkItem
            text={'Hvor ofte kan jeg bytte?'}
            onPress={() => {}}
            icon={<ThemeIcon svg={Add} />}
          />
          <Sections.LinkItem
            text={'Hvor mange reisebevis kan jeg ha?'}
            onPress={() => {}}
            icon={<ThemeIcon svg={Add} />}
          />
          <Sections.LinkItem
            text={'Kan jeg reise uten mitt reisebevis?'}
            onPress={() => {}}
            icon={<ThemeIcon svg={Add} />}
          />
        </Sections.Section>
      </ScrollView>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.background_gray.backgroundColor,
    flex: 1,
  },
  scrollView: {
    marginHorizontal: theme.spacings.large,
  },
  sectionWithPadding: {
    marginVertical: theme.spacings.xLarge,
  },
  transparentText: {
    opacity: 0.2,
  },
  activeTravelCard: {
    backgroundColor: theme.colors.primary_2.backgroundColor,
    padding: theme.spacings.xLarge,
    borderRadius: theme.border.radius.regular,
    marginTop: theme.spacings.large,
  },
  activeTicketHeader: {
    marginBottom: theme.spacings.medium,
  },
  activeTicketType: {
    marginBottom: theme.spacings.large,
  },
  activeTicketCard: {
    backgroundColor: theme.colors.primary_2.color,
    padding: theme.spacings.large,
    borderRadius: theme.border.radius.regular,
    marginVertical: theme.spacings.large,
    alignSelf: 'center',
  },
  cardNumber: {
    flexDirection: 'row',
  },
  tcardicon: {
    borderWidth: 1,
    borderRadius: 2,
    padding: theme.spacings.small,
    alignSelf: 'flex-end',
    marginTop: theme.spacings.small,
  },
}));
