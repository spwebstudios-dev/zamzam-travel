// /packages/[slug] — Package detail page
export default function PackageDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <section className="px-5 md:px-16 py-16">
      <h1 className="font-serif text-4xl" style={{ color: 'var(--color-primary)' }}>
        Package Detail: {params.slug}
      </h1>
    </section>
  );
}
