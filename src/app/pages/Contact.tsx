import { ScrollUp } from "@/components/common/ScrollUp";
import { Send, ExternalLink } from "lucide-react";

const socialLinks = [
  {
    name: "Instagram",
    handle: "@triba_mondo",
    url: "https://www.instagram.com/triba_mondo/",
  },
  {
    name: "Facebook",
    handle: "Triba Mondo",
    url: "https://www.facebook.com/61575204444067/",
  },
  {
    name: "YouTube",
    handle: "@TriBaMonDo",
    url: "https://www.youtube.com/@TriBaMonDo",
  },
  {
    name: "SoundCloud",
    handle: "tribamondo",
    url: "https://soundcloud.com/tribamondo",
  },
];

export function Contact() {
  return (
    <div className="flex flex-col">
      <ScrollUp />

      {/* Hero */}
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden pt-20 md:min-h-[60vh]">
        <div className="absolute inset-0">
          <img
            src="/images/galerie/concert-contact.png"
            alt="Contact TriBa MonDo"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/95" />
        </div>
        <div className="container relative z-10 pt-20 pb-0 text-center md:py-20">
          <p className="electro-glitch mb-4 text-sm font-medium uppercase tracking-[0.3em] text-primary/80" data-text="Restons en contact">
            Restons en contact
          </p>
          <h1 className="font-display text-5xl font-bold md:text-7xl">
            <span className="text-primary">Contact</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
            Pour vos événements, collaborations artistiques ou simplement
            pour échanger, n'hésitez pas à nous écrire.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="border-t border-red-500/30 bg-gradient-to-b from-red-950/30 via-red-950/20 to-black pt-4 pb-24 md:pt-12">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-red-500/30 bg-black/50 backdrop-blur-sm p-8 md:p-12">
              <p className="mb-6 text-center text-sm text-white/60">
                Pour toute demande de booking, collaboration ou information
              </p>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-white/80">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 text-white placeholder-white/30 transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/80">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 text-white placeholder-white/30 transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium text-white/80">
                    Sujet
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 text-white placeholder-white/30 transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Objet de votre message"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-white/80">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 text-white placeholder-white/30 transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Votre message..."
                  />
                </div>

                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-black transition-all hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20"
                >
                  Envoyer le message
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-white/40">
                Ou écrivez-nous directement à{" "}
                <a
                  href="mailto:tribamondo@gmail.com"
                  className="text-primary transition-colors hover:text-primary-light"
                >
                  tribamondo@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Suivez-nous sur les <span className="text-primary">réseaux</span>
            </h2>
            <p className="mt-4 text-white/50">
              Restez informés de nos actualités, concerts et nouvelles créations.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-2xl gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-red-500/30 bg-black/50 backdrop-blur-sm p-5 transition-all hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/20"
              >
                <div>
                  <h3 className="font-semibold transition-colors group-hover:text-primary">
                    {social.name}
                  </h3>
                  <p className="text-sm text-white/40">{social.handle}</p>
                </div>
                <ExternalLink className="h-5 w-5 text-white/20 transition-colors group-hover:text-primary" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
