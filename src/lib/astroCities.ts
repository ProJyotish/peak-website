/** Curated candidate cities for purpose-based suggestions. */

export type NearbyPopularPlace = {
  name: string;
  /** Short label such as beach, heritage, city — for display only. */
  kind?: string;
};

export type CatalogCity = {
  name: string;
  country: string;
  lat: number;
  lon: number;
  /** Well-known places near the city — names only, not an itinerary. */
  nearby: NearbyPopularPlace[];
};

export const CATALOG_CITIES: CatalogCity[] = [
  {
    name: "Lisbon",
    country: "Portugal",
    lat: 38.72,
    lon: -9.14,
    nearby: [
      { name: "Cascais", kind: "coast" },
      { name: "Sintra", kind: "heritage" },
      { name: "Porto", kind: "city" },
    ],
  },
  {
    name: "Barcelona",
    country: "Spain",
    lat: 41.39,
    lon: 2.17,
    nearby: [
      { name: "Girona", kind: "city" },
      { name: "Sitges", kind: "coast" },
      { name: "Montserrat", kind: "heritage" },
    ],
  },
  {
    name: "Paris",
    country: "France",
    lat: 48.86,
    lon: 2.35,
    nearby: [
      { name: "Versailles", kind: "heritage" },
      { name: "Reims", kind: "city" },
      { name: "Fontainebleau", kind: "heritage" },
    ],
  },
  {
    name: "London",
    country: "United Kingdom",
    lat: 51.51,
    lon: -0.13,
    nearby: [
      { name: "Oxford", kind: "city" },
      { name: "Brighton", kind: "coast" },
      { name: "Cambridge", kind: "city" },
    ],
  },
  {
    name: "Amsterdam",
    country: "Netherlands",
    lat: 52.37,
    lon: 4.9,
    nearby: [
      { name: "Haarlem", kind: "city" },
      { name: "Utrecht", kind: "city" },
      { name: "Rotterdam", kind: "city" },
    ],
  },
  {
    name: "Berlin",
    country: "Germany",
    lat: 52.52,
    lon: 13.41,
    nearby: [
      { name: "Potsdam", kind: "heritage" },
      { name: "Leipzig", kind: "city" },
      { name: "Dresden", kind: "city" },
    ],
  },
  {
    name: "Rome",
    country: "Italy",
    lat: 41.9,
    lon: 12.5,
    nearby: [
      { name: "Florence", kind: "heritage" },
      { name: "Naples", kind: "city" },
      { name: "Tivoli", kind: "heritage" },
    ],
  },
  {
    name: "Athens",
    country: "Greece",
    lat: 37.98,
    lon: 23.73,
    nearby: [
      { name: "Santorini", kind: "island" },
      { name: "Delphi", kind: "heritage" },
      { name: "Cape Sounion", kind: "coast" },
    ],
  },
  {
    name: "Istanbul",
    country: "Turkey",
    lat: 41.01,
    lon: 28.98,
    nearby: [
      { name: "Bursa", kind: "city" },
      { name: "Princess Islands", kind: "island" },
      { name: "Çanakkale", kind: "heritage" },
    ],
  },
  {
    name: "Dubai",
    country: "UAE",
    lat: 25.2,
    lon: 55.27,
    nearby: [
      { name: "Abu Dhabi", kind: "city" },
      { name: "Sharjah", kind: "city" },
      { name: "Al Ain", kind: "city" },
    ],
  },
  {
    name: "Mumbai",
    country: "India",
    lat: 19.08,
    lon: 72.88,
    nearby: [
      { name: "Pune", kind: "city" },
      { name: "Lonavala", kind: "hill" },
      { name: "Alibaug", kind: "coast" },
    ],
  },
  {
    name: "Bengaluru",
    country: "India",
    lat: 12.97,
    lon: 77.59,
    nearby: [
      { name: "Mysuru", kind: "heritage" },
      { name: "Coorg", kind: "nature" },
      { name: "Chennai", kind: "city" },
    ],
  },
  {
    name: "Delhi",
    country: "India",
    lat: 28.61,
    lon: 77.21,
    nearby: [
      { name: "Agra", kind: "heritage" },
      { name: "Jaipur", kind: "heritage" },
      { name: "Rishikesh", kind: "nature" },
    ],
  },
  {
    name: "Goa",
    country: "India",
    lat: 15.49,
    lon: 73.83,
    nearby: [
      { name: "Panaji", kind: "city" },
      { name: "Gokarna", kind: "coast" },
      { name: "Hampi", kind: "heritage" },
    ],
  },
  {
    name: "Singapore",
    country: "Singapore",
    lat: 1.35,
    lon: 103.82,
    nearby: [
      { name: "Johor Bahru", kind: "city" },
      { name: "Batam", kind: "island" },
      { name: "Malacca", kind: "heritage" },
    ],
  },
  {
    name: "Bangkok",
    country: "Thailand",
    lat: 13.76,
    lon: 100.5,
    nearby: [
      { name: "Ayutthaya", kind: "heritage" },
      { name: "Pattaya", kind: "coast" },
      { name: "Hua Hin", kind: "coast" },
    ],
  },
  {
    name: "Bali",
    country: "Indonesia",
    lat: -8.34,
    lon: 115.09,
    nearby: [
      { name: "Ubud", kind: "town" },
      { name: "Uluwatu", kind: "coast" },
      { name: "Gili Islands", kind: "island" },
    ],
  },
  {
    name: "Tokyo",
    country: "Japan",
    lat: 35.68,
    lon: 139.69,
    nearby: [
      { name: "Kyoto", kind: "heritage" },
      { name: "Yokohama", kind: "city" },
      { name: "Hakone", kind: "nature" },
    ],
  },
  {
    name: "Seoul",
    country: "South Korea",
    lat: 37.57,
    lon: 126.98,
    nearby: [
      { name: "Busan", kind: "city" },
      { name: "Jeju", kind: "island" },
      { name: "Incheon", kind: "city" },
    ],
  },
  {
    name: "Sydney",
    country: "Australia",
    lat: -33.87,
    lon: 151.21,
    nearby: [
      { name: "Blue Mountains", kind: "nature" },
      { name: "Bondi", kind: "coast" },
      { name: "Hunter Valley", kind: "nature" },
    ],
  },
  {
    name: "Melbourne",
    country: "Australia",
    lat: -37.81,
    lon: 144.96,
    nearby: [
      { name: "Great Ocean Road", kind: "coast" },
      { name: "Philip Island", kind: "nature" },
      { name: "Ballarat", kind: "city" },
    ],
  },
  {
    name: "Cape Town",
    country: "South Africa",
    lat: -33.92,
    lon: 18.42,
    nearby: [
      { name: "Stellenbosch", kind: "nature" },
      { name: "Hermanus", kind: "coast" },
      { name: "Garden Route", kind: "nature" },
    ],
  },
  {
    name: "Nairobi",
    country: "Kenya",
    lat: -1.29,
    lon: 36.82,
    nearby: [
      { name: "Maasai Mara", kind: "nature" },
      { name: "Mount Kenya", kind: "nature" },
      { name: "Mombasa", kind: "coast" },
    ],
  },
  {
    name: "Cairo",
    country: "Egypt",
    lat: 30.04,
    lon: 31.24,
    nearby: [
      { name: "Giza", kind: "heritage" },
      { name: "Alexandria", kind: "coast" },
      { name: "Luxor", kind: "heritage" },
    ],
  },
  {
    name: "New York",
    country: "USA",
    lat: 40.71,
    lon: -74.01,
    nearby: [
      { name: "Philadelphia", kind: "city" },
      { name: "Boston", kind: "city" },
      { name: "Hudson Valley", kind: "nature" },
    ],
  },
  {
    name: "Los Angeles",
    country: "USA",
    lat: 34.05,
    lon: -118.24,
    nearby: [
      { name: "San Diego", kind: "city" },
      { name: "Santa Barbara", kind: "coast" },
      { name: "Palm Springs", kind: "city" },
    ],
  },
  {
    name: "San Francisco",
    country: "USA",
    lat: 37.77,
    lon: -122.42,
    nearby: [
      { name: "Napa Valley", kind: "nature" },
      { name: "Berkeley", kind: "city" },
      { name: "Monterey", kind: "coast" },
    ],
  },
  {
    name: "Austin",
    country: "USA",
    lat: 30.27,
    lon: -97.74,
    nearby: [
      { name: "San Antonio", kind: "city" },
      { name: "Houston", kind: "city" },
      { name: "Fredericksburg", kind: "town" },
    ],
  },
  {
    name: "Toronto",
    country: "Canada",
    lat: 43.65,
    lon: -79.38,
    nearby: [
      { name: "Niagara Falls", kind: "nature" },
      { name: "Montreal", kind: "city" },
      { name: "Ottawa", kind: "city" },
    ],
  },
  {
    name: "Vancouver",
    country: "Canada",
    lat: 49.28,
    lon: -123.12,
    nearby: [
      { name: "Victoria", kind: "city" },
      { name: "Whistler", kind: "nature" },
      { name: "Banff", kind: "nature" },
    ],
  },
  {
    name: "Mexico City",
    country: "Mexico",
    lat: 19.43,
    lon: -99.13,
    nearby: [
      { name: "Puebla", kind: "city" },
      { name: "Taxco", kind: "heritage" },
      { name: "Teotihuacan", kind: "heritage" },
    ],
  },
  {
    name: "São Paulo",
    country: "Brazil",
    lat: -23.55,
    lon: -46.63,
    nearby: [
      { name: "Rio de Janeiro", kind: "coast" },
      { name: "Santos", kind: "coast" },
      { name: "Campos do Jordão", kind: "hill" },
    ],
  },
  {
    name: "Buenos Aires",
    country: "Argentina",
    lat: -34.6,
    lon: -58.38,
    nearby: [
      { name: "Montevideo", kind: "city" },
      { name: "Colonia", kind: "heritage" },
      { name: "Mendoza", kind: "nature" },
    ],
  },
  {
    name: "Santiago",
    country: "Chile",
    lat: -33.45,
    lon: -70.67,
    nearby: [
      { name: "Valparaíso", kind: "coast" },
      { name: "Viña del Mar", kind: "coast" },
      { name: "Cajón del Maipo", kind: "nature" },
    ],
  },
  {
    name: "Reykjavik",
    country: "Iceland",
    lat: 64.15,
    lon: -21.94,
    nearby: [
      { name: "Golden Circle", kind: "nature" },
      { name: "Blue Lagoon", kind: "nature" },
      { name: "Akureyri", kind: "city" },
    ],
  },
  {
    name: "Zurich",
    country: "Switzerland",
    lat: 47.38,
    lon: 8.54,
    nearby: [
      { name: "Lucerne", kind: "city" },
      { name: "Interlaken", kind: "nature" },
      { name: "Geneva", kind: "city" },
    ],
  },
  {
    name: "Prague",
    country: "Czechia",
    lat: 50.08,
    lon: 14.44,
    nearby: [
      { name: "Cesky Krumlov", kind: "heritage" },
      { name: "Karlovy Vary", kind: "city" },
      { name: "Vienna", kind: "city" },
    ],
  },
  {
    name: "Stockholm",
    country: "Sweden",
    lat: 59.33,
    lon: 18.07,
    nearby: [
      { name: "Uppsala", kind: "city" },
      { name: "Archipelago", kind: "island" },
      { name: "Gothenburg", kind: "city" },
    ],
  },
  {
    name: "Hong Kong",
    country: "China",
    lat: 22.32,
    lon: 114.17,
    nearby: [
      { name: "Macau", kind: "city" },
      { name: "Shenzhen", kind: "city" },
      { name: "Lantau", kind: "island" },
    ],
  },
  {
    name: "Kathmandu",
    country: "Nepal",
    lat: 27.72,
    lon: 85.32,
    nearby: [
      { name: "Pokhara", kind: "nature" },
      { name: "Bhaktapur", kind: "heritage" },
      { name: "Chitwan", kind: "nature" },
    ],
  },
];
