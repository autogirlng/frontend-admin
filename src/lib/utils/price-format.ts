export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    // Locale for Nigerian English
    style: "currency",
    currency: "NGN", // Currency code for Nigerian Naira
  }).format(price);
}
