"use client";
import Link from "next/link";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import { FEATURES, STEPS, TESTIMONIALS } from "@/inngest/landing";
import Image from "next/image";
export default function LandingPage() {
  return (
    <div className="flex flex-col pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-100"></div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-cyan-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] bg-gradient-to-tr from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 text-center space-y-10 z-10 relative py-20">
          <div>
            <span className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 text-sm font-semibold border-0 shadow-lg rounded-full">
              <Sparkles className="w-4 h-4 mr-2" />
              Split expenses. Simplify life.
            </span>
          </div>

          <h1 className="mx-auto max-w-6xl text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent leading-[0.9] tracking-tight">
            Never fight over
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              who owes what
            </span>
          </h1>

          <p className="mx-auto max-w-[800px] text-gray-700 text-xl md:text-2xl leading-relaxed font-medium">
            The smartest way to track shared expenses, split bills effortlessly,
            and settle up instantly.
            
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 px-10 py-4 text-xl font-bold shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 border-0 rounded-xl text-white flex items-center hover:scale-105"
            >
              Start Splitting Now
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>

            <Link
              href="#how-it-works"
              className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-10 py-4 text-xl font-bold transition-all duration-300 bg-white/80 backdrop-blur-sm rounded-xl hover:scale-105"
            >
              See How It Works
            </Link>
          </div>

          {/* <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="font-semibold">500+ happy users</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300"></div> 
            <span className="font-semibold">✨ Free forever</span> 
            <div className="hidden sm:block w-px h-4 bg-gray-300"></div> 
            <span className="font-semibold">🇮🇳 Made in India</span>
          </div> */}
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
            <span className="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 text-white mb-6 border-0 px-4 py-2 rounded-full">
              Features that actually work
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              Everything you need to
              <br />
              split like a pro
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-600 text-xl md:text-2xl leading-relaxed font-medium">
              Built for Indian groups with features that make sense for how we
              actually split bills.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {FEATURES.map(({ title, Icon, bg, color, description }) => (
              <div
                key={title}
                className="group hover:scale-105 transition-all duration-500"
              >
                <div className="h-full hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm overflow-hidden relative rounded-2xl p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="flex flex-col items-center space-y-6 text-center h-full relative z-10">
                    <div
                      className={`rounded-2xl p-5 ${bg} group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <Icon className={`h-8 w-8 ${color}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors duration-300">
                      {title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section
        id="how-it-works"
        className="py-24 lg:py-32 bg-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/30 to-transparent"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-20">
            <span className="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 text-white mb-6 border-0 px-4 py-2 rounded-full">
              Simple as 1-2-3
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              Start splitting in
              <br />
              under 2 minutes
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-600 text-xl md:text-2xl leading-relaxed font-medium">
              No complex setup. No learning curve. Just simple expense splitting
              that works.
            </p>
          </div>

          <div className="grid gap-12 md:gap-16 lg:grid-cols-3 max-w-7xl mx-auto">
            {STEPS.map(({ label, title, description }, index) => (
              <div
                key={label}
                className="relative flex flex-col items-center text-center space-y-8 p-8 rounded-3xl hover:bg-gradient-to-b hover:from-emerald-50/50 hover:to-cyan-50/30 transition-all duration-500 group"
              >
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-3xl font-black text-white shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    {label}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full h-1 bg-gradient-to-r from-emerald-300 via-cyan-300 to-gray-200 transform translate-x-10 rounded-full"></div>
                  )}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-sm text-lg">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
            <span className="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 text-white mb-6 border-0 px-4 py-2 rounded-full">
              Happy Users
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              Loved by groups
              <br />
              across India
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {TESTIMONIALS.map(({ quote, name, role, image }) => (
              <div
                key={name}
                className="h-full hover:shadow-2xl hover:scale-105 transition-all duration-500 border-0 shadow-lg group bg-gradient-to-br from-white to-gray-50/50 overflow-hidden relative rounded-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="p-8 h-full flex flex-col justify-between relative z-10">
                  <div className="mb-8">
                    <div className="flex mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg italic font-medium">
                      &ldquo;{quote}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-14 w-14 rounded-full overflow-hidden border-3 border-emerald-100 shadow-lg bg-gradient-to-br from-emerald-100 to-cyan-100 relative">
                      <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{name}</p>
                      <p className="text-emerald-600 font-semibold">{role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-emerald-600 via-cyan-600 to-blue-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <div className="space-y-10">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Ready to end the
              <br />
              <span className="text-yellow-300">
                &ldquo;Who paid what?&rdquo;
              </span>
              <br />
              drama forever?
            </h2>
            <p className="mx-auto max-w-[600px] text-emerald-100 text-xl md:text-2xl leading-relaxed font-medium">
              Join thousands of Indian groups who have made splitting expenses
              completely stress‑free.
            </p>
            <div className="pt-4">
              <Link
                href="/dashboard"
                className="group bg-white text-emerald-600 hover:bg-gray-100 px-12 py-5 text-xl font-black shadow-2xl hover:shadow-white/25 transition-all duration-300 border-0 rounded-xl flex items-center mx-auto hover:scale-105 w-fit"
              >
                Start Your Free Account
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <p className="text-emerald-200 text-sm font-medium">
              ✨ No credit card required • ✨ Free forever • ✨ Setup in 30
              seconds
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-gray-500 text-lg">
            © {new Date().getFullYear()} Splitr. Made with ❤️ in India. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
