import {ActivityIndicator, Linking, ScrollView} from 'react-native';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import React, {useEffect, useState} from 'react';
import {useAuthState} from '@atb/auth';
import {StyleSheet} from '@atb/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ThemeText} from '@atb/components/text';
import {Button} from '@atb/components/button';
import {FullScreenHeader} from '@atb/components/screen-header';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {spacings} from '@atb-as/theme';

type Props = RootStackScreenProps<'Root_LoadingScreen'>;

/*
 * Check whether the user creation is finished. After the first login the user
 * is created immediately at Firebase, but created asynchronously at Entur.
 * When receiving the user created callback from Entur then additional custom
 * claims get added to the user's id token. This method force refreshes the id
 * token and checks whether these custom claims have been set.
 *
 * Will retry up to 10 times with an interval of 1 second.
 */
export const Root_LoadingScreen = ({navigation}: Props) => {
  const {userCreationFinished, checkCustomClaims} = useAuthState();
  const styles = useThemeStyles();
  const [isLoading, setIsLoading] = useState(false); // should be true
  const {customer_service_url} = useRemoteConfig();

  useEffect(() => {
    let retryCount = 0;
    const retryCheckForCustomClaims = async () => {
      if (retryCount < 10) {
        console.log('retryCount: ' + retryCount);
        // if retry count 9 --> log to bugsnag that there must have been an error and then we need to investigate backend what happens or goes wrong
        retryCount++;
        await setTimeout(async () => {
          const hasCustomClaim = await checkCustomClaims();
          console.log('hasCustomClaim: ' + hasCustomClaim);
          if (!hasCustomClaim) retryCheckForCustomClaims();
        }, 5000);
      } else {
        setIsLoading(false);
      }
    };

    if (!userCreationFinished) {
      retryCheckForCustomClaims();
    } else {
      navigation.pop();
    }
  }, [userCreationFinished]);

  return isLoading ? (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.loadingContentContainer}
    >
      <>
        <ActivityIndicator size={'large'} />
        <ThemeText type="body__primary--bold" style={styles.text}>
          {'Vi jobber med saken :) ;)'}
        </ThemeText>
      </>
    </ScrollView>
  ) : (
    <>
      <FullScreenHeader title={'Noe gikk galt'} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.errorContentContainer}
      >
        <>
          <ThemeText style={styles.text}>
            {
              'Æsjda det ser ut som noe gikk litt galt her, prøv igjen senere eller kontakt kundeservice.'
            }
          </ThemeText>
          <Button
            rightIcon={{svg: ExternalLink}}
            onPress={() => Linking.openURL(customer_service_url)}
            text={'Kontakt kundeservice'}
          />
        </>
      </ScrollView>
    </>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => {
  const {top, bottom} = useSafeAreaInsets();
  return {
    container: {
      backgroundColor: theme.interactive.interactive_2.default.background,
      paddingTop: top,
      paddingBottom: bottom,
    },
    loadingContentContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      marginVertical: spacings.medium,
    },
    errorContentContainer: {
      paddingHorizontal: theme.spacings.xLarge,
    },
  };
});
