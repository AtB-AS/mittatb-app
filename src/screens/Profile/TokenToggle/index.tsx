import {StyleSheet, Theme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import ThemeText from '@atb/components/text';
import {View} from 'react-native';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import MessageBox from '@atb/components/message-box';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import * as Sections from '@atb/components/sections';
import {Add, Edit, Remove} from '@atb/assets/svg/icons/actions';
import {RootStackParamList} from '@atb/navigation';
import {StackNavigationProp} from '@react-navigation/stack';
import {CompositeNavigationProp} from '@react-navigation/native';
import {ProfileStackParams} from '..';
import SelectTravelTokenTexts from '@atb/translations/screens/subscreens/SelectTravelToken';
import {ActiveTicketCard} from '@atb/screens/Ticketing/Tickets/TravelCardInformation';

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

  const faqCount: number = 5;

  const [visibleFaqs, setVisibleFaqs] = useState(
    new Array(faqCount).fill(false),
  );

  const travelCard = {
    allowedActions: [
      'TOKEN_ACTION_TICKET_INSPECTION',
      'TOKEN_ACTION_TRAVELCARD',
      'TOKEN_ACTION_IDENTIFICATION',
    ],
    expires: 1949650000,
    id: '20f2b64b-45b0-441b-a910-d9b1abcd1f1b',
    keyValues: {
      NodOrderGroupId: 'd956f62d-b2a2-5414-52cb-bfe32132ac6f',
      travelCardId: '123412341',
    },
    state: 'TOKEN_LIFECYCLE_STATE_NOT_ACTIVATED',
    type: 'TOKEN_TYPE_TRAVELCARD',
  };

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
            {t(SelectTravelTokenTexts.activeToken.title)}
          </ThemeText>
          <ThemeText
            type="heading__title"
            color="primary_2"
            style={styles.activeTicketType}
          >
            {t(SelectTravelTokenTexts.activeToken.type.tcard.title)}
          </ThemeText>
          <ThemeText color="primary_2">
            {t(SelectTravelTokenTexts.activeToken.type.tcard.description)}
          </ThemeText>
          <ActiveTicketCard
            cardId={travelCard.keyValues.travelCardId}
            color="primary_3"
          ></ActiveTicketCard>
          <MessageBox type="info">
            <ThemeText type="body__primary" color="primary_1">
              {t(SelectTravelTokenTexts.activeToken.info)}
            </ThemeText>
          </MessageBox>
        </View>

        <Sections.Section withTopPadding>
          <Sections.LinkItem
            type="spacious"
            text={t(SelectTravelTokenTexts.changeTokenButton)}
            onPress={() => {
              navigation.navigate('SelectTravelToken');
            }}
            icon={<ThemeIcon svg={Edit}></ThemeIcon>}
          />
        </Sections.Section>

        <Sections.Section withTopPadding withBottomPadding>
          <Sections.HeaderItem
            text={t(SelectTravelTokenTexts.faq.title)}
            type="spacious"
          />
          {visibleFaqs.map((item: boolean, n: number) => (
            <View key={n}>
              <Sections.LinkItem
                type="spacious"
                text={t(SelectTravelTokenTexts.faqs[n].question)}
                onPress={() => {
                  visibleFaqs[n] = !item;
                  setVisibleFaqs([...visibleFaqs]);
                }}
                icon={<ThemeIcon svg={item ? Remove : Add} />}
              />
              {item ? (
                <Sections.GenericItem type="spacious">
                  <ThemeText type="body__secondary">
                    {t(SelectTravelTokenTexts.faqs[n].answer)}
                  </ThemeText>
                </Sections.GenericItem>
              ) : undefined}
            </View>
          ))}
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
    paddingHorizontal: theme.spacings.large,
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
