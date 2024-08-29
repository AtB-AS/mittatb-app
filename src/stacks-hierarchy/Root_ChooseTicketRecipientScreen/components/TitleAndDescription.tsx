import {OnBehalfOfTexts, useTranslation} from '@atb/translations';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load.ts';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StaticColor} from '@atb/theme/colors.ts';
import {StyleSheet} from '@atb/theme';

export const TitleAndDescription = ({
  themeColor,
}: {
  themeColor: StaticColor;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const focusRef = useFocusOnLoad();
  return (
    <>
      <View accessible={true} accessibilityRole="header" ref={focusRef}>
        <ThemeText type="heading--big" color={themeColor} style={styles.title}>
          {t(OnBehalfOfTexts.chooseReceiver.title)}
        </ThemeText>
      </View>
      <View accessible={true}>
        <ThemeText
          type="body__primary"
          color={themeColor}
          style={styles.description}
        >
          {t(OnBehalfOfTexts.chooseReceiver.description)}
        </ThemeText>
      </View>
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  title: {marginTop: theme.spacing.medium, textAlign: 'center'},
  description: {
    textAlign: 'center',
    marginTop: theme.spacing.medium,
    marginBottom: theme.spacing.xLarge,
  },
}));
