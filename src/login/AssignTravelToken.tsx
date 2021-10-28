import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView, View} from 'react-native';
import ThemeText from '@atb/components/text';
import {LeftButtonProps, RightButtonProps} from '@atb/components/screen-header';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {ThemeColor} from '@atb/theme/colors';
import {useNavigation} from '@react-navigation/native';

const themeColor: ThemeColor = 'background_gray';

export default function AssignTravelToken({
  headerLeftButton,
  headerRightButton,
}: {
  doAfterSubmit: () => void;
  headerLeftButton?: LeftButtonProps;
  headerRightButton?: RightButtonProps;
}) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const styles = useThemeStyles();
  const focusRef = useFocusOnLoad();

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={headerLeftButton}
        rightButton={headerRightButton}
        setFocusOnLoad={false}
        color={themeColor}
      />

      <ScrollView centerContent={true} contentContainerStyle={styles.mainView}>
        <View accessible={true} accessibilityRole="header" ref={focusRef}>
          <ThemeText
            type={'body__primary--jumbo--bold'}
            style={styles.title}
            color={themeColor}
          >
            Travel token
          </ThemeText>
        </View>
        <View accessible={true}>
          <ThemeText style={styles.description} color={themeColor}>
            Assignment of travel token
          </ThemeText>
        </View>
      </ScrollView>
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.colors[themeColor].backgroundColor,
    flex: 1,
  },
  mainView: {
    padding: theme.spacings.large,
  },
  title: {
    textAlign: 'center',
    marginVertical: theme.spacings.medium,
  },
  description: {
    marginVertical: theme.spacings.medium,
    textAlign: 'center',
  },
}));
