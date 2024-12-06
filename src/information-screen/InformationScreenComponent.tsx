import {Theme} from '@atb/theme/colors';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme/StyleSheet';
import React from 'react';
import {Linking, View} from 'react-native';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';
import {LeftButtonProps} from '@atb/components/screen-header';

type InformationText = {
  type: 'text';
  text: string;
};
type InformationLink = {
  type: 'link';
  text: string;
  link: string;
};

type InformationHeading = {
  type: 'heading';
  text: string;
};

type InformationBulletPoint = {
  type: 'bullet-point';
  text: string;
};

export type InformationElement =
  | InformationText
  | InformationLink
  | InformationHeading
  | InformationBulletPoint;

type InformationProps = {
  information: InformationElement[];
  title: string;
  leftButton?: LeftButtonProps;
};

export const InformationScreenComponent: React.FC<InformationProps> = ({
  title,
  information,
  leftButton = {type: 'back', withIcon: true},
}) => {
  const styles = useStyles();

  const informationElements = information.map((item, index) => {
    switch (item.type) {
      case 'heading':
        return <Header text={item.text} key={index} />;
      case 'text':
        return <ThemeText key={index}>{item.text}</ThemeText>;
      case 'bullet-point':
        return (
          <ThemeText
            style={styles.bullet}
            key={index}
          >{`\u2022 ${item.text}`}</ThemeText>
        );
      case 'link':
        return <Link link={item} key={index} />;
    }
  });
  return (
    <FullScreenView
      headerProps={{title, leftButton}}
      parallaxContent={(focusRef) => (
        <ScreenHeading text={title} ref={focusRef} />
      )}
    >
      <View style={styles.content}>{informationElements}</View>
    </FullScreenView>
  );
};

const Header = ({text}: {text: string}) => {
  const styles = useStyles();
  return (
    <ThemeText style={styles.paragraphHeading} typography="heading__paragraph">
      {text}
    </ThemeText>
  );
};

const Link = ({link}: {link: InformationLink}) => {
  const styles = useStyles();

  return (
    <PressableOpacity
      style={styles.link}
      onPress={() => Linking.openURL(link.link ?? '')}
      accessibilityRole="link"
    >
      <ThemeText typography="body__primary--underline">{link.text}</ThemeText>
    </PressableOpacity>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  content: {
    padding: theme.spacing.medium,
  },
  paragraphHeading: {
    marginVertical: theme.spacing.medium,
  },
  bullet: {
    marginTop: theme.spacing.medium,
  },
  link: {
    marginTop: theme.spacing.medium,
  },
}));
