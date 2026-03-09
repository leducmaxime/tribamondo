"use client";
import { useState } from "react";
import { ScrollUp } from "@/components/common/ScrollUp";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { Play, Disc3, Download, X, Music } from "lucide-react";

function VideoModal({ video, onClose }: { video: any; onClose: () => void }) {
  const isShort = video.type?.toLowerCase().includes("short");
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 text-white/70 hover:text-white transition-colors"
        aria-label="Fermer"
      >
        <X className="h-7 w-7" />
      </button>
      <div
        className={`relative w-full mx-4 ${isShort ? "max-w-xs aspect-[9/16]" : "max-w-5xl aspect-video"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full rounded-xl"
        />
      </div>
    </div>
  );
}

import { tracks as staticTracks } from "@/app/data";

const influences = [
  "TribalTrans", "Séfarade", "Hébraïque", "Flamenco", "Syrien", "Afrique centrale",
  "Andes", "Aborigène d’Australie", "Tibet", "Nordique", "Mystique", "Îles Féroé",
  "Rituel", "Électro", "Organique", "Polyrythmie", "Fusion", "Contemporain",
  "Improvisation", "Cosmogonie", "Transculturel", "Pulsation", "Tellurique",
  "Liberté", "Ancrage", "Souffle", "Chamanisme",
];

function extractYouTubeId(url: string): string {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (u.pathname.includes("/watch")) return u.searchParams.get("v") || "";
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    return url;
  } catch {
    return url;
  }
}

export function Musique({ videos: dbVideos, soundcloud_tracks }: { videos?: any[]; soundcloud_tracks?: any[] }) {
  const tracks = dbVideos || staticTracks;
  const soundcloud = soundcloud_tracks || [];
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  return (
    <div className="flex flex-col">
      <ScrollUp />

      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden pt-20 md:min-h-[60vh]">
        <div className="absolute inset-0">
          <img
            src="/images/galerie/concert-2.png"
            alt="TriBa MonDo - Chants du monde et textures électroniques"
            className="h-full w-full object-cover"
            fetchPriority="high"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/95" />
        </div>
        <div className="container relative z-10 py-20 text-center">
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

      {soundcloud.length > 0 && (
        <section className="border-t border-red-500/30 bg-gradient-to-b from-red-950/30 via-red-950/20 to-black pt-16 pb-24">
          <div className="container">
            <div className="flex items-center gap-3 mb-3">
              <Music className="h-6 w-6 text-primary" />
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                <span className="text-primary">YouTube Music</span>
              </h2>
            </div>
            <p className="mb-10 text-white/50">Écouter nos morceaux</p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {soundcloud.map((track, index) => {
                const videoId = extractYouTubeId(track.url);
                if (!videoId) return null;
                return (
                  <ScrollReveal key={index} delay={index * 80} direction="up">
                    <div
                      className={`overflow-hidden rounded-xl border bg-black/50 backdrop-blur-sm transition-all ${activeTrack === videoId ? "border-primary" : "border-red-500/30 hover:border-primary hover:shadow-lg hover:shadow-primary/20"}`}
                    >
                      <div
                        className="relative aspect-video bg-black cursor-pointer"
                        onClick={() => setActiveTrack(activeTrack === videoId ? null : videoId)}
                      >
                        {activeTrack === videoId ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                            title={track.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 h-full w-full"
                          />
                        ) : (
                          <>
                            <img
                              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                              alt={track.title}
                              className="absolute inset-0 h-full w-full object-cover object-center"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/50">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 shadow-lg shadow-primary/30 transition-transform hover:scale-110">
                                <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="p-3">
                        <p className={`text-sm font-medium line-clamp-2 leading-tight transition-colors ${activeTrack === videoId ? "text-primary" : ""}`}>{track.title}</p>
                        {track.description && (
                          <p className="mt-1 text-xs text-white/50 line-clamp-1">{track.description}</p>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

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

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tracks.map((track: any, index: number) => (
              <ScrollReveal key={index} delay={index * 150} direction={index % 2 === 0 ? "right" : "left"}>
                <div
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-red-500/30 bg-black/50 backdrop-blur-sm transition-all hover:border-primary hover:bg-red-950/40 hover:shadow-2xl hover:shadow-primary/20"
                >
                  <div
                    className="relative aspect-video bg-black cursor-pointer group/thumb"
                    onClick={() => setSelectedVideo(track)}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${track.youtubeId}/hqdefault.jpg`}
                      alt={track.title}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover/thumb:bg-black/50">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 shadow-lg shadow-primary/30 transition-transform group-hover/thumb:scale-110">
                        <Play className="h-7 w-7 text-white ml-1" fill="white" />
                      </div>
                    </div>
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

          </div>
        </div>
      </section>

      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
}
