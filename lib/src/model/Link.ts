export class Link {
  constructor(
    public href: string,
    public text: string,
    public referrerPolicy: ReferrerPolicy,
    public rel: Rel,
    public target: Target
  ) {}

  toJson(): string {
    return JSON.stringify(this.toDictionary());
  }
  toDictionary(): Record<string, string> {
    return {
      href: this.href,
      text: this.text,
      referrerPolicy: this.referrerPolicy,
      rel: this.rel,
      target: this.target
    };
  }
}

export enum ReferrerPolicy {
  NoReferrer = 'no-referrer',
  NoReferrerWhenDowngrade = 'no-referrer-when-downgrade',
  Origin = 'origin',
  OriginWhenCrossOrigin = 'origin-when-cross-origin',
  SameOrigin = 'same-origin',
  StrictOriginWhenCrossOrigin = 'strict-origin-when-cross-origin',
  UnsafeUrl = 'unsafe-url'
}

export enum Rel {
  Alternate = 'alternate',
  Author = 'author',
  Bookmark = 'bookmark',
  External = 'external',
  Help = 'help',
  License = 'license',
  Next = 'next',
  Nofollow = 'nofollow',
  Noreferrer = 'noreferrer',
  Noopener = 'noopener',
  Prev = 'prev',
  Search = 'search',
  Tag = 'tag'
}

export enum Target {
  Blank = '_blank',
  Parent = '_parent',
  Self = '_self',
  Top = '_top'
} 