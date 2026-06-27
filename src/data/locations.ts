export const ALL_LOCATIONS_ID = "all" as const;

export const LOCATIONS = [
  { id: ALL_LOCATIONS_ID, label: "All locations" },
  { id: "dindigul", label: "Dindigul" },
  { id: "madurai", label: "Madurai" },
  { id: "thanjavur", label: "Thanjavur" },
  { id: "pollachi", label: "Pollachi" },
  { id: "salem", label: "Salem" },
  { id: "elampillai", label: "Elampillai" },
  { id: "erode", label: "Erode" },
] as const;

export type LocationId = (typeof LOCATIONS)[number]["id"];

export function getCityFromAddress(address: string): string {
  const parts = address.split(",").map((p) => p.trim());
  const stateIdx = parts.findIndex((p) => p.includes("Tamil Nadu"));
  if (stateIdx > 0) return parts[stateIdx - 1];
  return parts[parts.length - 2] || parts[0] || "";
}

export function hotelMatchesLocation(address: string, locationId: string): boolean {
  if (locationId === ALL_LOCATIONS_ID) return true;
  const location = LOCATIONS.find((l) => l.id === locationId);
  if (!location) return true;
  return address.toLowerCase().includes(location.label.toLowerCase());
}
