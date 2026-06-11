type VehicleLinkSource = {
  id: string;
  slug?: string | null;
};

export function getVehicleBookingIdentifier(
  vehicle: VehicleLinkSource,
): string | null {
  const identifier = vehicle.slug || vehicle.id;

  if (!identifier || identifier === "undefined") {
    return null;
  }

  return identifier;
}

export function getVehicleBookingUrl(
  vehicle: VehicleLinkSource,
  baseUrl?: string,
): string | null {
  const identifier = getVehicleBookingIdentifier(vehicle);
  if (!identifier) return null;

  const customerBaseUrl =
    baseUrl ||
    process.env.NEXT_PUBLIC_CUSTOMER_APP_URL ||
    "https://www.muvment.ng";

  return `${customerBaseUrl.replace(/\/$/, "")}/booking/details/${identifier}`;
}
