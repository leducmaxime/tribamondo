import { ScrollUp } from "@/components/common/ScrollUp";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { Calendar, MapPin, Clock, Ticket, Instagram, Facebook, ArrowRight, Phone } from "lucide-react";

import { concerts as staticConcerts } from "@/app/data";
import type { Concert } from "@/app/data";

function isConcertPast(dateStr: string): boolean {
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/').map(Number);
    if (day && month && year) {
      const concertDate = new Date(year, month - 1, day);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return concertDate < now;
    }
  }

  const months: Record<string, number> = {
    'Jan': 0, 'Fév': 1, 'Mar': 2, 'Avr': 3, 'Mai': 4, 'Juin': 5,
    'Juil': 6, 'Août': 7, 'Sept': 8, 'Oct': 9, 'Nov': 10, 'Déc': 11
  };
  
  const parts = dateStr.split(' ');
  if (parts.length !== 3) return false;
  
  const day = parseInt(parts[0]);
  const month = months[parts[1]] || 0;
  const year = parseInt(parts[2]);
  
  const concertDate = new Date(year, month, day);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  return concertDate < now;
}

function parseDate(dateStr: string): Date {
  if (dateStr.includes('/')) {
    const [d, m, y] = dateStr.split('/').map(Number);
    return new Date(y, m - 1, d);
  }
  const months: Record<string, number> = {
    'Jan': 0, 'Fév': 1, 'Mar': 2, 'Avr': 3, 'Mai': 4, 'Juin': 5,
    'Juil': 6, 'Août': 7, 'Sept': 8, 'Oct': 9, 'Nov': 10, 'Déc': 11
  };
  const parts = dateStr.split(' ');
  if (parts.length === 3) {
    const d = parseInt(parts[0]);
    const m = months[parts[1]] || 0;
    const y = parseInt(parts[2]);
    return new Date(y, m, d);
  }
  return new Date(0);
}

