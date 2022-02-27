import {StyleSheet, Theme} from '@atb/theme';
import {TravelTokenTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import ThemeText from '@atb/components/text';
import {View} from 'react-native';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import * as Sections from '@atb/components/sections';
import {Edit} from '@atb/assets/svg/mono-icons/actions';
import {RootStackParamList} from '@atb/navigation';
import {StackNavigationProp} from '@react-navigation/stack';
import {CompositeNavigationProp} from '@react-navigation/native';
import {ProfileStackParams} from '..';
import {ActiveTicketCard} from '@atb/screens/Ticketing/Tickets/TravelCardInformation';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import MessageBox from '@atb/components/message-box';
import {TraveltokenPhone} from '@atb/assets/svg/color/illustrations';

export type TravelCardNavigationProp = StackNavigationProp<
  ProfileStackParams,
  'TravelToken'
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
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(TravelTokenTexts.travelToken.header.title)}
        leftButton={{type: 'back'}}
      />
      <ScrollView style={styles.scrollView}>
        <ActiveTokenBox />
        <ChangeTokenButton
          onPress={() => navigation.navigate('SelectTravelToken')}
        />
        <FaqSection />
      </ScrollView>
    </View>
  );
}

const ActiveTokenBox = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {travelTokens, updateTravelTokens} = useMobileTokenContextState();

  if (!travelTokens) {
    return (
      <MessageBox
        type={'warning'}
        message={t(TravelTokenTexts.travelToken.errorMessages.tokensNotLoaded)}
        containerStyle={styles.errorMessage}
        onPress={updateTravelTokens}
      />
    );
  }

  if (!travelTokens.length) {
    return (
      <MessageBox
        type={'warning'}
        message={t(TravelTokenTexts.travelToken.errorMessages.emptyTokens)}
        containerStyle={styles.errorMessage}
        isMarkdown={true}
      />
    );
  }

  const inspectableToken = travelTokens.find((t) => t.inspectable);

  if (!inspectableToken) {
    return (
      <MessageBox
        type={'warning'}
        message={t(
          TravelTokenTexts.travelToken.errorMessages.noInspectableToken,
        )}
        containerStyle={styles.errorMessage}
        isMarkdown={true}
      />
    );
  }

  const title =
    inspectableToken.type === 'travelCard'
      ? t(TravelTokenTexts.travelToken.activeToken.type.tcard.title)
      : inspectableToken.name;

  const description =
    inspectableToken.type === 'travelCard'
      ? t(TravelTokenTexts.travelToken.activeToken.type.tcard.description)
      : t(TravelTokenTexts.travelToken.activeToken.type.mobile.description);

  const a11yLabel =
    inspectableToken.type === 'travelCard'
      ? t(TravelTokenTexts.travelToken.activeToken.type.tcard.a11yLabel)
      : t(
          TravelTokenTexts.travelToken.activeToken.type.mobile.a11yLabel(
            inspectableToken.name,
          ),
        );

  return (
    <View
      style={styles.activeTokenBox}
      accessible={true}
      accessibilityLabel={a11yLabel}
    >
      <ThemeText
        type="body__secondary"
        color="primary_2"
        style={styles.activeTokenBoxHeader}
      >
        {t(TravelTokenTexts.travelToken.activeToken.title)}
      </ThemeText>
      <ThemeText
        type="heading__title"
        color="primary_2"
        style={styles.activeTokenBoxType}
      >
        {title}
      </ThemeText>
      <View style={{display: 'flex', flexDirection: 'row'}}>
        {inspectableToken.type === 'travelCard' ? (
          <ActiveTicketCard
            cardId={inspectableToken.travelCardId || ''}
            color="primary_3"
          />
        ) : (
          <View style={{alignItems: 'center'}}>
            <TraveltokenPhone />
          </View>
        )}
        <ThemeText
          color="primary_2"
          style={{marginLeft: 12, marginTop: 36, flex: 1}}
        >
          {description}
        </ThemeText>
      </View>
    </View>
  );
};

const ChangeTokenButton = ({onPress}: {onPress: () => void}) => {
  const {t} = useTranslation();
  const styles = useStyles();

  const {travelTokens} = useMobileTokenContextState();

  return (
    <Sections.Section style={styles.changeTokenButton}>
      <Sections.LinkItem
        type="spacious"
        text={t(TravelTokenTexts.travelToken.changeTokenButton)}
        disabled={!travelTokens}
        onPress={onPress}
        icon={<ThemeIcon svg={Edit} />}
      />
    </Sections.Section>
  );
};

const FaqSection = () => {
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <Sections.Section style={styles.faqSection}>
      <Sections.HeaderItem text={t(TravelTokenTexts.travelToken.faq.title)} />
      {/*eslint-disable-next-line rulesdir/translations-warning*/}
      {TravelTokenTexts.travelToken.faqs.map(({question, answer}, index) => (
        <Sections.ExpandableItem
          key={index}
          text={t(question)}
          showIconText={false}
          expandContent={<ThemeText>{t(answer)}</ThemeText>}
        />
      ))}
    </Sections.Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.background_accent.backgroundColor,
    flex: 1,
  },
  scrollView: {
    padding: theme.spacings.medium,
  },
  errorMessage: {
    marginBottom: theme.spacings.medium,
  },
  activeTokenBox: {
    backgroundColor: theme.colors.primary_2.backgroundColor,
    padding: theme.spacings.xLarge,
    borderRadius: theme.border.radius.regular,
    marginBottom: theme.spacings.medium,
  },
  activeTokenBoxHeader: {
    marginBottom: theme.spacings.medium,
  },
  activeTokenBoxType: {
    marginBottom: theme.spacings.large,
  },
  changeTokenButton: {
    marginBottom: theme.spacings.medium,
  },
  faqSection: {
    marginBottom: theme.spacings.xLarge,
  },
}));
