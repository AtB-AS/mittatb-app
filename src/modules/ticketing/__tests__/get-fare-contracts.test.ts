import {client} from '@atb/api';
import {getFareContracts} from '../api';

jest.mock('@atb/api', () => ({client: {get: jest.fn()}}));
// Avoid loading the whole ticketing module, which depends on native modules.
jest.mock('..', () => ({}));
jest.mock('@atb/modules/configuration', () => ({}));
jest.mock('@atb/utils/bugsnag-utils', () => ({notifyBugsnag: jest.fn()}));

const mockGet = client.get as jest.Mock;

const fareContract = {id: 'fc-1'};
jest.mock('@atb-as/utils', () => ({
  ...jest.requireActual('@atb-as/utils'),
  FareContractType: {safeParse: (data: unknown) => ({success: true, data})},
}));

describe('getFareContracts', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('does not send If-Modified-Since without a previous response', async () => {
    mockGet.mockResolvedValue({
      status: 200,
      data: {fareContracts: [fareContract]},
      headers: {},
    });

    await getFareContracts();

    expect(mockGet.mock.lastCall[1].headers).toBeUndefined();
  });

  it('sends If-Modified-Since from the previous response', async () => {
    mockGet.mockResolvedValue({
      status: 200,
      data: {fareContracts: [fareContract]},
      headers: {},
    });

    await getFareContracts({
      fareContracts: [],
      lastModified: 'Fri, 20 Nov 2026 08:30:43 GMT',
    });

    expect(mockGet.mock.lastCall[1].headers).toEqual({
      'If-Modified-Since': 'Fri, 20 Nov 2026 08:30:43 GMT',
    });
  });

  it('accepts 304 as a valid status', async () => {
    mockGet.mockResolvedValue({
      status: 200,
      data: {fareContracts: []},
      headers: {},
    });

    await getFareContracts();

    const {validateStatus} = mockGet.mock.lastCall[1];
    expect(validateStatus(200)).toBe(true);
    expect(validateStatus(304)).toBe(true);
    expect(validateStatus(404)).toBe(false);
  });

  it('returns the previous response on 304 Not Modified', async () => {
    mockGet.mockResolvedValue({status: 304, data: '', headers: {}});
    const previousResponse = {
      fareContracts: [fareContract],
      lastModified: 'Fri, 20 Nov 2026 08:30:43 GMT',
    } as any;

    const result = await getFareContracts(previousResponse);

    expect(result).toBe(previousResponse);
  });

  it('returns the fare contracts and Last-Modified on 200', async () => {
    mockGet.mockResolvedValue({
      status: 200,
      data: {fareContracts: [fareContract]},
      headers: {'last-modified': 'Fri, 20 Nov 2026 09:00:00 GMT'},
    });

    const result = await getFareContracts({
      fareContracts: [],
      lastModified: 'Fri, 20 Nov 2026 08:30:43 GMT',
    });

    expect(result).toEqual({
      fareContracts: [fareContract],
      lastModified: 'Fri, 20 Nov 2026 09:00:00 GMT',
    });
  });

  it('returns no Last-Modified if the header is missing', async () => {
    mockGet.mockResolvedValue({
      status: 200,
      data: {fareContracts: [fareContract]},
      headers: {},
    });

    const result = await getFareContracts();

    expect(result.lastModified).toBeUndefined();
  });
});
