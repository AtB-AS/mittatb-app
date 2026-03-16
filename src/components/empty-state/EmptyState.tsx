import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {Button} from '@atb/components/button';
import {useThemeContext} from '@atb/theme';
import React from 'react';

export type EmptyStateProps = {
  title: string;
  details: string;
  illustrationComponent: React.JSX.Element;
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
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[3];

  return (
    <View
      style={styles.emptyStateContainer}
      testID={testID ? `${testID}EmptyStateView` : 'emptyStateView'}
    >
      <View style={styles.emptyStateIllustration}>{illustrationComponent}</View>
      <ThemeText
        typography="body__m__strong"
        color="secondary"
        style={styles.emptyStateTitle}
      >
        {title}
      </ThemeText>
      <ThemeText
        typography="body__s"
        color="secondary"
        style={styles.emptyStateDetails}
      >
        {details}
      </ThemeText>
      {buttonProps && (
        <View>
          <Button
            expanded={false}
            interactiveColor={interactiveColor}
            text={buttonProps.text}
            mode="primary"
            onPress={buttonProps.onPress}
            type="small"
          />
        </View>
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
  emptyStateIllustration: {
    marginTop: theme.spacing.xLarge,
    marginBottom: theme.spacing.xLarge,
  },
}));
