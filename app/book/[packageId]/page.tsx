// /book/[packageId] — Booking form: date, group size, traveler details, document uploads
// Auth required — redirect to /login if not authenticated (implemented in a later step)
export default function BookingFormPage({
  params,
}: {
  params: { packageId: string };
}) {
  return (
    <section className="px-5 md:px-16 py-16">
      <h1 className="font-serif text-4xl" style={{ color: 'var(--color-primary)' }}>
        Booking Form — Package {params.packageId}
      </h1>
    </section>
  );
}
