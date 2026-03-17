import {
  getTestimonialProps,
  getTestimonials,
} from "~/server/queries/testimonial";
import { TestimonialHeader } from "./testimonials/TestimonialHeader";
import { TestimonialCarousel } from "./testimonials/TestimonialCarousel";


interface ReviewsSectionProps {
  className?: string;
  id?: string;
}

export async function ReviewsSection({ id }: ReviewsSectionProps) {
  // Fetch both in parallel for better performance
  const [testimonialProps, reviews] = await Promise.all([
    getTestimonialProps(),
    getTestimonials(),
  ]);

  // Don't render section if no testimonials found
  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Fallbacks in case data is missing
  const title = testimonialProps?.title || "Lo Que Dicen Nuestros Clientes";
  const subtitle =
    testimonialProps?.subtitle ||
    "No solo tomes nuestra palabra. Escucha a algunos de nuestros clientes satisfechos.";

  // Transform reviews to the format expected by components
  const transformedReviews = reviews.map((testimonial) => ({
    id: testimonial.testimonialId.toString(),
    name: testimonial.name,
    role: testimonial.role ?? "",
    content: testimonial.content,
    avatar: testimonial.avatar ?? undefined,
    rating: testimonial.rating ?? 5,
  }));

  return (
    <section className="bg-gray-50 py-24" id={id}>
      <div className="container mx-auto px-4">
        <TestimonialHeader title={title} subtitle={subtitle} />
        <TestimonialCarousel testimonials={transformedReviews} />
      </div>
    </section>
  );
}
