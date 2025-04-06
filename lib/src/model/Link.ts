export class Link {
  constructor(
    public href: string,
    public text: string,
    public referrerPolicy: ReferrerPolicy | null,
    public rel: Rel[] | null,
    public target: Target | null
  ) {}

  toJson(): string {
    return JSON.stringify(this.toDictionary());
  }
  toDictionary(): Record<string, string | string[] | null> {
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

export const toReferrerPolicy = (value: string): ReferrerPolicy | null => {
  return Object.values(ReferrerPolicy).includes(value as ReferrerPolicy) ? (value as ReferrerPolicy) : null;
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
export const toRel = (value: string): Rel | null => {
    return Object.values(Rel).includes(value as Rel) ? (value as Rel) : null;
}

export enum Target {
  Blank = '_blank',
  Parent = '_parent',
  Self = '_self',
  Top = '_top'
} 

export const toTarget = (value: string): Target | null => {
  return Object.values(Target).includes(value as Target) ? (value as Target) : null;
}