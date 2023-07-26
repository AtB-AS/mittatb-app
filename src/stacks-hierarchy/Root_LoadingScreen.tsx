import {Text} from 'react-native';
import {Button} from '@atb/components/button';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import React, {useEffect} from 'react';
import {useAuthState} from '@atb/auth';

type Props = RootStackScreenProps<'Root_LoadingScreen'>;

export const Root_LoadingScreen = ({navigation}: Props) => {
  const {userCreationFinished, checkCustomClaims} = useAuthState();
  console.log('userCreationFinished :::' + userCreationFinished);

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
        }, 10000);
      }
    };
    console.log('userCreationFinished ' + userCreationFinished);

    if (!userCreationFinished) {
      retryCheckForCustomClaims();
    } else {
      console.log('CREATION finished, pop');
      navigation.pop();
    }
  }, [userCreationFinished]);

  return (
    <>
      <Text>{'Hello this is the new component'}</Text>
      <Button onPress={() => navigation.pop()} text={'Go back'} />
    </>
  );
};
