import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { PageAnalyzerService } from './PageAnalyzerService';
import { PageInformation } from '../model/PageInformation';

export class CrawlService {

  constructor(private pageAnalyzer: PageAnalyzerService) {}

  async *crawlWebsite(url: string, visited: Set<string> = new Set(), isHomePage: boolean = false, inSitemap: boolean = false, inInternalLinks: boolean = false): AsyncGenerator<PageInformation> {
    if (visited.has(url)) {
      return;
    }
    visited.add(url);

    // Analyze the page
    const pageInfo = await this.pageAnalyzer.analyzePage(url, inInternalLinks, inSitemap);
    yield pageInfo;

    // Crawl sitemap if available (only for home page)
    if (pageInfo.sitemapLink && isHomePage) {
      const sitemapUrls = await this.sitemapUrls(pageInfo.sitemapLink);
      for (const sitemapUrl of sitemapUrls) {
        yield* this.crawlWebsite(sitemapUrl, visited, false, true, false);
      }
    }

    // Crawl internal links
    for (const link of pageInfo.internalLinks) {
      yield* this.crawlWebsite(link.href, visited, false, false, true);
    }
  }

  async sitemapUrls(sitemapUrl: string): Promise<string[]> {
    try {
      console.log(`Fetching sitemap index ${sitemapUrl}`);
      const { data } = await axios.get(sitemapUrl);
      const parsed = await parseStringPromise(data);

      if (parsed.sitemapindex) {
        // If it's a sitemap index, fetch each sitemap
        const sitemapUrls = parsed.sitemapindex.sitemap.map((s: any) => s.loc[0]);
        const allUrls = await Promise.all(sitemapUrls.map((url: string) => this.fetchSitemapUrls(url)));
        return allUrls.flat();
      } else if (parsed.urlset) {
        // If it's a regular sitemap, return the URLs
        return parsed.urlset.url.map((u: any) => u.loc[0]);
      }
    } catch {
      return [];
    }
    return [];
  }

  private async fetchSitemapUrls(sitemapUrl: string): Promise<string[]> {
    try {
      console.log(`Fetching sitemap ${sitemapUrl}`);
      const { data } = await axios.get(sitemapUrl);
      const parsed = await parseStringPromise(data);
      return parsed.urlset.url.map((u: any) => u.loc[0]);
    } catch {
      return [];
    }
  }
}