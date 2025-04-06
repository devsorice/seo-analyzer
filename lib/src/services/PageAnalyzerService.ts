import { PageInformation } from '../model/PageInformation';
import { BrowserService } from './BrowserService';
import { Link, ReferrerPolicy, Rel, Target } from '../model/Link';

export class PageAnalyzerService {
  constructor(private browserService: BrowserService) {}

  async analyzePage(url: string, linkedFromAnotherPage: boolean=false, inSiteMap: boolean=false): Promise<PageInformation> {
    const page = await this.browserService.loadPage(url);

    const getValue = async (selector: string): Promise<string | null> => {
      try {
        return await page.$eval(selector, el => el.getAttribute('content') || null);
      } catch {
        return null;
      }
    };

    const metaDescription = await getValue('meta[name="description"]');
    const metaCanonical = await getValue('link[rel="canonical"]');
    const ogTitle = await getValue('meta[property="og:title"]');
    const ogDescription = await getValue('meta[property="og:description"]');
    const ogImage = await getValue('meta[property="og:image"]');
    const ogType = await getValue('meta[property="og:type"]');
    const twitterCard = await getValue('meta[name="twitter:card"]');
    const twitterTitle = await getValue('meta[name="twitter:title"]');
    const twitterDescription = await getValue('meta[name="twitter:description"]');
    const twitterImage = await getValue('meta[name="twitter:image"]');
    const articlePublishedTime = await getValue('meta[property="article:published_time"]');
    const articleModifiedTime = await getValue('meta[property="article:modified_time"]');
    const title = await page.title() || null;
    const iconTag = await getValue('link[rel="icon"]');
    const sitemapLink = await getValue('link[rel="sitemap"]');
    const alternateLinks = await page.$$eval('link[rel="alternate"]', els => els.map(el => el.getAttribute('href') || '')) || [];
    const h1 = await page.$eval('h1', el => el.textContent || null).catch(() => null);

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