import {statusComparator} from '@atb/utils/status-comparator';
import {Statuses} from '@atb/theme';

describe('statusComparator', () => {
  it('Should return 0 if equal', async () => {
    expect(statusComparator('error', 'error')).toEqual(0);
    expect(statusComparator('warning', 'warning')).toEqual(0);
    expect(statusComparator('info', 'info')).toEqual(0);
    expect(statusComparator('valid', 'valid')).toEqual(0);
  });

  it('Should return -1 if first item of higher importance', async () => {
    expect(statusComparator('error', 'warning')).toEqual(1);
    expect(statusComparator('warning', 'valid')).toEqual(1);
    expect(statusComparator('warning', 'info')).toEqual(1);
    expect(statusComparator('info', 'valid')).toEqual(1);
  });

  it('Should return 1 if second item of higher importance', async () => {
    expect(statusComparator('warning', 'error')).toEqual(-1);
    expect(statusComparator('info', 'warning')).toEqual(-1);
    expect(statusComparator('valid', 'error')).toEqual(-1);
    expect(statusComparator('valid', 'info')).toEqual(-1);
  });

  it('Should sort list by importance', async () => {
    const list: Statuses[] = ['info', 'valid', 'error', 'warning', 'info'];
    list.sort(statusComparator);
    expect(list).toEqual(['valid', 'info', 'info', 'warning', 'error']);
  });
});
