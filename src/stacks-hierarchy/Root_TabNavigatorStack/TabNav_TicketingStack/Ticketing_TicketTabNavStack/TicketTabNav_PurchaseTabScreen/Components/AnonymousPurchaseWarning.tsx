import {MessageInfoBox} from '@atb/components/message-info-box';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import AnonymousPurchases from '@atb/translations/screens/subscreens/AnonymousPurchases';
import React from 'react';
import {View} from 'react-native';

export const AnonymousPurchaseWarning = ({onPress}: {onPress: () => void}) => {
  const {t} = useTranslation();
  const styles = useStyle();
  return (
    <View style={styles.warning}>
      <MessageInfoBox
        title={t(AnonymousPurchases.warning.title)}
        message={t(AnonymousPurchases.warning.message)}
        onPressConfig={{
          action: onPress,
          text: t(AnonymousPurchases.warning.checkHere),
        }}
        type="warning"
        isMarkdown={true}
        testID="anonymousWarning"
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
