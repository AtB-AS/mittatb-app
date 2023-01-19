import {useCallback, useState} from 'react';
import analytics from '@react-native-firebase/analytics';
import {enrollIntoBetaGroups} from '@atb/api/enrollment';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

type UserProperties = {[key: string]: string | null};

export default function useEnroll() {
  const {refresh} = useRemoteConfig();

  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const onEnroll = useCallback(
    async function onEnroll(key: string) {
      setHasError(false);
      setIsLoading(true);
      try {
        const {data: enrollment} = await enrollIntoBetaGroups(key);
        if (enrollment && enrollment.status === 'ok') {
          const userProperties = enrollment.groups.reduce<UserProperties>(
            (acc, group) => ({...acc, [group]: 'true'}),
            {},
          );
          await analytics().setUserProperties(userProperties);
          refresh();
          setIsEnrolled(true);
        }
      } catch (err) {
        console.warn(err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [setHasError, setIsLoading, setIsEnrolled],
  );

  return {
    hasError,
    isLoading,
    isEnrolled,
    onEnroll,
  };
}
