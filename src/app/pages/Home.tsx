"use client";
import { ScrollUp } from "@/components/common/ScrollUp";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { Music, ArrowRight, Globe, Waves, ChevronDown } from "lucide-react";

const highlights = [
  {
    icon: <Music className="h-6 w-6" />,
    title: "Fusion Musicale",
    description:
      "À la croisée des musiques du monde, TriBa MonDo façonne un langage sonore original, entre pulsations ancestrales et textures contemporaines.",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Chants du Monde",
    description:
      "Les chants venus des 7 coins du monde tracent une géographie sensible où se croisent aspirations et résonances.",
  },
  {
    icon: <Waves className="h-6 w-6" />,
    title: "Improvisation & Émotion",
    description:
      "Chaque concert est une expérience unique où l'improvisation crée des connexions profondes entre les musiciens et le public.",
  },
];

const themes = [
  "Amour",
  "Sensualité",
  "Divinité",
  "Éternité",
  "Arrachement",
  "Espace",
  "Chamanisme",
  "Sorcellerie",
  "Sauvagerie",
  "Nature",
  "Liberté",
  "Forces telluriques",
];

export function Home() {
  return (
    <div className="flex flex-col">
      <ScrollUp />

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/galerie/concert-1.png"
            alt="TriBa MonDo en concert"
            className="h-full w-full object-cover"
            fetchPriority="high"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 px-4 pt-20 sm:pt-20 md:pt-24 text-center">
          <div className="mx-auto max-w-4xl">
            <p
              className="electro-glitch mb-2 sm:mb-6 text-base sm:text-base md:text-sm font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] text-primary drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]"
              data-text="Fusions ancestrales x électro organique"
            >
              <span className="block sm:hidden">
                Fusions ancestrales
                <br />
                x électro organique
              </span>
              <span className="hidden sm:inline">
                Fusions ancestrales x électro organique
              </span>
            </p>
            <h1 className="font-chiller text-5xl sm:text-6xl font-bold leading-tight tracking-tight md:text-8xl lg:text-9xl">
              <span className="text-primary">TriBa</span>{" "}
              <span className="text-white">MonDo</span>
            </h1>
            <div className="neon-halo-container mx-auto mt-2 sm:mt-8 max-w-2xl">
              <p className="neon-glow-text text-sm sm:text-lg leading-relaxed md:text-xl">
                Trio musical qui fait dialoguer chants sources du monde et création originale avec une énergie électro contemporaine. Voix, percussions et textures électroniques s'entrelacent pour créer une pulsation organique, ancrée dans la mémoire et résolument actuelle.
              </p>
              <div className="neon-halo" aria-hidden="true" />
            </div>
            <div className="mt-4 sm:mt-10 mb-16 sm:mb-16 md:mb-20 flex flex-col items-center justify-center gap-2 sm:gap-4 sm:flex-row">
              <a
                href="/musique#videos"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-black transition-all hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20"
              >
                Écouter
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="/concerts"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-medium text-white transition-all hover:border-primary/50 hover:text-primary"
              >
                Prochains concerts
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce md:bottom-8">
          <ChevronDown className="h-10 w-10 text-primary/60 md:h-12 md:w-12" strokeWidth={1.5} />
        </div>
      </section>

      {/* Highlights Section */}
      <section className="border-t border-red-500/30 bg-gradient-to-b from-red-950/30 via-red-950/20 to-black pt-12 pb-24">
        <div className="container">
          <ScrollReveal direction="down" duration={1200}>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                Une fusion musicale qui se <span className="text-primary">vit</span>
              </h2>
              <div className="mt-6 space-y-4 text-white/60 leading-relaxed">
                <p>
                  À la croisée des musiques du monde, TriBa MonDo façonne un langage sonore 
                  original, entre pulsations ancestrales et textures contemporaines.
                </p>
                <p>
                  Trois musiciens issus de parcours multiples façonnent une musique libre, collective et 
                  mouvante explorant les sonorités et les univers urbains par l'improvisation et 
                  l'interaction.
                </p>
                <p>
                  Les chants venus des 7 coins du monde tracent 
                  une géographie sensible où se croisent aspirations 
                  et résonances.
                </p>
                <p className="text-white/70 italic">
                  Voix, rythmes et tambours invoquent l'invisible, 
                  relient les âmes et troublent le réel.
                </p>
                <p>
                  À travers ce dialogue permanent, le groupe donne naissance à une musique 
                  organique, vibrante, résolument contemporaine, tissée entre traditions réinventées et 
                  élans d'aujourd'hui.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {highlights.map((item, index) => {
              const cardImages = [
                "/images/cards/chants-monde.jpg",
                "/images/cards/fusion-musicale.jpg",
                "/images/cards/improvisation.jpg"
              ];
              const cardImage = cardImages[index];
              
              return (
                <ScrollReveal
                  key={index}
                  delay={index * 150}
                  direction={index === 0 ? "right" : index === 2 ? "left" : "up"}
                  scale={0.9}
                >
                  <div className="group [perspective:1000px]">
                    <div className="relative rounded-2xl border border-red-500/30 transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                      <div className="relative rounded-2xl bg-black/50 p-8 text-center backdrop-blur-sm [backface-visibility:hidden]">
                        <div className="mx-auto mb-4 inline-flex rounded-full bg-primary/10 p-3 text-primary">
                          {item.icon}
                        </div>
                        <h3
                          className="electro-neon-fluid mb-3 text-sm font-medium uppercase tracking-[0.3em] text-primary/80"
                          data-text={item.title}
                        >
                          {item.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-white/50">
                          {item.description}
                        </p>
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-black [transform:rotateY(180deg)] [backface-visibility:hidden]">
                        <img
                          src={cardImage}
                          alt={item.title}
                          className="h-full w-full rounded-2xl object-cover"
                          style={index === 2 ? { objectPosition: "center 30%" } : undefined}
                        />
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Themes Section */}
      <section className="border-t border-red-500/30 pt-24 pb-12">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <ScrollReveal>
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                Des thèmes <span className="text-primary">universels</span>
              </h2>
              <p className="mt-4 text-white/50">
                Nos chants explorent les grandes émotions humaines, tissant une géographie
                sensible et vibrante qui entremêle aspirations et résonances émotionnelles.
              </p>
            </ScrollReveal>

            <div className="mt-16 flex flex-wrap justify-center gap-3">
              {themes.map((theme, index) => (
                <ScrollReveal 
                  key={index} 
                  delay={index * 30} 
                  direction="up" 
                  scale={0.5} 
                  duration={600}
                >
                  <span
                    className="psychedelic-pill inline-block rounded-full border border-primary/40 bg-red-950/50 px-5 py-2 text-sm font-medium text-primary shadow-lg shadow-primary/10"
                  >
                    {theme}
                  </span>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Panoramic Image - Image 49 */}
      <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden border-y border-red-500/20 shadow-2xl shadow-primary/5">
        <img
          src="/images/galerie/image-49.png"
          alt="TriBa MonDo - Chants du monde et fusion organique"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </section>

      {/* Quote Section */}
      <section className="border-t border-red-500/30 bg-gradient-to-b from-black via-red-950/30 to-black py-24">
        <div className="container">
          <ScrollReveal direction="none" scale={1.1} duration={1500}>
            <div className="mx-auto max-w-3xl text-center">
              <blockquote className="font-display text-2xl font-light italic leading-relaxed text-white/70 md:text-3xl">
                "Par les voix, les rythmes et les tambours, nous invoquons l'invisible,
                relions les âmes et brouillons les frontières entre le réel et l'intangible."
              </blockquote>
              <div className="mt-8 h-px w-16 mx-auto bg-primary/40" />
              <p className="mt-4 text-sm tracking-wider text-primary/60">
                TriBa MonDo
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Repertoire preview */}
      <section className="border-t border-red-500/30 py-24">
        <div className="container">
          <ScrollReveal direction="up">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                Un répertoire <span className="text-primary">sans frontières</span>
              </h2>
              <p className="mt-4 text-white/50">
                De Trøllabundin (Eivør, Îles Féroé) à La Rosa Enflorece (tradition judéo-espagnole),
                d'Avenu Malkeinu (liturgie hébraïque) au Barbecue (samba brésilienne) —
                nos reprises et compositions voyagent à travers les cultures et les époques.
              </p>
              <a
                href="/musique"
                className="electro-cta group mt-8 inline-flex items-center gap-2 text-primary transition-all"
              >
                Découvrir notre musique
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
