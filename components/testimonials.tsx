import React from 'react';

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, FitnessBrand",
      image: "https://i.pravatar.cc/150?img=5",
      text: "Increased ROAS by 45% in 60 days. The AI recommendations are spot-on!",
      stars: 5
    },
    {
      name: "Mike Chen",
      role: "Marketing Director",
      image: "https://i.pravatar.cc/150?img=12",
      text: "Cut reporting time from 4 hours to 10 minutes. Game changer for our team.",
      stars: 5
    },
    {
      name: "Emily Davis",
      role: "Founder, DTC Brand",
      image: "https://i.pravatar.cc/150?img=9",
      text: "Managing campaigns across 4 platforms is finally easy. Highly recommend!",
      stars: 5
    }
  ];

  return (
    <section className="py-24 bg-slate-900">
      <h2 className="text-4xl font-bold text-white text-center mb-16">
        Trusted by 500+ Marketing Teams
      </h2>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {testimonials.map((testimonial, i) => (
          <div key={i} className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <img 
                src={testimonial.image} 
                className="h-12 w-12 rounded-full mr-3" 
                alt={testimonial.name} 
              />
              <div>
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-gray-400">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-3">"{testimonial.text}"</p>
            <div className="flex">
              {[...Array(testimonial.stars)].map((_, j) => (
                <span key={j} className="text-yellow-400">★</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
