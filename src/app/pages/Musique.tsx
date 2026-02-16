import { ScrollUp } from "@/components/common/ScrollUp";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { Play, Disc3, Download } from "lucide-react";

import { tracks as staticTracks } from "@/app/data";

const influences = [
  "TribalTrans", "Séfarade", "Hébraïque", "Flamenco", "Syrien", "Afrique centrale",
  "Andes", "Aborigène d’Australie", "Tibet", "Nordique", "Mystique", "Îles Féroé",
  "Rituel", "Électro", "Organique", "Polyrythmie", "Fusion", "Contemporain",
  "Improvisation", "Cosmogonie", "Transculturel", "Pulsation", "Tellurique",
  "Liberté", "Ancrage", "Souffle", "Chamanisme",
];

export function Musique({ videos: dbVideos, soundcloud_tracks }: { videos?: any[]; soundcloud_tracks?: any[] }) {
  const tracks = dbVideos || staticTracks;
  const soundcloud = soundcloud_tracks || [];
  return (
    <div className="flex flex-col">
      <ScrollUp />

      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src="/images/galerie/concert-2.png"
            alt="TriBa MonDo - Chants du monde et textures électroniques"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/95" />
        </div>
        <div className="container relative z-10 pt-20 pb-12 text-center">
          <p className="electro-glitch mb-4 text-sm font-medium uppercase tracking-[0.3em] text-primary/80" data-text="Écouter & Découvrir">
            Écouter &amp; Découvrir
          </p>
          <h1 className="font-display text-5xl font-bold md:text-7xl">
            Notre <span className="text-primary">Musique</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
            La pulsation est ancienne, le souffle profond, le son est urbain.
          </p>
        </div>
      </section>

      <section className="border-t border-red-500/30 bg-gradient-to-b from-red-950/30 via-red-950/20 to-black pt-12 pb-24">
        <div className="container">
          <div className="space-y-6">
            {soundcloud.map((track, index) => (
              <ScrollReveal key={index} delay={index * 100} direction="up">
                <div className="overflow-hidden rounded-2xl border border-red-500/30 bg-black/50 backdrop-blur-sm">
                  <div className="p-6 pb-4">
                    <h3 className="font-display text-lg font-semibold">
                      {track.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/50">{track.description}</p>
                  </div>
                  <div className="px-6 pb-6">
                    <iframe
                      width="100%"
                      height="166"
                      scrolling="no"
                      frameBorder="no"
                      allow="autoplay"
                      src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(track.url)}&color=%23dc2626&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
                      title={track.title}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-16 pb-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <ScrollReveal>
              <h2 className="font-display text-2xl font-bold">
                Nos <span className="text-primary">influences</span>
              </h2>
            </ScrollReveal>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {influences.map((influence, index) => (
                <ScrollReveal 
                  key={index} 
                  delay={index * 30} 
                  direction="up" 
                  scale={0.5} 
                  duration={600}
                >
                  <span
                    className="inline-block rounded-full border border-primary/40 bg-red-950/50 px-4 py-1.5 text-sm text-primary shadow-lg shadow-primary/10 transition-all hover:border-primary hover:bg-primary hover:text-black"
                  >
                    {influence}
                  </span>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="videos" className="scroll-mt-32 border-t border-red-500/30 bg-gradient-to-b from-red-950/30 via-red-950/20 to-black pt-16 pb-24">
        <div className="container">
          <div className="flex items-center gap-3">
            <Disc3 className="h-6 w-6 text-primary" />
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              <span className="text-primary">Vidéos</span>
            </h2>
          </div>
          <p className="mt-3 text-white/50">
            Une traversée musicale sons électros et rythmes ancestraux
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {tracks.map((track: any, index: number) => (
              <ScrollReveal key={index} delay={index * 150} direction={index % 2 === 0 ? "right" : "left"}>
                <div
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-red-500/30 bg-black/50 backdrop-blur-sm transition-all hover:border-primary hover:bg-red-950/40 hover:shadow-2xl hover:shadow-primary/20"
                >
                  <div className="relative aspect-video bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${track.youtubeId}`}
                      title={track.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2">
                      <Play className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium uppercase tracking-wider text-primary">
                        {track.type}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-xl font-semibold">
                      {track.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/50">
                      {track.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-red-500/30 bg-gradient-to-b from-black via-red-950/10 to-black py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <ScrollReveal direction="down">
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                Notre <span className="text-primary">approche</span>
              </h2>
            </ScrollReveal>
            <div className="mt-8 space-y-6 text-white/60 leading-relaxed text-center">
              <ScrollReveal delay={100}>
                <p>
                  TriBa MonDo réinvente les sons en mêlant instruments acoustiques et éléments
                  électroniques. Percussions, flûtes et voix se superposent aux claviers
                  électroniques et textures synthétiques pour produire des timbres hybrides.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <p>
                  Le groupe intègre des éléments de drum & bass dans son contexte de fusion,
                  ajoutant des rythmes électroniques rapides et des lignes de basse qui
                  interagissent avec les pulsations ancestrales et les motifs de percussion tribale.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <p>
                  L'improvisation est au coeur de chaque performance. Chaque concert est une
                  rencontre unique où les musiciens et le public co-créent un moment d'intensité,
                  de connexion et de résonance émotionnelle.
                </p>
              </ScrollReveal>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-x-12 gap-y-6">
              <ScrollReveal delay={400} direction="up" scale={0.9}>
                <a
                  href="/documents/bio-tribamondo.pdf"
                  download
                  className="electro-cta group inline-flex items-center gap-2 text-primary transition-all"
                >
                  <Download className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
                  Dossier de Presse (Bio)
                </a>
              </ScrollReveal>
              <ScrollReveal delay={500} direction="up" scale={0.9}>
                <a
                  href="/documents/setlist-tribamondo.pdf"
                  download
                  className="electro-cta group inline-flex items-center gap-2 text-primary transition-all"
                >
                  <Download className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
                  Setlist
                </a>
              </ScrollReveal>
              <ScrollReveal delay={600} direction="up" scale={0.9}>
                <a
                  href="/documents/tech-rider-tribamondo.pdf"
                  download
                  className="electro-cta group inline-flex items-center gap-2 text-primary transition-all"
                >
                  <Download className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
                  Fiche Technique
                </a>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
