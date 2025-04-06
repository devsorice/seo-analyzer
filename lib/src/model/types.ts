export interface ReportScores {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  }
  
  export interface LighthouseJSONReport {
    categories: {
      performance: { score: number };
      accessibility: { score: number };
      ['best-practices']: { score: number };
      seo: { score: number };
    };
    /* everything else coming from Lighthouse JSON */
    [key: string]: unknown;
  }

  export enum LighthouseCategory {
    Performance = 'performance',
    Accessibility = 'accessibility',
    BestPractices = 'best-practices',
    SEO = 'seo',
  }
  