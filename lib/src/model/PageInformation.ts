import { Link } from "./Link";

export class PageInformation {
  constructor(
    public url: string,
    public metaDescription: string | null,
    public metaCanonical: string | null,
    public ogTitle: string | null,
    public ogDescription: string | null,
    public ogImage: string | null,
    public ogType: string | null,
    public twitterCard: string | null,
    public twitterTitle: string | null,
    public twitterDescription: string | null,
    public twitterImage: string | null,
    public articlePublishedTime: string | null,
    public articleModifiedTime: string | null,
    public title: string | null,
    public iconTag: string | null,
    public sitemapLink: string | null,
    public alternateLinks: string[],
    public h1: string | null,
    public internalLinks: Link[],
    public externalLinks: Link[],
    public inSiteMap: boolean,
    public linkedFromAnotherPage: boolean,
  ) {}

  toJson(): string {
    return JSON.stringify(this.toDictionary());
  }
  toDictionary(): Record<string, any> {
    return {
      url: this.url,
      metaDescription: this.metaDescription,
      metaCanonical: this.metaCanonical,
      ogTitle: this.ogTitle,
      ogDescription: this.ogDescription,
      ogImage: this.ogImage,
      ogType: this.ogType,
      twitterCard: this.twitterCard,
      twitterTitle: this.twitterTitle,
      twitterDescription: this.twitterDescription,
      twitterImage: this.twitterImage,
      articlePublishedTime: this.articlePublishedTime,
      articleModifiedTime: this.articleModifiedTime,
      title: this.title,
      iconTag: this.iconTag,
      sitemapLink: this.sitemapLink,
      alternateLinks: this.alternateLinks,
      h1: this.h1,
      internalLinks: this.internalLinks.map(link => link.toDictionary()),
      externalLinks: this.externalLinks.map(link => link.toDictionary()),
      inSiteMap: this.inSiteMap,
      linkedFromAnotherPage: this.linkedFromAnotherPage
    };
  }
} 