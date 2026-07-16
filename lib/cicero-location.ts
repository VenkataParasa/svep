export const CICERO_POSTAL_PATTERN = /^\d{5}(?:-?\d{4})?$/;

export function isCiceroPostalCode(value: string) {
  return CICERO_POSTAL_PATTERN.test(value.trim());
}

export function setCiceroTextLocation(
  params: URLSearchParams,
  location: string,
  country = "US",
) {
  const value = location.trim();
  params.set(isCiceroPostalCode(value) ? "search_postal" : "search_loc", value);
  params.set("search_country", country);
}
