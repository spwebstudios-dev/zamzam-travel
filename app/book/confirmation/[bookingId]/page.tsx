// /book/confirmation/[bookingId] — Post-payment confirmation screen
// Shown after PayFast redirects the traveler back to our site.
export default function BookingConfirmationPage({
  params,
}: {
  params: { bookingId: string };
}) {
  return (
    <section className="px-5 md:px-16 py-16">
      <h1 className="font-serif text-4xl" style={{ color: 'var(--color-primary)' }}>
        Booking Confirmation — #{params.bookingId}
      </h1>
    </section>
  );
}
