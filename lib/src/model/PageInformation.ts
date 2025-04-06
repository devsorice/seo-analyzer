import { Link } from "./Link";

export class PageInformation {
  constructor(
    public url: string,
    public metaDescription: string,
    public metaCanonical: string,
    public ogTitle: string,
    public ogDescription: string,
    public ogImage: string,
    public ogType: string,
    public twitterCard: string,
    public twitterTitle: string,
    public twitterDescription: string,
    public twitterImage: string,
    public articlePublishedTime: string,
    public articleModifiedTime: string,
    public title: string,
    public iconTag: string,
    public sitemapLink: string,
    public alternateLinks: string[],
    public h1: string,
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