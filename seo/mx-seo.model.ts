export declare type LinkDefinition = {
  charset?: string;
  crossorigin?: string;
  href?: string;
  hreflang?: string;
  media?: string;
  rel?: string;
  rev?: string;
  sizes?: string;
  target?: string;
  type?: string;
} & {
  [prop: string]: string;
};

export interface MxSeoConfig {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  slug?: string;
}
export enum MetaRobotsValues {
  INDEX = 'index',
  NOINDEX = 'noindex',
  FOLLOW = 'follow',
  NOFOLLOW = 'nofollow',
  NOARCHIVE = 'noarchive',
  NOSNIPPET = 'nosnippet',
  NOODP = 'noodp'
}
