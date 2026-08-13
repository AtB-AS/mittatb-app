import {ThemeText} from '@atb/components/text';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {JSX} from 'react';

type Props = {
  title: string | undefined;
  summary: string | undefined;
  image?: JSX.Element;
};

export const EndManualTripCard = ({title, summary, image}: Props) => {
  const styles = useStyle();

  return (
    <View style={styles.content}>
      {image && <View style={styles.imageContainer}>{image}</View>}
      <View style={styles.textContainer}>
        <ThemeText typography="body__m__strong">{title}</ThemeText>
        <ThemeText style={styles.summary}>{summary}</ThemeText>
      </View>
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  content: {
    flex: 1,
    padding: theme.spacing.medium,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.color.background.neutral[0].background,
    borderRadius: theme.border.radius.regular,
  },
  imageContainer: {
    marginRight: theme.spacing.medium,
    borderRadius: theme.border.radius.regular,
    padding: theme.border.radius.regular,
    overflow: 'hidden',
  },
  textContainer: {
    flex: 1,
  },
  summary: {
    marginTop: theme.spacing.xSmall,
  },
}));
