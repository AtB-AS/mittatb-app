import {MessageBox} from '@atb/components/message-box';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import AnonymousPurchases from '@atb/translations/screens/subscreens/AnonymousPurchases';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {TicketingStackRootNavigationProps} from '../types';

const AnonymousPurchaseWarning = () => {
  const {t} = useTranslation();
  const styles = useStyle();
  const navigation = useNavigation<TicketingStackRootNavigationProps>();
  const navigateToConsequencesScreen = () => {
    navigation.navigate('ConsequencesFromPurchase');
  };
  return (
    <View style={styles.warning}>
      <MessageBox
        title={t(AnonymousPurchases.warning.title)}
        message={t(AnonymousPurchases.warning.message)}
        onPressConfig={{
          action: navigateToConsequencesScreen,
          text: t(AnonymousPurchases.warning.checkHere),
        }}
        type={'warning'}
        isMarkdown={true}
      />
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  warning: {
    marginTop: theme.spacings.xLarge,
    paddingHorizontal: theme.spacings.medium,
  },
}));

export default AnonymousPurchaseWarning;
