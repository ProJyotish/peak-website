/** Curated candidate cities for purpose-based suggestions. */

export type CatalogCity = {
  name: string;
  country: string;
  lat: number;
  lon: number;
};

export const CATALOG_CITIES: CatalogCity[] = [
  { name: "Lisbon", country: "Portugal", lat: 38.72, lon: -9.14 },
  { name: "Barcelona", country: "Spain", lat: 41.39, lon: 2.17 },
  { name: "Paris", country: "France", lat: 48.86, lon: 2.35 },
  { name: "London", country: "United Kingdom", lat: 51.51, lon: -0.13 },
  { name: "Amsterdam", country: "Netherlands", lat: 52.37, lon: 4.9 },
  { name: "Berlin", country: "Germany", lat: 52.52, lon: 13.41 },
  { name: "Rome", country: "Italy", lat: 41.9, lon: 12.5 },
  { name: "Athens", country: "Greece", lat: 37.98, lon: 23.73 },
  { name: "Istanbul", country: "Turkey", lat: 41.01, lon: 28.98 },
  { name: "Dubai", country: "UAE", lat: 25.2, lon: 55.27 },
  { name: "Mumbai", country: "India", lat: 19.08, lon: 72.88 },
  { name: "Bengaluru", country: "India", lat: 12.97, lon: 77.59 },
  { name: "Delhi", country: "India", lat: 28.61, lon: 77.21 },
  { name: "Goa", country: "India", lat: 15.49, lon: 73.83 },
  { name: "Singapore", country: "Singapore", lat: 1.35, lon: 103.82 },
  { name: "Bangkok", country: "Thailand", lat: 13.76, lon: 100.5 },
  { name: "Bali", country: "Indonesia", lat: -8.34, lon: 115.09 },
  { name: "Tokyo", country: "Japan", lat: 35.68, lon: 139.69 },
  { name: "Seoul", country: "South Korea", lat: 37.57, lon: 126.98 },
  { name: "Sydney", country: "Australia", lat: -33.87, lon: 151.21 },
  { name: "Melbourne", country: "Australia", lat: -37.81, lon: 144.96 },
  { name: "Cape Town", country: "South Africa", lat: -33.92, lon: 18.42 },
  { name: "Nairobi", country: "Kenya", lat: -1.29, lon: 36.82 },
  { name: "Cairo", country: "Egypt", lat: 30.04, lon: 31.24 },
  { name: "New York", country: "USA", lat: 40.71, lon: -74.01 },
  { name: "Los Angeles", country: "USA", lat: 34.05, lon: -118.24 },
  { name: "San Francisco", country: "USA", lat: 37.77, lon: -122.42 },
  { name: "Austin", country: "USA", lat: 30.27, lon: -97.74 },
  { name: "Toronto", country: "Canada", lat: 43.65, lon: -79.38 },
  { name: "Vancouver", country: "Canada", lat: 49.28, lon: -123.12 },
  { name: "Mexico City", country: "Mexico", lat: 19.43, lon: -99.13 },
  { name: "São Paulo", country: "Brazil", lat: -23.55, lon: -46.63 },
  { name: "Buenos Aires", country: "Argentina", lat: -34.6, lon: -58.38 },
  { name: "Santiago", country: "Chile", lat: -33.45, lon: -70.67 },
  { name: "Reykjavik", country: "Iceland", lat: 64.15, lon: -21.94 },
  { name: "Zurich", country: "Switzerland", lat: 47.38, lon: 8.54 },
  { name: "Prague", country: "Czechia", lat: 50.08, lon: 14.44 },
  { name: "Stockholm", country: "Sweden", lat: 59.33, lon: 18.07 },
  { name: "Hong Kong", country: "China", lat: 22.32, lon: 114.17 },
  { name: "Kathmandu", country: "Nepal", lat: 27.72, lon: 85.32 },
];
