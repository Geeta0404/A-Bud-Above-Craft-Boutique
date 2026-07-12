export type DeliveryZone = {
  name: string;
  description: string;
  freeOver: number;
  flatFee: number;
  hours: string;
  orderBy: string;
};

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    name: "Downtown & West End",
    description: "English Bay to Gastown, Yaletown to Coal Harbour.",
    freeOver: 50,
    flatFee: 6.99,
    hours: "11am – 8pm daily",
    orderBy: "7:00 PM",
  },
  {
    name: "Kitsilano & Point Grey",
    description: "West 4th to UBC, Jericho Beach to Granville Island.",
    freeOver: 50,
    flatFee: 6.99,
    hours: "11am – 8pm daily",
    orderBy: "7:00 PM",
  },
  {
    name: "East Vancouver",
    description: "Main Street to Commercial Drive, Mount Pleasant to Hastings-Sunrise.",
    freeOver: 50,
    flatFee: 6.99,
    hours: "11am – 8pm daily",
    orderBy: "7:00 PM",
  },
  {
    name: "Richmond",
    description: "Steveston to Bridgeport, City Centre to Terra Nova.",
    freeOver: 60,
    flatFee: 8.99,
    hours: "12pm – 7pm daily",
    orderBy: "5:00 PM",
  },
  {
    name: "Burnaby",
    description: "Metrotown to Brentwood, Deer Lake to SFU.",
    freeOver: 60,
    flatFee: 8.99,
    hours: "12pm – 7pm daily",
    orderBy: "5:00 PM",
  },
];
