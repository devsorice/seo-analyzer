import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { PageAnalyzerService } from './PageAnalyzerService';
import { PageInformation } from '../model/PageInformation';

export class CrawlService {

  constructor(private pageAnalyzer: PageAnalyzerService) {}

  async *crawlWebsite(url: string,  isHomePage: boolean = false, visited: Set<string> = new Set(), inSitemap: boolean = false, inInternalLinks: boolean = false): AsyncGenerator<PageInformation> {
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
      console.log(`Found ${sitemapUrls.length} sitemap urls`);
      for (const sitemapUrl of sitemapUrls) {
        console.log(`Crawling sitemap url ---> ${sitemapUrl}`);
        yield* this.crawlWebsite(sitemapUrl, false, visited, true, false);
      }
    }

    // Crawl internal links
    for (const link of pageInfo.internalLinks) {
      yield* this.crawlWebsite(link.href, false, visited, false, true);
    }
  }

  async sitemapUrls(sitemapUrl: string): Promise<string[]> {
    try {
      console.log(`Fetching sitemap index ${sitemapUrl}`);
      const { data } = await axios.get(sitemapUrl);
      const parsed = await parseStringPromise(data);

      if (parsed.sitemapindex) {
        // If it's a sitemap index, fetch each sitemap
        console.log(`It is a sitemap index and found ${parsed.sitemapindex.sitemap.length} sitemap urls`);
        const sitemapUrls = parsed.sitemapindex.sitemap.map((s: any) => s.loc[0]);
        const allUrls = await Promise.all(sitemapUrls.map((url: string) => this.fetchSitemapUrls(url)));
        return allUrls.flat();
      } else if (parsed.urlset) {
        // If it's a regular sitemap, return the URLs
        console.log(`It is a regular sitemap and found ${parsed.urlset.url.length} urls`);
        return parsed.urlset.url.map((u: any) => u.loc[0]);
      } else {
        console.log(`It is not a sitemap index or regular sitemap`);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching sitemap ${sitemapUrl}: ${error}`);
      return [];
    }
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