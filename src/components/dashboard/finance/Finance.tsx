import Link from "next/link";

export default function Finance() {
  return (
    <div>
      <h1>Finance page</h1>
      <Link href="/dashboard/finance/bookings">Finance Booking</Link>
    </div>
  );
}
