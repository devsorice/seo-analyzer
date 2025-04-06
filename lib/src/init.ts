import { BrowserService } from './services/BrowserService';
import { LighthouseService } from './services/LightHouseService';
import { ReportRepository } from './repository/ReportRepository';
import { config } from './config/config';
import { CrawlService } from './services/CrawlService';
import { PageAnalyzerService } from './services/PageAnalyzerService';
export class AppServices {
  browser = new BrowserService(config.browserDebugPort);
  lighthouse = new LighthouseService(this.browser.wsPort(), config.lighthouseCategories);
  reportRepo = new ReportRepository();
  pageAnalyzer = new PageAnalyzerService(this.browser);
  crawlService = new CrawlService(this.pageAnalyzer);
  
}

export const services = new AppServices();