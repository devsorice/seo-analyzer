import lighthouse from 'lighthouse';
import { LighthouseJSONReport, ReportScores } from '../model/types';
import { LighthouseCategory } from '../model/types';

export class LighthouseService {
  constructor(private port: number, private categories: LighthouseCategory[]) {}

  async audit(url: string): Promise<{ raw: LighthouseJSONReport; scores: ReportScores }> {
    const runnerResult = await lighthouse(url, {
      port: this.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: this.categories,
    });

    const raw = runnerResult?.lhr as unknown as LighthouseJSONReport;
    const scores: ReportScores = {
      performance: raw.categories.performance.score * 100,
      accessibility: raw.categories.accessibility.score * 100,
      bestPractices: raw.categories['best-practices'].score * 100,
      seo: raw.categories.seo.score * 100,
    };
    return { raw, scores };
  }
}