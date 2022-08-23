import MessageBox from '@atb/components/message-box';
import AnonymousTicketPurchases from '@atb/translations/screens/subscreens/AnonymousTicketPurchases';
import {View} from 'react-native';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {useNavigation} from '@react-navigation/native';

const AnonymousPurchaseWarning = () => {
  const {t} = useTranslation();
  const styles = useStyle();
  const navigation = useNavigation();
  const navigateToConsequencesScreen = () => {
    navigation.navigate('ConsequencesFromTicketPurchase');
  };
  return (
    <View style={styles.warning}>
      <MessageBox
        title={t(AnonymousTicketPurchases.warning.title)}
        message={t(AnonymousTicketPurchases.warning.message)}
        onPress={navigateToConsequencesScreen}
        onPressText={t(AnonymousTicketPurchases.warning.checkHere)}
        type={'warning'}
        isMarkdown={true}
      />
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  warning: {
    marginTop: theme.spacings.large,
    paddingHorizontal: theme.spacings.medium,
  },
}));

export default AnonymousPurchaseWarning;
