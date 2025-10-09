import {renderHook} from '@testing-library/react-native';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility';
import {UserBenefitsType} from '../api/api';
import {useIsEligibleForBenefit} from '../use-is-eligible-for-benefit';

const DEFAULT_MOCK_BENEFITS: UserBenefitsType[] = [];
let mockBenefits = DEFAULT_MOCK_BENEFITS;

const periodicTicketBenefits: UserBenefitsType[] = [
  {
    operator_id: 'YTR:Operator:trondheimbysykkel',
    benefit_types: ['free-unlock'],
  },
  {
    operator_id: 'HYR:Operator:Hyre',
    benefit_types: ['single-unlock'],
  },
];

const freeUseBenefits: UserBenefitsType[] = [
  {
    operator_id: 'YTR:Operator:trondheimbysykkel',
    benefit_types: ['free-use'],
  },
];

const trdBysykkelFreeUnlockOperatorBenefit: OperatorBenefitType = {
  id: 'free-unlock',
  headingWhenActive: [
    {lang: 'nob', value: 'Du har bysykler inkludert'},
    {lang: 'en', value: 'You have city bikes included'},
    {lang: 'nno', value: 'Du har bysyklar inkludert'},
  ],
  descriptionWhenActive: [
    {
      lang: 'nob',
      value:
        'Periodebilletten din inkluderer fri bruk av bysykler fra Trondheim Bysykkel.',
    },
    {
      lang: 'en',
      value:
        'Your periodic ticket includes free use of city bikes from Trondheim City Bike.',
    },
    {
      lang: 'nno',
      value:
        'Periodebilletten din inkluderer fri bruk av bysyklar frå Trondheim Bysykkel.',
    },
  ],
  headingWhenNotActive: [
    {lang: 'nob', value: 'Få bysykler inkludert'},
    {lang: 'en', value: 'Get city bikes included'},
    {lang: 'nno', value: 'Få bysyklar inkludert'},
  ],
  descriptionWhenNotActive: [
    {
      lang: 'nob',
      value:
        'Våre periodebilletter inkluderer fri bruk av bysykler fra Trondheim Bysykkel.',
    },
    {
      lang: 'en',
      value:
        'Our periodic tickets include free use of city bikes from Trondheim City Bike.',
    },
    {
      lang: 'nno',
      value:
        'Våre periodebillettar inkluderer fri bruk av bysyklar frå Trondheim Bysykkel.',
    },
  ],
  callToAction: {
    url: 'https://app.trondheimbysykkel.no/voucher/{VALUE_CODE}',
    name: [
      {lang: 'nob', value: 'Aktiver hos Trondheim Bysykkel'},
      {lang: 'en', value: 'Activate at Trondheim City Bike'},
      {lang: 'nno', value: 'Aktiver hos Trondheim Bysykkel'},
    ],
  },
  ticketDescription: [
    {
      lang: 'nob',
      value:
        'Billetten inkluderer fri bruk av bysykler fra Trondheim Bysykkel.',
    },
    {
      lang: 'en',
      value:
        'The ticket includes free use of city bikes from Trondheim City Bike.',
    },
    {
      lang: 'nno',
      value:
        'Billetten inkluderer fri bruk av bysyklar frå Trondheim Bysykkel.',
    },
  ],
  formFactors: ['BICYCLE'],
};

const trdBysykkelFreeUseOperatorBenefit: OperatorBenefitType = {
  id: 'free-use',
  headingWhenActive: [
    {lang: 'nob', value: 'Du har bysykler inkludert'},
    {lang: 'en', value: 'You have city bikes included'},
    {lang: 'nno', value: 'Du har bysyklar inkludert'},
  ],
  descriptionWhenActive: [
    {
      lang: 'nob',
      value:
        'Periodebilletten din inkluderer fri bruk av bysykler fra Trondheim Bysykkel.',
    },
    {
      lang: 'en',
      value:
        'Your periodic ticket includes free use of city bikes from Trondheim City Bike.',
    },
    {
      lang: 'nno',
      value:
        'Periodebilletten din inkluderer fri bruk av bysyklar frå Trondheim Bysykkel.',
    },
  ],
  headingWhenNotActive: [
    {lang: 'nob', value: 'Få bysykler inkludert'},
    {lang: 'en', value: 'Get city bikes included'},
    {lang: 'nno', value: 'Få bysyklar inkludert'},
  ],
  descriptionWhenNotActive: [
    {
      lang: 'nob',
      value:
        'Våre periodebilletter inkluderer fri bruk av bysykler fra Trondheim Bysykkel.',
    },
    {
      lang: 'en',
      value:
        'Our periodic tickets include free use of city bikes from Trondheim City Bike.',
    },
    {
      lang: 'nno',
      value:
        'Våre periodebillettar inkluderer fri bruk av bysyklar frå Trondheim Bysykkel.',
    },
  ],
  callToAction: {
    url: 'https://trondheimbysykkel.no/kjop/at-b-gratis',
    name: [
      {lang: 'nob', value: 'Aktiver hos Trondheim Bysykkel'},
      {lang: 'en', value: 'Activate at Trondheim City Bike'},
      {lang: 'nno', value: 'Aktiver hos Trondheim Bysykkel'},
    ],
  },
  ticketDescription: [
    {
      lang: 'nob',
      value:
        'Billetten inkluderer fri bruk av bysykler fra Trondheim Bysykkel.',
    },
    {
      lang: 'en',
      value:
        'The ticket includes free use of city bikes from Trondheim City Bike.',
    },
    {
      lang: 'nno',
      value:
        'Billetten inkluderer fri bruk av bysyklar frå Trondheim Bysykkel.',
    },
  ],
  formFactors: ['BICYCLE'],
};

