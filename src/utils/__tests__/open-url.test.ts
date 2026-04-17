import {Linking} from 'react-native';
import {openUrl} from '../open-url';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';

jest.mock('react-native', () => ({
  Linking: {
    openURL: jest.fn(),
  },
}));

jest.mock('@atb/utils/bugsnag-utils', () => ({
  notifyBugsnag: jest.fn(),
}));

describe('openUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call Linking.openURL with the provided url', async () => {
    (Linking.openURL as jest.Mock).mockResolvedValue(undefined);

    await openUrl('https://example.com');

    expect(Linking.openURL).toHaveBeenCalledWith('https://example.com');
  });

  it('should not call notifyBugsnag on success', async () => {
    (Linking.openURL as jest.Mock).mockResolvedValue(undefined);

    await openUrl('https://example.com');

    expect(notifyBugsnag).not.toHaveBeenCalled();
  });

  it('should call notifyBugsnag with metadata on error', async () => {
    const error = new Error('Cannot open URL');
    (Linking.openURL as jest.Mock).mockRejectedValue(error);

    await openUrl('https://example.com');

    expect(notifyBugsnag).toHaveBeenCalledWith(error, {
      metadata: {
        url: 'https://example.com',
      },
      errorGroupHash: 'linkingOpenUrl',
    });
  });

  it('should call onError callback on error', async () => {
    (Linking.openURL as jest.Mock).mockRejectedValue(new Error('fail'));
    const onError = jest.fn();

    await openUrl('https://example.com', onError);

    expect(onError).toHaveBeenCalled();
  });

  it('should not throw if onError is not provided', async () => {
    (Linking.openURL as jest.Mock).mockRejectedValue(new Error('fail'));

    await expect(openUrl('https://example.com')).resolves.toBeUndefined();
  });
});
