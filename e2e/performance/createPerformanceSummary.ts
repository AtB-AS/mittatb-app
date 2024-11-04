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
  cpu: {
    avg: number;
    threads: {
      [thread: string]: number;
    };
  };
  fps: number;
  ram: number;
  score: number;
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

const iterationStatuses: string[] = performanceMeasures.iterations.map(
  (iteration) => iteration.status,
);

const getTestScore = (results: any): number => {
  return getScore(averageTestCaseResult(results));
};

const createSummary = (): void => {
  const status =
    testStatus === 'SUCCESS' &&
    iterationStatuses.filter((it) => it !== 'SUCCESS').length === 0;
  if (!status) {
    throw new Error("Status is NOT 'Success'");
  }

  const summary: SummaryType = {
    version: testedVersion,
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
