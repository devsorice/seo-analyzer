import { PageInformation } from '../model/PageInformation';
import { BrowserService } from './BrowserService';
import { Link, ReferrerPolicy, Rel, Target } from '../model/Link';

export class PageAnalyzerService {
  constructor(private browserService: BrowserService) {}

  async analyzePage(url: string, linkedFromAnotherPage: boolean=false, inSiteMap: boolean=false): Promise<PageInformation> {
    const page = await this.browserService.loadPage(url);
    const metaDescription: string = await page.$eval('meta[name="description"]', el => el.getAttribute('content') || '') || '';
    const metaCanonical: string = await page.$eval('link[rel="canonical"]', el => el.getAttribute('href') || '') || '';
    const ogTitle: string = await page.$eval('meta[property="og:title"]', el => el.getAttribute('content') || '') || '';
    const ogDescription: string = await page.$eval('meta[property="og:description"]', el => el.getAttribute('content') || '') || '';
    const ogImage: string = await page.$eval('meta[property="og:image"]', el => el.getAttribute('content') || '') || '';
    const ogType: string = await page.$eval('meta[property="og:type"]', el => el.getAttribute('content') || '') || '';
    const twitterCard: string = await page.$eval('meta[name="twitter:card"]', el => el.getAttribute('content') || '') || '';
    const twitterTitle: string = await page.$eval('meta[name="twitter:title"]', el => el.getAttribute('content') || '') || '';
    const twitterDescription: string = await page.$eval('meta[name="twitter:description"]', el => el.getAttribute('content') || '') || '';
    const twitterImage: string = await page.$eval('meta[name="twitter:image"]', el => el.getAttribute('content') || '') || '';
    const articlePublishedTime: string = await page.$eval('meta[property="article:published_time"]', el => el.getAttribute('content') || '') || '';
    const articleModifiedTime: string = await page.$eval('meta[property="article:modified_time"]', el => el.getAttribute('content') || '') || '';
    const title: string = await page.title() || '';
    const iconTag: string = await page.$eval('link[rel="icon"]', el => el.getAttribute('href') || '') || '';
    const sitemapLink: string = await page.$eval('link[rel="sitemap"]', el => el.getAttribute('href') || '') || '';
    const alternateLinks: string[] = await page.$$eval('link[rel="alternate"]', els => els.map(el => el.getAttribute('href') || '')) || [];
    const h1: string = await page.$eval('h1', el => el.textContent || '') || '';

    const links = await page.$$eval('a', anchors => anchors.map(anchor => ({
      href: anchor.getAttribute('href') || '',
      referrerPolicy: anchor.getAttribute('referrerpolicy') || 'no-referrer',
      rel: anchor.getAttribute('rel') || '',
      target: anchor.getAttribute('target') || '_self'
    })));

    const internalLinks: Link[] = [];
    const externalLinks: Link[] = [];

    links.forEach(link => {
      const linkObj = new Link(
        link.href,
        ReferrerPolicy[link.referrerPolicy as keyof typeof ReferrerPolicy],
        Rel[link.rel as keyof typeof Rel],
        Target[link.target as keyof typeof Target]
      );
      if (link.href.startsWith(url)) {
        internalLinks.push(linkObj);
      } else {
        externalLinks.push(linkObj);
      }
    });

    return new PageInformation(
      url,
      metaDescription,
      metaCanonical,
      ogTitle,
      ogDescription,
      ogImage,
      ogType,
      twitterCard,
      twitterTitle,
      twitterDescription,
      twitterImage,
      articlePublishedTime,
      articleModifiedTime,
      title,
      iconTag,
      sitemapLink,
      alternateLinks,
      h1,
      internalLinks,
      externalLinks,
      inSiteMap,
      linkedFromAnotherPage
    );
  }
} 