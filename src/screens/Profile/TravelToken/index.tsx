import {Edit} from '@atb/assets/svg/mono-icons/actions';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {StyleSheet, Theme} from '@atb/theme';
import {TravelTokenTexts, useTranslation} from '@atb/translations';
import TravelTokenBox from '@atb/travel-token-box';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ProfileScreenProps} from '../types';

type TravelCardScreenProps = ProfileScreenProps<'TravelToken'>;

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
        <TravelTokenBox showIfThisDevice={true} alwaysShowErrors={true} />
        <ChangeTokenButton
          onPress={() => navigation.navigate('SelectTravelToken')}
        />
        <FaqSection />
      </ScrollView>
    </View>
  );
}

const ChangeTokenButton = ({onPress}: {onPress: () => void}) => {
  const {t} = useTranslation();
  const styles = useStyles();

  const {isError, isLoading} = useMobileTokenContextState();

  return (
    <Sections.Section style={styles.changeTokenButton}>
      <Sections.LinkItem
        type="spacious"
        text={t(TravelTokenTexts.travelToken.changeTokenButton)}
        disabled={isError || isLoading}
        onPress={onPress}
        testID="switchTokenButton"
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
          expandContent={<ThemeText isMarkdown={true}>{t(answer)}</ThemeText>}
        />
      ))}
    </Sections.Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_accent_0.background,
    flex: 1,
  },
  scrollView: {
    padding: theme.spacings.medium,
  },
  errorMessage: {
    marginBottom: theme.spacings.medium,
  },
  changeTokenButton: {
    marginBottom: theme.spacings.medium,
  },
  faqSection: {
    marginBottom: theme.spacings.xLarge,
  },
}));
