/*
Creates a summary of the performance measures from running flashlight. See '.github/workflows/test-performance-android.yml'
*/

import {
  averageTestCaseResult,
  getAverageCpuUsage,
  getAverageCpuUsagePerProcess,
  getAverageFPSUsage,
  getAverageRAMUsage,
  getScore,
} from '@perf-profiler/reporter';
import fs from 'fs';
import performanceMeasures from './performance_measures.json';

const testedVersion: string = process.env.TESTED_VERSION;

type cpuProcessItemType = {
  processName: string;
  cpuUsage: number;
};

type SummaryType = {
  version: string;
  status: string;
  results:
    | {
        cpu: {
          avg: number;
          threads: {
            [thread: string]: number;
          };
        };
        fps: number;
        ram: number;
        score: number;
      }
    | {};
};

/**
 * Iterations may have statuses:
 *    status: 'FAILURE'
 *    isRetriedIteration: true
 *    ==> Failure, but still retries left. Not part of summary nor 'flashlight report'
 *   status: 'FAILURE'
 *    ==> Failure, and no retries left. Not part of summary nor 'flashlight report'
 *   status: 'SUCCESS'
 *    ==> Success, and part of summary and 'flashlight report'
 */
const removeFailedIterations = (): any => {
  performanceMeasures.iterations = performanceMeasures.iterations.filter(
    (iter) => iter.status === 'SUCCESS',
  );
};

const getAvgCPU = (): number => {
  const avgPerIteration: number[] = performanceMeasures.iterations.map(
    (iteration) => getAverageCpuUsage(iteration.measures),
  );
  return average(avgPerIteration);
};

const average = (list: number[]): number => {
  const sum = list.reduce((a, b) => a + b, 0);
  return Math.round((sum / list.length) * 10 || 0) / 10;
};

const getAvgProcessCPU = (processName: string): number => {
  const cpuPerProcess: cpuProcessItemType[][] =
    performanceMeasures.iterations.map((iteration) =>
      getAverageCpuUsagePerProcess(iteration.measures),
    );
  const cpuUsage: number[] = cpuPerProcess.map(
    (iter) =>
      iter.filter((process) => process.processName === processName)[0].cpuUsage,
  );
  return average(cpuUsage);
};

const getAvgFPS = (): number => {
  const fps: number[] = performanceMeasures.iterations.map((iteration) =>
    getAverageFPSUsage(iteration.measures),
  );
  return average(fps);
};

const getAvgRAM = (): number => {
  const ram: number[] = performanceMeasures.iterations.map((iteration) =>
    getAverageRAMUsage(iteration.measures),
  );
  return average(ram);
};

const testStatus: string = performanceMeasures.status;

const getTestScore = (results: any): number => {
  return getScore(averageTestCaseResult(results));
};

const createSummary = (): void => {
  // Remove failed iterations - these are also not part of the 'flashlight report'
  removeFailedIterations();

  const summary: SummaryType = {
    version: testedVersion,
    status: testStatus,
    results: {},
  };

  if (testStatus === 'SUCCESS') {
    summary.results = {
      cpu: {
        avg: getAvgCPU(),
        threads: {
          'RN JS Thread': getAvgProcessCPU('mqt_js'),
          'Render Thread': getAvgProcessCPU('RenderThread'),
          'UI Thread': getAvgProcessCPU('UI Thread'),
          MapboxRenderThr: getAvgProcessCPU('MapboxRenderThr'),
        },
      },
      fps: getAvgFPS(),
      ram: getAvgRAM(),
      score: getTestScore(performanceMeasures),
    };
  }

  fs.writeFile(
    'performance_measures_summary.json',
    JSON.stringify(summary),
    (err) => {
      if (err) {
        throw new Error(`Error writing summary: ${err}`);
      } else {
        console.log('[INFO] Successfully wrote summary');
      }
    },
  );
};

createSummary();
