import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';

export type EmptyStateProps = {
  title: string;
  details: string;
  illustrationComponent: JSX.Element;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  details,
  illustrationComponent,
}) => {
  const styles = useStyles();

  return (
    <View style={styles.emptyStateContainer}>
      {illustrationComponent}
      <ThemeText
        type="body__primary--bold"
        color="secondary"
        style={styles.emptyStateTitle}
      >
        {title}
      </ThemeText>
      <ThemeText
        type="body__secondary"
        color="secondary"
        style={styles.emptyStateDetails}
      >
        {details}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  emptyStateContainer: {
    margin: theme.spacings.medium,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  emptyStateTitle: {
    marginTop: theme.spacings.xSmall,
    marginBottom: theme.spacings.xSmall,
  },
  emptyStateDetails: {
    textAlign: 'center',
  },
}));
