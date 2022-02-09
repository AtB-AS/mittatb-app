import {Theme} from '@atb-as/theme';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import ThemeText from '@atb/components/text';
import StyleSheet from '@atb/theme/StyleSheet';
import React from 'react';
import {Linking, ScrollView, TouchableOpacity, View} from 'react-native';

type Header = {
  element: JSX.Element;
};

type Information = {
  type: string;
  text: string;
  link?: string;
};
type InformationProps = {
  informations: Information[];
  title: string;
};

const Info: React.FC<InformationProps> = ({
  children,
  title,
  informations,
  ...props
}) => {
  const styles = useStyles();

  const paymentElements = informations.map((item) => {
    switch (item.type) {
      case 'heading':
        return (
          <ThemeText style={styles.paragraphHeading} type="heading__paragraph">
            {item.text}
          </ThemeText>
        );
      case 'text':
        return <ThemeText>{item.text}</ThemeText>;
      case 'bullet-point':
        return (
          <ThemeText style={styles.bullet}>{`\u2022 ${item.text}`}</ThemeText>
        );
      case 'link':
        return (
          <TouchableOpacity
            style={styles.link}
            onPress={() => Linking.openURL(item.link ?? '')}
            accessibilityRole="button"
          >
            <ThemeText type="body__primary--underline">{item.text}</ThemeText>
          </TouchableOpacity>
        );
      default:
        return <ThemeText>{item.text}</ThemeText>;
    }
  });
  return (
    <View style={styles.container}>
      <FullScreenHeader title={title} leftButton={{type: 'back'}} />
      <ScrollView contentContainerStyle={styles.content}>
        {paymentElements}
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.background_1.backgroundColor,
    flex: 1,
  },
  content: {
    padding: theme.spacings.medium,
  },
  paragraphHeading: {
    marginVertical: theme.spacings.medium,
  },
  bullet: {
    marginTop: theme.spacings.medium,
  },
  paragraphSpace: {
    marginTop: theme.spacings.medium,
  },
  link: {
    marginTop: theme.spacings.medium,
  },
}));

export default Info;
