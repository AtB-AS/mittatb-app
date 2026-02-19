import {EstimatedCallWithQuayFragment} from '@atb/api/types/generated/fragments/estimated-calls';
import {findCommonSituationId} from '../utils';

describe('findCommonIds', () => {
  it('should find IDs that exist in all objects', () => {
    const data = [
      {situations: [{id: 'ID1'}]},
      {situations: [{id: 'ID1'}]},
      {situations: [{id: 'ID1'}, {id: 'ID2'}]},
    ] as EstimatedCallWithQuayFragment[];

    expect(findCommonSituationId(data)).toEqual(['ID1']);
  });

  it('should return multiple common IDs if they exist', () => {
    const data = [
      {situations: [{id: 'ID1'}, {id: 'ID2'}]},
      {situations: [{id: 'ID1'}, {id: 'ID2'}, {id: 'ID3'}]},
      {situations: [{id: 'ID2'}, {id: 'ID1'}]},
    ] as EstimatedCallWithQuayFragment[];

    const result = findCommonSituationId(data);
    expect(result).toHaveLength(2);
    expect(result).toContain('ID1');
    expect(result).toContain('ID2');
  });

  it('should return empty array when no IDs are common', () => {
    const data = [
      {situations: [{id: 'ID1'}]},
      {situations: [{id: 'ID2'}]},
      {situations: [{id: 'ID3'}]},
    ] as EstimatedCallWithQuayFragment[];

    expect(findCommonSituationId(data)).toEqual([]);
  });

  it('should return empty array when input is empty', () => {
    expect(findCommonSituationId([])).toEqual([]);
  });

  it('should return empty array when any object has empty situations', () => {
    const data = [
      {situations: [{id: 'ID1'}]},
      {situations: []}, // Empty situations
      {situations: [{id: 'ID1'}]},
    ] as EstimatedCallWithQuayFragment[];

    expect(findCommonSituationId(data)).toEqual([]);
  });

  it('should handle single object in array', () => {
    const data = [
      {situations: [{id: 'ONLY_ONE'}, {id: 'ANOTHER'}]},
    ] as EstimatedCallWithQuayFragment[];

    const result = findCommonSituationId(data);
    expect(result).toHaveLength(2);
    expect(result).toContain('ONLY_ONE');
    expect(result).toContain('ANOTHER');
  });

  it('should be case-sensitive', () => {
    const data = [
      {situations: [{id: 'ASDASDASD'}]},
      {situations: [{id: 'asdasdasd'}]}, // Different case
    ] as EstimatedCallWithQuayFragment[];

    expect(findCommonSituationId(data)).toEqual([]);
  });
});