function ConcertCard({ concert, index }: { concert: Concert; index: number }) {
  let day, month, year;
  if (concert.date.includes('/')) {
    [day, month, year] = concert.date.split('/');
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
    month = monthNames[parseInt(month) - 1] || month;
  } else {
    [day, month, year] = concert.date.split(" ");
  }
  
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${concert.venue} ${concert.address}`)}`;

  return (
    <ScrollReveal
      delay={index * 100}
      direction="up"
    >
      <div
        className={`group flex h-full flex-col overflow-hidden rounded-xl border transition-all duration-500 ${
          concert.isPast
            ? "border-white/5 bg-transparent opacity-50 grayscale hover:opacity-100 hover:grayscale-0"
            : "border-white/10 bg-white/[0.02] hover:border-primary/50 hover:bg-red-950/[0.05] hover:shadow-[0_0_40px_rgba(220,38,38,0.08)]"
        }`}
      >
        {concert.image_url && (
          <div className="md:hidden h-44 w-full overflow-hidden border-b border-white/5 relative">
            <img
              src={concert.image_url}
              alt=""
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}
          <div className={`flex items-center justify-between border-b border-white/5 px-6 py-6 ${!concert.isPast ? "bg-white/[0.03]" : ""}`}>
          <div className="flex items-center gap-5">
            <span className={`font-chiller text-4xl font-bold transition-colors duration-300 ${concert.isPast ? "text-white/40" : "text-primary group-hover:text-white"}`}>
              {day}
            </span>

            <div className="flex flex-col">
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${concert.isPast ? "text-white/30" : "text-primary group-hover:text-primary-light"}`}>
                {concert.dayOfWeek}
              </span>
              <span className="text-sm font-bold uppercase tracking-tight text-white/80">
                {month} {year}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className={`flex items-center gap-1.5 text-sm font-bold ${concert.isPast ? "text-white/30" : "text-white/90"}`}>
              <Clock className="h-3.5 w-3.5 text-primary" />
              {concert.time}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex gap-6">
            {concert.image_url && (
              <div className="hidden md:block h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-primary/20 bg-black/40">
                <img src={concert.image_url} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              </div>
            )}
            <div className="flex-1">
              <h3 className={`font-sans text-xl font-bold leading-tight tracking-tight transition-colors duration-300 ${concert.isPast ? "text-white/40" : "text-white group-hover:text-primary-light"}`}>
                {concert.title}
              </h3>
              
              <a 
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 group/loc block space-y-2 rounded-lg p-2 -ml-2 transition-colors hover:bg-white/5"
              >
                <div className="flex items-start gap-2 text-sm text-white/50 transition-colors group-hover/loc:text-white">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary/60 group-hover/loc:text-primary" />
                  <span className="leading-snug font-medium underline-offset-4 group-hover/loc:underline">{concert.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/30 italic">
                  <span className="ml-6">{concert.address}</span>
                </div>
              </a>
            </div>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-white/40">
            {concert.description}
          </p>

          <div className="mt-auto flex flex-col justify-end gap-2 pt-6">
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                <Ticket className="h-4 w-4 text-primary/60" />
                <span>{concert.price}</span>
              </div>
              
              {!concert.isPast && (
                <div className="flex flex-col items-end gap-2">
                  {Boolean(concert.reservation_required) && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary animate-pulse">
                      Réservation obligatoire
                    </span>
                  )}
                  {concert.reservation_phone ? (
                    <a
                      href={`tel:${concert.reservation_phone.replace(/\s/g, '')}`}
                      className="inline-flex h-10 items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-4 text-xs font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                    >
                      <Phone className="h-3 w-3" />
                      {concert.reservation_phone}
                    </a>
                  ) : concert.ticketUrl ? (
                    <a
                      href={concert.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-primary/40 bg-primary/5 px-6 text-xs font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                    >
                      Billets
                    </a>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export function Concerts({ concerts: dbConcerts }: { concerts?: Concert[] }) {
  const displayConcerts = (dbConcerts || staticConcerts).map(c => ({
    ...c,
    isPast: isConcertPast(c.date)
  }));
  
  const upcomingConcerts = displayConcerts
    .filter((c) => !c.isPast)
    .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());
    
  const pastConcerts = displayConcerts
    .filter((c) => c.isPast)
    .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());

  return (
    <div className="flex flex-col">
      <ScrollUp />

      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden pt-20 md:min-h-[60vh]">
        <div className="absolute inset-0">
          <img
            src="/images/galerie/concert-4.png"
            alt="TriBa MonDo - Concerts et événements live"
            className="h-full w-full object-cover"
            fetchPriority="high"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        <div className="container relative z-10 py-20 text-center">
          <p className="electro-glitch mb-4 text-sm font-medium uppercase tracking-[0.3em] text-primary/80" data-text="Événements & Concerts">
            Événements &amp; Concerts
          </p>
          <h1 className="font-display text-5xl font-bold md:text-7xl">
            Nos <span className="text-primary">Concerts</span>
          </h1>
        </div>
      </section>

      <section className="bg-black pt-10 pb-24">
        <div className="container">
          {upcomingConcerts.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6">
              {upcomingConcerts.map((concert, index) => (
                <div key={index} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <ConcertCard concert={concert} index={index} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-2xl border border-white/5 bg-white/[0.02] p-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-white/20" />
              <h3 className="mt-6 text-2xl font-bold">Programmations en cours</h3>
              <p className="mt-4 text-white/40">
                De nouvelles dates seront annoncées prochainement. 
                Restez à l'écoute sur nos réseaux sociaux.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-white/5 bg-[#080808] pb-32 pt-24">
        <div className="container">
          <ScrollReveal>
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-16">
                <span 
                  className="electro-glitch mb-4 block text-sm font-medium uppercase tracking-[0.3em] text-primary/80"
                  data-text="Le Spectacle"
                >
                  Le Spectacle
                </span>
                <h2 className="font-display text-5xl font-bold md:text-7xl">
                  PulsationS du MonDe
                </h2>
              </div>
              
              <div className="space-y-12 text-lg leading-relaxed text-white/60">
                <p className="font-sans text-xl font-medium text-white/90">
                  Voyagez au cœur des sonorités d’ici et d’ailleurs avec PulsationS du MonDe, un spectacle vibrant où chants sources et créations originales rencontrent l’énergie électro contemporaine.
                </p>

                <div className="grid gap-8 md:grid-cols-2 text-sm text-left">
                  <p>
                    Des rythmes ancestraux, hébraïques et séfarades, syriens, amérindiens, africains, tibétains ou aborigènes constituent la matière première du projet. 
                    Ces héritages sonores, porteurs de mémoire et de spiritualité, deviennent le socle d’une création tournée vers le présent.
                  </p>
                  <p>
                    Percussions organiques, voix incarnée, claviers et batterie s’entrelacent dans un jeu de polyrythmies qui dialogue avec des nappes synthétiques, des textures électro-acoustiques et des pulsations électroniques. 
                  </p>
                </div>

                <p className="text-base italic border-t border-white/5 pt-12 text-center">
                  Une scène vivante et puissante, capable de rassembler un public large autour d’une musique à la fois ancrée dans les racines du monde et résolument actuelle.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative h-[40vh] min-h-[300px] w-full overflow-hidden border-y border-white/5">
        <img
          src="/images/galerie/image-18.png"
          alt="TriBa MonDo - Concert Live"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-black" />
      </section>

      {pastConcerts.length > 0 && (
        <section className="border-t border-white/5 bg-black py-24">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-16 text-center font-display text-3xl font-bold md:text-4xl">
                Archives <span className="text-primary">Lives</span>
              </h2>
              
              <div className="relative space-y-0 before:absolute before:left-[17px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-gradient-to-b before:from-primary/40 before:via-white/10 before:to-transparent md:before:left-1/2">
                {pastConcerts.map((concert, index) => (
                  <ScrollReveal key={index} delay={index * 50} direction="up">
                    <div className={`relative flex items-center justify-between py-8 md:justify-normal ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      <div className="absolute left-[14px] z-10 h-2.5 w-2.5 rounded-full bg-primary/80 ring-4 ring-black md:left-1/2 md:-ml-1.25" />
                      
                      <div className={`ml-12 w-28 shrink-0 text-left md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}>
                        <span className="block text-sm font-bold text-primary tracking-widest">
                          {parseDate(concert.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      
                      <div className={`hidden flex-1 md:block ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                        <h4 className="font-sans text-lg font-bold text-white/80 group-hover:text-white transition-colors">{concert.title}</h4>
                        <div className={`mt-1 flex items-center gap-1.5 text-xs text-white/50 italic ${index % 2 === 0 ? 'justify-end' : ''}`}>
                          <MapPin className="h-3 w-3 text-primary/40" />
                          {concert.venue}
                        </div>
                      </div>

                      <div className="ml-4 flex-1 md:hidden">
                        <h4 className="font-sans text-sm font-bold text-white/80">{concert.title}</h4>
                        <p className="text-[11px] text-white/40 italic mt-0.5">{concert.venue}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-24">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Vous organisez un <span className="text-primary">événement</span> ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/50">
            TriBa MonDo s'adapte à toutes les situations : concerts, festivals,
            événements culturels, cérémonies, premières parties...
            Nous privilégions les rencontres accessibles et intimes.
          </p>
          <a
            href="/contact"
            className="electro-cta group mt-8 inline-flex items-center gap-2 text-primary transition-all"
          >
            Nous contacter
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </section>
    </div>
  );
}
