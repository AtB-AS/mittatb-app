import React, {useState} from 'react';
import {FlatList, View} from 'react-native';
import {StyleSheet, Theme} from '@atb/theme';
import {useTranslation, InfoPromptTexts} from '@atb/translations';
import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';

type InfoPromptType = {
  variant: 'assistantv2';
};

const InfoPrompt = ({variant}: InfoPromptType) => {
  const [hidden, setHidden] = useState<boolean>(false);
  const styles = usePromptStyle();
  const {t} = useTranslation();

  if (hidden) return null;

  const isBulletPointsForVariant = !!InfoPromptTexts[variant].body.bulletPoints;

  const PossibleBulletPointList = isBulletPointsForVariant ? (
    <FlatList
      data={InfoPromptTexts[variant].body.bulletPoints}
      renderItem={({item}) => (
        <View style={styles.listItemContainer}>
          <ThemeText>{'\u2022'}</ThemeText>
          <ThemeText style={styles.bulletPoints}>{t(item)}</ThemeText>
        </View>
      )}
      scrollEnabled={false}
    />
  ) : null;

  return (
    <View style={styles.container}>
      <ThemeText type="heading__title" style={styles.marginBottom}>
        {t(InfoPromptTexts[variant].title)}
      </ThemeText>

      {PossibleBulletPointList}
      <ThemeText style={styles.marginTop}>
        {t(InfoPromptTexts[variant].body.text)}
      </ThemeText>

      <View style={styles.buttonRow}>
        <Button
          type="inline"
          text={t(InfoPromptTexts[variant].button)}
          onPress={() => setHidden(true)}
        />
      </View>
    </View>
  );
};

const usePromptStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    borderRadius: theme.border.radius.regular,
    backgroundColor: theme.colors.background_1.backgroundColor,
    marginBottom: theme.spacings.xLarge,
    padding: theme.spacings.xLarge,
  },
  listItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: theme.spacings.small,
    marginBottom: theme.spacings.small,
  },
  bulletPoints: {
    paddingLeft: theme.spacings.small,
  },
  marginTop: {
    marginTop: theme.spacings.medium,
  },
  marginBottom: {
    marginBottom: theme.spacings.medium,
  },
  buttonRow: {
    marginTop: theme.spacings.xLarge,
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  noThanks: {
    justifyContent: 'center',
    marginLeft: theme.spacings.large,
  },
}));

export default InfoPrompt;
