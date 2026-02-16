import React from 'react';

export interface Concert {
  id?: number;
  date: string;
  dayOfWeek?: string;
  time?: string;
  title: string;
  venue: string;
  address?: string;
  description?: string;
  price?: string;
  ticketUrl?: string;
  image_url?: string;
  reservation_phone?: string;
  reservation_required?: number;
  isPast: boolean;
}

export const concerts: Concert[] = [
  {
    date: "12 Avr 2026",
    dayOfWeek: "Dimanche",
    time: "17h00",
    title: "Concert au Conservatoire",
    venue: "Conservatoire Olivier Messiaen — Auditorium Manu Di Bango",
    address: "4 Rue Proudhon, 94500 Champigny-sur-Marne",
    description: "Concert exceptionnel à l'Auditorium Manu Di Bango du Conservatoire Olivier Messiaen de Champigny-sur-Marne. Une immersion sonore mêlant rythmes ancestraux et sons contemporains.",
    price: "Entrée libre",
    isPast: false,
  },
  {
    date: "29 Mai 2026",
    dayOfWeek: "Vendredi",
    time: "19h30",
    title: "TriBa MonDo à l'Apollo Théâtre",
    venue: "Apollo Théâtre",
    address: "18 rue du Faubourg du Temple, 75011 Paris",
    description: "Retrouvez TriBa MonDo sur la scène mythique de l'Apollo Théâtre pour une soirée de fusion musicale intense.",
    price: "À partir de 18€",
    isPast: false,
    ticketUrl: "https://apollotheatre.fr/",
  },
  {
    date: "10 Juin 2026",
    dayOfWeek: "Mercredi",
    time: "19h30",
    title: "TriBa MonDo à l'Apollo Théâtre",
    venue: "Apollo Théâtre",
    address: "18 rue du Faubourg du Temple, 75011 Paris",
    description: "Deuxième date à l'Apollo Théâtre. Une expérience vibrante entre traditions réinventées et élans d'aujourd'hui.",
    price: "À partir de 18€",
    isPast: false,
    ticketUrl: "https://apollotheatre.fr/",
  },
  {
    date: "18 Déc 2025",
    dayOfWeek: "Jeudi",
    time: "19h00",
    title: "Concert au Centre Culturel Jean-Vilar",
    venue: "Centre culturel Jean-Vilar",
    address: "52 Rue Pierre Marie Derrien, 94500 Champigny-sur-Marne",
    description:
      "Concert proposé par le conservatoire. 45 minutes d'odyssée musicale mêlant musiques du monde, percussions, voix et textures électroniques. Entrée libre, tout public.",
    price: "Entrée libre",
    isPast: true,
  },
  {
    date: "22 Nov 2025",
    dayOfWeek: "Samedi",
    time: "20h00",
    title: "Jazz Festival de La Queue-en-Brie",
    venue: "La Queue-en-Brie",
    address: "Val-de-Marne (94)",
    description:
      "Participation au festival de jazz local, où le groupe a présenté sa fusion de musiques du monde dans un contexte festivalier.",
    price: "À partir de 15€",
    isPast: true,
  },
  {
    date: "24 Mai 2025",
    dayOfWeek: "Samedi",
    time: "20h30",
    title: "Musique et Chants du Monde",
    venue: "Temple protestant",
    address: "13 rue Jean Jaurès, Champigny-sur-Marne",
    description:
      "Concert organisé par l'association Les Amis de la Musique. Chants du monde explorant la nature, l'amour, l'exil et la révolte — des thèmes universels portés par les voix, les rythmes et les tambours. Gratuit pour les moins de 12 ans.",
    price: "18€ / 12€ réduit",
    isPast: true,
  },
  {
    date: "13 Nov 2022",
    dayOfWeek: "Dimanche",
    time: "20h30",
    title: "Collaboration — Saison Culturelle de Sucy-en-Brie",
    venue: "Espace Jean-Marie Poirier",
    address: "1 Espl. du 18 Juin 1940, 94370 Sucy-en-Brie",
    description:
      "Collaboration avec l'Harmonie Municipale, dans le cadre du programme thématique méditerranéen, aux côtés du trompettiste René Gilles Rousselot et de la pianiste Catherine Massol.",
    price: "Entrée libre",
    isPast: true,
  },
  {
    date: "08 Nov 2020",
    dayOfWeek: "Dimanche",
    time: "17h00",
    title: "Première partie — « Autour de la Méditerranée »",
    venue: "Espace Jean-Marie Poirier",
    address: "1 Espl. du 18 Juin 1940, 94370 Sucy-en-Brie",
    description:
      "Première partie de l'Orchestre de l'Harmonie Municipale de Sucy-en-Brie pour le concert « Autour de la Méditerranée ». Fusion de musiques du monde et répertoire méditerranéen de l'orchestre.",
    price: "Entrée libre",
    isPast: true,
  },
];

export const tracks = [
  {
    title: "Trøllabundin",
    type: "Cover d'Eivør — Live 2024",
    description:
      "Reprise envoûtante de la chanteuse féroïenne Eivør, réinterprétée à travers le prisme de la fusion world de TriBa MonDo.",
    youtubeId: "7r7BP8fYack",
  },
  {
    title: "Itrun Nada",
    type: "Live recording — Mai 2024",
    description:
      "Une pièce captivante mêlant voix et percussions, explorant les thèmes de l'invisible et de la connexion spirituelle.",
    youtubeId: "sPb259ECvVc",
  },
  {
    title: "Avenu Malkeinu",
    type: "Live recording — Juillet 2024",
    description:
      "Interprétation émouvante de ce chant liturgique hébraïque, porté par les voix et les rythmes du groupe dans une version fusion.",
    youtubeId: "0bLEQfcwAUY",
  },
  {
    title: "La Rosa Enflorece",
    type: "Live recording — Novembre 2025",
    description:
      "Chant de la tradition judéo-espagnole (ladino), célébrant l'amour et la beauté à travers une mélodie intemporelle réinventée.",
    youtubeId: "u5N-YSBpz5E",
  },
];
