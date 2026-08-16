// /book/[packageId]/pay — PayFast redirect step
// Constructs PayFast payment URL server-side and redirects the traveler.
// This route is intentionally thin — actual logic comes in a later step.
export default function PaymentRedirectPage({
  params,
}: {
  params: { packageId: string };
}) {
  return (
    <section className="px-5 md:px-16 py-16">
      <h1 className="font-serif text-4xl" style={{ color: 'var(--color-primary)' }}>
        Payment — Package {params.packageId}
      </h1>
    </section>
  );
}
