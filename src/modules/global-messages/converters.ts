import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {
  AppPlatform,
  GlobalMessageSchema,
  GlobalMessageType,
} from '@atb-as/utils';
import {appliesToAppVersion} from '@atb/utils/firestore-utils';
import {isDefined} from '@atb/utils/presence';
import {Platform} from 'react-native';
export function mapToGlobalMessages(
  result: FirebaseFirestoreTypes.QueryDocumentSnapshot<any>[],
): GlobalMessageType[] {
  if (!result) return [];
  return result
    .map((message) => mapToGlobalMessage(message.id, message.data()))
    .filter(isDefined);
}

function mapToGlobalMessage(
  id: string,
  result: any,
): GlobalMessageType | undefined {
  if (!result) return;
  result.id = id;
  if (result.endDate?.toMillis) {
    result.endDate = (
      result.endDate as FirebaseFirestoreTypes.Timestamp
    ).toMillis();
  }
  if (result.startDate?.toMillis) {
    result.startDate = (
      result.startDate as FirebaseFirestoreTypes.Timestamp
    ).toMillis();
  }

  const parseResult = GlobalMessageSchema.safeParse(result);

  if (!parseResult.success) {
    console.warn(
      `GlobalMessageRaw validation failed for id: ${id}, errors: ${JSON.stringify(
        parseResult.error.message,
      )}`,
    );
    return;
  }
  if (
    !appliesToAppVersion(
      parseResult.data.appVersionMin,
      parseResult.data.appVersionMax,
    )
  ) {
    return;
  }
  if (
    parseResult.data.appPlatforms &&
    !isAppPlatformValid(parseResult.data.appPlatforms)
  ) {
    return;
  }

  return parseResult.data;
}

function isAppPlatformValid(platforms: AppPlatform[]) {
  if (!platforms) return true;
  return !!platforms.find((platform) => platform === Platform.OS);
}
