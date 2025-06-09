export interface Offer {
  _id: string;
  offer_name: string;
  offer_rate_code: string;
  short_intro: string;
  desc: string;
  terms: string;
  email_text: string;
  image: {
    url: string;
    name: string;
    ext: string;
  };
  status: 'active' | 'inactive' | 'expired';
  cdate: string;
}

export type CreateOfferInput = Omit<Offer, '_id' | 'cdate'>;