function Contact() {
  const mapLink = "https://maps.app.goo.gl/GDtENEDToWvwZD7W8";

  return (
    <section id="contact" className="bg-black text-white px-6 py-24">

      <div className="max-w-4xl mx-auto text-center">

        <h2 className="text-4xl md:text-5xl font-semibold mb-6">
          Contact Us
        </h2>

        <p className="text-gray-400 mb-8 leading-relaxed">
          Velankanni Parish, JP Nagar
        </p>

        <div className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="tel:+917899608670"
            className="w-full rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-200 sm:w-auto"
          >
            Call Parish Preist
          </a>

          <a
            href="mailto:chancellor@mysorediocese.com"
            className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10 sm:w-auto"
          >
            Email Parish Priest
          </a>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2">
          <iframe
            title="Velankanni Parish location map"
            src="https://www.google.com/maps?q=Velankanni%20Church%2C%20N%20H%20Palya%2C%20Block%20A%2C%20JP%20Nagar%2C%20Mysuru%2C%20Karnataka%20570008&output=embed"
            className="h-64 w-full rounded-2xl border-0 md:h-80"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <a
          href={mapLink}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Open in Google Maps
        </a>

      </div>

    </section>
  );
}

export default Contact;
