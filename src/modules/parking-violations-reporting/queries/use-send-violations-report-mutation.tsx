import {ErrorResponse} from '@atb-as/utils';
import {sendViolationsReport} from '@atb/api/mobility';
import {
  ViolationsReportQuery,
  ViolationsReportQueryResult,
} from '@atb/api/types/mobility';
import {useMutation} from '@tanstack/react-query';

export const useSendViolationsReportMutation = () =>
  useMutation<
    ViolationsReportQueryResult,
    ErrorResponse,
    ViolationsReportQuery
  >({
    mutationFn: (data) => sendViolationsReport(data),
  });
