export default function TestimonialsSection() {
    const testimonials = [
      {
        content: "JobTracker completely transformed my job search. The AI-powered features saved me countless hours.",
        author: "Sarah Johnson",
        role: "Software Engineer",
        company: "Tech Corp"
      },
      {
        content: "The application tracking system is intuitive and helped me stay organized throughout my job search.",
        author: "Michael Chen",
        role: "Product Manager",
        company: "StartUp Inc"
      },
      {
        content: "The cover letter generator is a game-changer. I got more responses after using JobTracker.",
        author: "Emily Rodriguez",
        role: "Marketing Specialist",
        company: "Creative Agency"
      }
    ];
  
    return (
      <section id="testimonials" className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-blue-600">Testimonials</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              See what our users are saying
            </p>
          </div>
          <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="space-y-8 rounded-2xl p-8 shadow-lg ring-1 ring-gray-200">
                  <p className="text-gray-600 leading-6">{testimonial.content}</p>
                  <div className="flex items-center gap-x-4">
                    <div className="flex-auto">
                      <h3 className="font-semibold text-gray-900">{testimonial.author}</h3>
                      <p className="text-gray-600">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }