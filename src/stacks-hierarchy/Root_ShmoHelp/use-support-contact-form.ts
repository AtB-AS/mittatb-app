import {useState} from 'react';
import {
  SendSupportRequestBodyInput,
  SendSupportRequestBodySchema,
  SupportType,
} from '@atb/api/types/mobility';
import {useAuthContext} from '@atb/modules/auth';
import {getParsedPrefixAndPhoneNumber} from '@atb/utils/phone-number-utils';
import {getCurrentCoordinatesGlobal} from '@atb/modules/geolocation';
import {useProfileQuery} from '@atb/queries';
import {CustomerProfile} from '@atb/api/types/profile';

//Moved out from Root_ContactShmoOperatorScreen to be reused in damage and support forms

export const validateSchema = (
  body: SendSupportRequestBodyInput,
  schema: typeof SendSupportRequestBodySchema = SendSupportRequestBodySchema,
) => {
  const result = schema.safeParse(body);
  const formattedErrors = result.success ? undefined : result?.error?.format();
  return {
    isCommentValid: !formattedErrors?.comment?._errors?.length,
    isPhoneNumberValid:
      !formattedErrors?.contactInformationEndUser?.phone?._errors?.length,
    isEmailValid:
      !formattedErrors?.contactInformationEndUser?.email?._errors?.length,
    isAllInputValid: result.success,
    validatedRequestBody: result.success ? result.data : undefined,
  };
};

//Moved out from Root_ContactShmoOperatorScreen to be reused in damage and support forms
export const useSupportContactForm = (
  supportType: SupportType,
  schema: typeof SendSupportRequestBodySchema = SendSupportRequestBodySchema,
) => {
  const {phoneNumber: authPhoneNumberWithPrefix} = useAuthContext();
  const {prefix: authPhonePrefix, phoneNumber: authPhoneNumber} =
    getParsedPrefixAndPhoneNumber(authPhoneNumberWithPrefix);

  const [requestBody, setRequestBody] = useState<SendSupportRequestBodyInput>({
    supportType,
    comment: '',
    contactInformationEndUser: {
      phonePrefix: authPhonePrefix ?? '47',
      phoneNumber: authPhoneNumber ?? '',
      email: '',
    },
  });

  // The logged in profile's email saves the user typing it again.
  useProfileQuery((data: CustomerProfile) =>
    setRequestBody((prev) => ({
      ...prev,
      contactInformationEndUser: {
        ...prev.contactInformationEndUser,
        email: data?.email,
      },
    })),
  );

  const [showError, setShowError] = useState(false);

  return {
    requestBody,
    setRequestBody,
    showError,
    setShowError,
    ...validateSchema(requestBody, schema),
  };
};

export const getCurrentPlace = () => {
  const coordinates = getCurrentCoordinatesGlobal();
  if (!coordinates) return undefined;

  return {
    place: {
      coordinates: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
    },
  };
};
