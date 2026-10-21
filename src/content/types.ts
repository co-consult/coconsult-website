export type Locale = 'fr' | 'en';

export type RouteKey =
  | 'home'
  | 'services'
  | 'dedicated'
  | 'qa'
  | 'payments'
  | 'automation'
  | 'ai'
  | 'software'
  | 'cloud'
  | 'cyber'
  | 'modes'
  | 'solutions'
  | 'cases'
  | 'about'
  | 'partnerships'
  | 'contact'
  | 'legal'
  | 'privacy';

export type InquiryId =
  | 'project'
  | 'team'
  | 'qaDiscuss'
  | 'qaTeam'
  | 'payments'
  | 'automation'
  | 'ai'
  | 'partnership'
  | 'demo';

export interface Inquiry {
  label: string;
  subject: string;
  body: string;
}

export interface TitledText {
  title: string;
  text: string;
}

export interface CardItem {
  kicker?: string;
  title: string;
  text: string;
  hrefKey?: RouteKey;
  inquiry?: InquiryId;
}

export interface ChallengeItem {
  id: string;
  label: string;
  expertise: string;
  expertiseKey: RouteKey;
  useCase: string;
  mode: string;
  inquiry: InquiryId;
}

export type Block =
  | { type: 'cards'; title: string; intro?: string; layout?: 'bento'; items: CardItem[] }
  | { type: 'challenge'; title: string; intro?: string; items: ChallengeItem[] }
  | { type: 'steps'; title: string; intro?: string; items: TitledText[] }
  | { type: 'columns'; title: string; intro?: string; layout?: 'rail'; items: TitledText[] }
  | { type: 'prose'; title?: string; paragraphs: string[] }
  | { type: 'list'; title: string; items: string[] }
  | { type: 'faq'; title: string; items: { q: string; a: string }[] }
  | { type: 'note'; text: string }
  | { type: 'diagram'; title: string; caption: string; steps: TitledText[] }
  | { type: 'work'; source: 'cases' | 'solutions'; title: string; intro?: string }
  | { type: 'inquiries'; title: string; intro?: string; ids: InquiryId[] }
  | { type: 'cta'; title: string; text: string; primary: InquiryId; secondary?: InquiryId };

export interface HeroVisual {
  facts: string[];
  diagramTitle: string;
  centerTitle: string;
  centerSub: string;
  nodes: [string, string, string, string];
  note: string;
}

export interface PageContent {
  key: RouteKey;
  metaTitle: string;
  description: string;
  eyebrow: string;
  h1: string;
  h1Accent?: string;
  intro: string;
  heroPrimary?: InquiryId;
  heroSecondary?: InquiryId;
  heroExplore?: boolean;
  hero?: HeroVisual;
  blocks: Block[];
}

export interface MailLink {
  label: string;
  subject: string;
  body: string;
}
