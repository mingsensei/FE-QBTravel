interface DetailsSectionProps {
  title: string;
  content: string[];
}

export function DetailsSection({ title, content }: DetailsSectionProps) {
  return (
    <section className="py-12 lg:py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center">
            {title}
          </h2>
          <div className="space-y-6">
            {content.map((paragraph, index) => (
              <p key={index} className="text-lg text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}