const hyreSingleUnlockOperatorBenefit: OperatorBenefitType = {
  id: 'single-unlock',
  headingWhenActive: [
    {lang: 'nob', value: 'Du har bildeling fra Hyre inkludert'},
    {lang: 'en', value: 'You have car sharing from Hyre included'},
    {lang: 'nno', value: 'Du har bildeling frå Hyre inkludert'},
  ],
  descriptionWhenActive: [
    {
      lang: 'nob',
      value:
        'Periodebilletten din inkluderer 2 timer leiebil fra Hyre hver måned.',
    },
    {
      lang: 'en',
      value:
        'Your periodic ticket includes 2 hours of car rental from Hyre every month.',
    },
    {
      lang: 'nno',
      value:
        'Periodebilletten din inkluderer 2 timar leiebil frå Hyre kvar månad.',
    },
  ],
  headingWhenNotActive: [
    {lang: 'nob', value: 'Få 2 timer bildeling inkludert'},
    {lang: 'en', value: 'Get 2 hours free car sharing included'},
    {lang: 'nno', value: 'Få 2 timar bildeling inkludert'},
  ],
  descriptionWhenNotActive: [
    {
      lang: 'nob',
      value:
        'Våre periodebilletter inkluderer 2 timer leiebil fra Hyre hver måned.',
    },
    {
      lang: 'en',
      value:
        'Our periodic tickets include 2 hours of car rental from Hyre every month.',
    },
    {
      lang: 'nno',
      value:
        'Våre periodebillettar inkluderer 2 timar leiebil frå Hyre kvar månad.',
    },
  ],
  callToAction: {
    url: '{APP_URL}?voucher={VALUE_CODE}',
    name: [
      {lang: 'nob', value: 'Aktiver hos Hyre'},
      {lang: 'en', value: 'Activate at Hyre'},
      {lang: 'nno', value: 'Aktiver hos Hyre'},
    ],
  },
  ticketDescription: [
    {
      lang: 'nob',
      value: 'Billetten inkluderer 2 timer leiebil fra Hyre hver måned.',
    },
    {
      lang: 'en',
      value:
        'The ticket includes 2 hours free use of rental cars from Hyre each month.',
    },
    {
      lang: 'nno',
      value: 'Billetten inkluderer 2 timar leiebil frå Hyre kvar månad.',
    },
  ],
  formFactors: ['CAR'],
};

jest.mock('@atb/modules/configuration', () => ({
  useFirestoreConfigurationContext: () => ({
    benefitIdsRequiringValueCode: ['single-unlock', 'free-unlock'],
  }),
}));

jest.mock('../queries/use-user-benefits-query', () => ({
  useUserBenefitsQuery: () => ({
    data: [...mockBenefits],
    isLoading: false,
    isSuccess: true,
  }),
}));

describe('useIsEligibleForBenefit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBenefits = DEFAULT_MOCK_BENEFITS;
  });

  it('Should return isUserEligibleForBenefit=false if no user benefits, and require value code for type free-unlock', () => {
    const hook = renderHook(() =>
      useIsEligibleForBenefit(trdBysykkelFreeUnlockOperatorBenefit),
    );
    expect(hook.result.current.isUserEligibleForBenefit).toBe(false);
    expect(hook.result.current.benefitRequiresValueCodeToUnlock).toBe(true);
  });

  it('Should return isUserEligibleForBenefit=true with periodic ticket benefits, and require value code for type free-unlock', () => {
    mockBenefits = periodicTicketBenefits;
    const hook = renderHook(() =>
      useIsEligibleForBenefit(trdBysykkelFreeUnlockOperatorBenefit),
    );
    expect(hook.result.current.isUserEligibleForBenefit).toBe(true);
    expect(hook.result.current.benefitRequiresValueCodeToUnlock).toBe(true);
  });

  it('Should return isUserEligibleForBenefit=true if there are benefits, but dont require value code for type free-use', () => {
    mockBenefits = freeUseBenefits;
    const hook = renderHook(() =>
      useIsEligibleForBenefit(trdBysykkelFreeUseOperatorBenefit),
    );
    expect(hook.result.current.isUserEligibleForBenefit).toBe(true);
    expect(hook.result.current.benefitRequiresValueCodeToUnlock).toBe(false);
  });

  it('Should return isUserEligibleForBenefit=true if there are benefits, and require value code for type single-unlock', () => {
    mockBenefits = periodicTicketBenefits;
    const hook = renderHook(() =>
      useIsEligibleForBenefit(hyreSingleUnlockOperatorBenefit),
    );
    expect(hook.result.current.isUserEligibleForBenefit).toBe(true);
    expect(hook.result.current.benefitRequiresValueCodeToUnlock).toBe(true);
  });
});
