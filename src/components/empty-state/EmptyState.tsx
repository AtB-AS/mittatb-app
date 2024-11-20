import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {Button} from '@atb/components/button';
import {useTheme} from '@atb/theme';
import React from 'react';

export type EmptyStateProps = {
  title: string;
  details: string;
  illustrationComponent: JSX.Element;
  buttonProps?: {
    onPress: () => void;
    text: string;
  };
  testID?: string;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  details,
  illustrationComponent,
  buttonProps,
  testID,
}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const interactiveColor = theme.color.interactive[3];

  return (
    <View
      style={styles.emptyStateContainer}
      testID={testID ? `${testID}EmptyStateView` : 'emptyStateView'}
    >
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
      {buttonProps && (
        <Button
          interactiveColor={interactiveColor}
          text={buttonProps.text}
          mode="primary"
          onPress={buttonProps.onPress}
          compact={true}
          type="small"
        />
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  emptyStateContainer: {
    margin: theme.spacing.medium,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  emptyStateTitle: {
    marginTop: theme.spacing.xSmall,
    marginBottom: theme.spacing.xSmall,
    textAlign: 'center',
  },
  emptyStateDetails: {
    textAlign: 'center',
    marginBottom: theme.spacing.medium,
  },
}));
