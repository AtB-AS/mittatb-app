import {
  clearAttestationRequirement,
  saveAttestationRequirement,
  setAttestationRequirementReporter,
  takeAttestationRequirement,
} from '../attestation-requirement';

const headers = (requirement?: string) => ({
  'atb-attestation-requirement': requirement,
});

describe('attestation requirement', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    clearAttestationRequirement();
    setAttestationRequirementReporter(undefined);
  });
  afterEach(() => jest.useRealTimers());

  it('keeps the requirement from the response header until it is taken', () => {
    saveAttestationRequirement(headers('requirement'));

    expect(takeAttestationRequirement()).toBe('requirement');
    expect(takeAttestationRequirement()).toBeUndefined();
  });

  it('ignores a missing or empty header', () => {
    saveAttestationRequirement(headers(undefined));
    saveAttestationRequirement(headers(''));

    expect(takeAttestationRequirement()).toBeUndefined();
  });

  it('forgets the requirement when cleared', () => {
    saveAttestationRequirement(headers('requirement'));
    clearAttestationRequirement();

    expect(takeAttestationRequirement()).toBeUndefined();
  });

  it('asks for a report after the current call, when asked to report soon', () => {
    const report = jest.fn();
    setAttestationRequirementReporter(report);
    saveAttestationRequirement(headers('requirement'), {reportSoon: true});

    // Not during the call, so the SDK finishes it first
    expect(report).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(report).toHaveBeenCalledTimes(1);
  });

  it('does not ask for a report unless asked to report soon', () => {
    const report = jest.fn();
    setAttestationRequirementReporter(report);
    saveAttestationRequirement(headers('requirement'));

    jest.runAllTimers();
    expect(report).not.toHaveBeenCalled();
  });

  it('does not ask for a report without a requirement', () => {
    const report = jest.fn();
    setAttestationRequirementReporter(report);
    saveAttestationRequirement(headers(undefined), {reportSoon: true});

    jest.runAllTimers();
    expect(report).not.toHaveBeenCalled();
  });

  it('does not ask for a report when the reporter is removed', () => {
    const report = jest.fn();
    setAttestationRequirementReporter(report);
    saveAttestationRequirement(headers('requirement'), {reportSoon: true});
    setAttestationRequirementReporter(undefined);

    jest.runAllTimers();
    expect(report).not.toHaveBeenCalled();
  });
});
