import {getUniqueTariffZones} from '../utils';
import {TariffZone} from '@atb/api/types/generated/journey_planner_v3_types';

describe('getUniqueTariffZones', () => {
  const r1 = ['Kristiansund'];
  it(`should return array containing: ${r1}.`, () => {
    const tariffZones = [
      {
        id: '1',
        name: 'Kristiansund',
      },
      // Add more test data here if needed
    ] as TariffZone[];

    expect(getUniqueTariffZones(tariffZones, [])).toStrictEqual(r1);
  });

  const r2 = ['Kristiansund'];
  it(`should return array containing: ${r2}.`, () => {
    const tariffZones = [
      {
        id: '1',
        name: 'Kristiansund',
      },
      {
        id: '2',
        name: 'Kristiansund',
      },
      // Add more test data here if needed
    ] as TariffZone[];

    expect(getUniqueTariffZones(tariffZones, [])).toStrictEqual(r2);
  });

  const r3 = ['Kristiansund', 'Molde'];
  it(`should return array containing: ${r3[0]} and ${r3[1]}`, () => {
    const tariffZones = [
      {
        id: '1',
        name: 'Kristiansund',
      },
      {
        id: '2',
        name: 'Molde',
      },
      // Add more test data here if needed
    ] as TariffZone[];

    expect(getUniqueTariffZones(tariffZones, [])).toStrictEqual(r3);
  });

  const r4: string[] = [];
  it(`should return empty array: [${r4}].`, () => {
    const tariffZones = [
      {
        id: '1',
      },
      // Add more test data here if needed
    ] as TariffZone[];

    expect(getUniqueTariffZones(tariffZones, [])).toStrictEqual(r4);
  });
});
