import * as React from 'react';
import {StyleSheet} from '@atb/theme';
import {
  AccessibilityProps,
  Linking,
  TouchableOpacity,
  View,
} from 'react-native';
import ThemeText from '@atb/components/text';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

const NewsBanner: React.FC<{} & AccessibilityProps> = ({...props}) => {
  const style = useStyle();
  const {
    news_enabled,
    news_text,
    news_link_url,
    news_link_text,
  } = useRemoteConfig();

  if (!news_enabled) {
    return null;
  }

  return (
    <View style={style.container}>
      <ThemeText type={'body__primary'} style={style.text}>
        {news_text}
      </ThemeText>
      {news_link_url ? (
        <TouchableOpacity onPress={() => Linking.openURL(news_link_url)}>
          <ThemeText type="body__primary--underline" style={style.link}>
            {news_link_text}
          </ThemeText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    padding: theme.spacings.xLarge,
  },
  text: {
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    marginTop: theme.spacings.medium,
  },
}));

export default NewsBanner;
