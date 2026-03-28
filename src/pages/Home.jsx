import bulldozer from "../assets/bull dozer.jpg";
import concretMixer from "../assets/concret.jpg";
import forklifts from "../assets/Forklifts.jpg";
import excavator from "../assets/Excavator.webp";
import testimonial1 from "../assets/testimonials-1.jpg";
import testimonial2 from "../assets/testimonials-2.jpg";
import testimonial3 from "../assets/testimonials-3.jpg";
import nomoney from "../assets/no-money.png";
import decision from "../assets/decision.png";
import aggrement from "../assets/agreement.png";
import heroVideo from "../assets/Hero-video.mp4";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../context/AppContext";

function Home() {
  const { token } = useContext(MyContext);
  const isLoggedIn = Boolean(token || localStorage.getItem("token"));
  const getStartedTo = isLoggedIn ? "/Equipment" : "/Login";

  return (
    <div className="w-full overflow-x-hidden font-sans text-slate-900">
      <section className="relative flex min-h-[340px] items-center justify-center overflow-hidden bg-brand-900 px-4 py-20 sm:min-h-[420px] md:min-h-[480px] lg:py-32">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover blur-[2px]"
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Gradient Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-slate-700/30 via-slate-600/20 to-slate-700/30" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(45,212,191,0.12),transparent_50%)]" />

        {/* Content */}
        <div className="animate-fade-in-up relative z-10 mx-auto max-w-3xl px-2 text-center">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-white/80 sm:text-sm">
            Equipment rental · Trusted · Nationwide
          </p>
          <h1 className="font-heading mb-5 text-3xl font-extrabold leading-[1.15] text-white drop-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl">
            Welcome to Market Rental Place
          </h1>
          <p className="mb-10 max-w-xl mx-auto text-lg font-medium text-white/85 sm:text-xl md:text-2xl">
            Your one-stop shop for renting equipment
          </p>
          <Link to={getStartedTo}>
            <button
              type="button"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-500 to-brand-700 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-brand-900/40 ring-2 ring-white/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-900/50 active:scale-[0.98] motion-reduce:transform-none sm:px-10 sm:py-4 sm:text-lg"
            >
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 opacity-0 transition duration-500 group-hover:translate-x-full group-hover:opacity-100" />
            </button>
          </Link>
        </div>
      </section>

      <section className="border-b border-brand-100/80 bg-gradient-to-b from-white to-brand-50/40 py-14 sm:py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:gap-12 lg:px-8">
          {[
            {
              img: decision,
              title: "Wide Equipment Selection",
              text: "From power tools to heavy machinery, we have the right equipment for every job",
            },
            {
              img: aggrement,
              title: "Flexible Rental Terms",
              text: "Daily, weekly, or monthly rentals to fit your project timeline and budget. We offer flexible terms to suit your needs.",
            },
            {
              img: nomoney,
              title: "No Hidden Fees",
              text: "Our prices are transparent and no hidden fees for your peace of mind.",
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className="animate-fade-in-up group flex flex-col items-center rounded-2xl border border-brand-100/80 bg-white/80 p-8 text-center shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg motion-reduce:animate-none motion-reduce:transform-none"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <img
                src={item.img}
                alt=""
                className="animate-float-soft mb-6 h-24 w-auto object-contain transition duration-300 group-hover:scale-105 motion-reduce:animate-none sm:h-28"
              />
              <h3 className="font-heading mb-3 text-lg font-bold text-slate-900 sm:text-xl">{item.title}</h3>
              <p className="max-w-sm text-sm leading-relaxed text-slate-600 sm:text-base">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-14 px-4 py-12 sm:space-y-16 sm:px-6 sm:py-16 lg:space-y-20 lg:px-8 lg:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="animate-scale-in order-2 overflow-hidden rounded-2xl shadow-xl ring-1 ring-brand-100/50 lg:order-1">
            <img
              className="h-full w-full object-cover transition duration-700 ease-out hover:scale-[1.03]"
              src={bulldozer}
              alt="Bulldozer"
            />
          </div>
          <div className="animate-fade-in order-1 text-center lg:order-2 lg:text-left">
            <h2 className="font-heading mb-4 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">Bull Dozer</h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">
              A bulldozer, often referred to as a dozer, is a powerful piece of heavy equipment commonly used in construction, earth-moving,
              and other large-scale projects Bulldozers are used in construction, mining, and land clearing for tasks such as pushing large
              quantities of soil, sand, rubble, or other materials, grading land, and creating roads.
            </p>
          </div>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="animate-fade-in text-center lg:text-left">
            <h2 className="font-heading mb-4 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">concrete mixer</h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">
              A concrete mixer, also known as a cement mixer, is a machine that combines cement, aggregate (such as sand or gravel), and water
              to form concrete The most common type of concrete mixer uses a revolving drum to mix the components. The drum is equipped with
              blades or paddles that ensure the materials are thoroughly mixed.
            </p>
          </div>
          <div className="animate-scale-in overflow-hidden rounded-2xl shadow-xl ring-1 ring-brand-100/50">
            <img
              className="h-full w-full object-cover transition duration-700 ease-out hover:scale-[1.03]"
              src={concretMixer}
              alt="Concrete Mixer"
            />
          </div>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="animate-scale-in order-2 overflow-hidden rounded-2xl shadow-xl ring-1 ring-brand-100/50 lg:order-1">
            <img
              className="h-full w-full object-cover transition duration-700 ease-out hover:scale-[1.03]"
              src={forklifts}
              alt="Forklifts"
            />
          </div>
          <div className="animate-fade-in order-1 text-center lg:order-2 lg:text-left">
            <h2 className="font-heading mb-4 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">Fork Lifts</h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">
              A forklift is a powered industrial truck used to lift and move materials over short distances.Forklifts are used in warehouses,
              distribution centers, and manufacturing facilities for tasks such as loading and unloading trucks, stacking pallets, and
              transporting materials.{" "}
            </p>
          </div>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="animate-fade-in text-center lg:text-left">
            <h2 className="font-heading mb-4 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">Excavator</h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">
              An excavator is a heavy construction machine used for digging and moving large objects. Excavators are used in various applications
              such as digging trenches, holes, and foundations, material handling, demolition, dredging, and mining
            </p>
          </div>
          <div className="animate-scale-in overflow-hidden rounded-2xl shadow-xl ring-1 ring-brand-100/50">
            <img
              className="h-full w-full object-cover transition duration-700 ease-out hover:scale-[1.03]"
              src={excavator}
              alt="Excavator"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-brand-100 bg-gradient-to-b from-white to-brand-50/30 py-12 sm:py-16 md:py-20">
        <h2 className="animate-fade-in font-heading mb-10 text-center text-2xl font-bold text-slate-900 sm:mb-12 sm:text-3xl md:text-4xl">
          What Our Customers Say
        </h2>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:gap-10 lg:px-8">
          {[
            { img: testimonial1, name: "Margaret E", quote: '"Great service and quality equipment!"' },
            { img: testimonial2, name: "Fred S.", quote: '"Easy to rent and return."' },
            { img: testimonial3, name: "Sarah W.", quote: '"Thanks so much for making these free resources available to us"' },
          ].map((t, i) => (
            <div
              key={t.name}
              className="animate-fade-in-up group rounded-2xl border border-brand-100 bg-white p-6 text-center shadow-md transition duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-xl motion-reduce:transform-none sm:p-8"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <img
                src={t.img}
                alt=""
                className="mx-auto mb-4 h-20 w-20 rounded-full object-cover ring-4 ring-brand-100 shadow-md transition group-hover:ring-brand-200 sm:h-24 sm:w-24"
              />
              <h3 className="font-heading mb-2 font-bold text-slate-900">{t.name}</h3>
              <p className="text-sm italic text-slate-600 sm:text-base">{t.quote}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-brand-800 bg-gradient-to-r from-brand-900 via-slate-900 to-brand-950 py-10 text-center text-sm text-brand-100 sm:py-12">
        <p className="font-medium tracking-wide">Contact us: info@marketplace.com</p>
      </footer>
    </div>
  );
}

export default Home;
