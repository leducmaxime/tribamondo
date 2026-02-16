"use client";

import { useState } from "react";
import { ScrollUp } from "@/components/common/ScrollUp";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { Drum, Piano, Mic, ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight } from "lucide-react";

const galleryImages = [
  "image-8.png",
  "image-14.png",
  "image-18.png",
  "image-47.png",
  "image-49.png",
  "image-52.png",
  "image-new-1.png",
  "image-new-2.png",
  "image-new-3.png",
  "image-new-4.png",
  "image-new-5.png",
  "image-new-6.png",
];

const interviewData = [
  {
    question: "Qu’est-ce qui vous inspire dans les musiques du monde pour vos créations ?",
    answers: [
      {
        name: "Marcel",
        text: "Les visions totalement différentes des nôtres, notamment les rythmiques et tempéraments qui ne sont pas familiers. Cela nous pousse à nous détacher de la pulsation.",
      },
      {
        name: "Emmanuelle",
        text: "Le déracinement est nécessaire pour trouver une unité en soi-même. Une forte curiosité me pousse à appréhender l’autre comme miroir et/ou comme légitimité. Après tout un test ADN, nous rappelle que nous venons tous d’ailleurs. nos racines ne s’arrêtent pas aux frontières.",
      },
      {
        name: "Fred",
        text: "Le rythme & la mélodie. L’architecture du rythme dans les musiques de tradition orale et les musiques savantes folkloriques, est riche de diversité et d’enseignements. Les mélodies sont l'expression profonde de l’inconscient collectif de chaque culture. Tout cela est inspirant...",
      },
    ],
  },
  {
    question: "Comment choisissez-vous les morceaux ou les traditions musicales à revisiter ?",
    answers: [
      {
        name: "Marcel",
        text: "Par exemple, Hildegarde me plonge dans un état apaisant. Ses harmonies simples et absolues possèdent une richesse incroyable. Je suis un homme des quintes et des quartes, des intervalles justes. C’est comme une anamorphose : tu vois l'œuvre seulement quand tu es en face.",
      },
      {
        name: "Emmanuelle",
        text: "C’est une question d’énergie première. Une connexion directe et tellurique. Le chant ou la musique doit me propulser immédiatement dans un axe. Un axe sincère et généreux et non négociable.",
      },
      {
        name: "Fred",
        text: "Je laisse le choix à Emmanuelle pour choisir les mélodies à chanter et amène ensuite ma touche rythmique personnelle.",
      },
    ],
  },
  {
    question: "Quelle place accordez-vous à l’improvisation dans vos interprétations ?",
    answers: [
      {
        name: "Marcel",
        text: "C’est une question de sensation, entre improvisation, arrangement et composition. Nous cherchons à mettre cela dans un contexte plus universel, reliant les musiques savantes et traditionnelles.",
      },
      {
        name: "Emmanuelle",
        text: "L’improvisation est une recherche, et aussi un danger. Dire sans rien dire. Il faut savoir alors se taire.",
      },
      {
        name: "Fred",
        text: "J’interprète spontanément mes parties rythmiques, basées sur la mélodie et son placement sur les temps forts.",
      },
    ],
  },
  {
    question: "Quels messages ou émotions souhaitez-vous transmettre à travers vos reprises et compositions ?",
    answers: [
      {
        name: "Marcel",
        text: "Avec un test ADN, on réalise que nous venons tous de partout. Cela permet de se projeter dans l’histoire ancienne du monde, malgré nos différences culturelles.",
      },
      {
        name: "Emmanuelle",
        text: "Transmettre du sens. Donner un souffle à cette histoire et contribuer à la constitution de l’humanité.",
      },
      {
        name: "Fred",
        text: "Un souffle d’émotions, capables de toucher le cœur et l’âme.",
      },
    ],
  },
  {
    question: "Comment parvenez-vous à respecter les origines culturelles des morceaux ?",
    answers: [
      {
        name: "TriBa MonDo",
        text: "C’est tout un art ! Nous nous appuyons sur notre expérience, notre curiosité et notre respect des cultures. Fred a étudié auprès de maîtres de tambours à travers le monde, et Marcel percussionniste/arrangeur est également compositeur, with une solide maîtrise de l’harmonie et de l’orchestration. Emmanuelle cherche à sortir de sa zone de confort vocale.",
      },
    ],
  },
  {
    question: "Comment répartissez-vous les rôles créatifs entre vous trois ?",
    answers: [
      {
        name: "Marcel",
        text: "La répartition est fluide. Fred, en tant que directeur artistique, donne une direction stylistique. Moi, je traduis harmoniquement. Emmanuelle s’occupe de la recherche vocale et de l’improvisation.",
      },
      {
        name: "Emmanuelle",
        text: "Chacun a un rôle complémentaire, et nos visions se rassemblent malgré nos différences.",
      },
      {
        name: "Fred",
        text: "Pas grand chose à dire de plus. L’approche est libre et dépend de l’appréhension que nous avons, de chaque pièce musicale...",
      },
    ],
  },
  {
    question: "Comment gérez-vous les désaccords artistiques dans le processus de création ?",
    answers: [
      {
        name: "TriBa MonDo",
        text: "On expérimente, on avance,on s’écoute. Parfois une seule note suffit à tout transformer dans la structure même. Quand un doute persiste, l'un de nous tranche.",
      },
    ],
  },
  {
    question: "Quels sont vos moments favoris lors des répétitions ou performances ?",
    answers: [
      {
        name: "Marcel",
        text: "Tout, et tout le temps. Quand on cherche et quand on trouve.",
      },
      {
        name: "Emmanuelle",
        text: "Même les moments « vides » de répétition. Nous travaillons parfois en cacophonie, chacun dans sa bulle, mais cela crée une complicité et une confiance mutuelle.",
      },
      {
        name: "Fred",
        text: "Lorsque nous obtenons un son fluide et homogène. Pour reprendre l’image, lorsque nous jouons tous les 3 dans la même bulle !!",
      },
    ],
  },
  {
    question: "Comment procédez-vous pour fusionner les éléments vocaux, rythmiques et harmoniques ?",
    answers: [
      {
        name: "Marcel",
        text: "À la sensation. Fred est notre baromètre.",
      },
      {
        name: "Fred",
        text: "A force de répétitions, les 3 éléments finissent par définir une architecture sonore. La répétition est le moteur, pour donner un peu de “viande” à cette structure.",
      },
    ],
  },
  {
    question: "Quel est le rôle des percussions dans vos arrangements ?",
    answers: [
      {
        name: "Marcel",
        text: "Les percussions et le chant maintiennent la thématique originelle. Le clavier apporte une touche occidentale, moderne et savante.",
      },
      {
        name: "Fred",
        text: "Les percussions sont prépondérantes dans le répertoire. Je choisis l’instrument de percussions, en fonction de la culture, de ce que cela m’évoque, ou du son que cela génère pour se marier au mieux avec le son du clavier et de la voix.",
      },
    ],
  },
  {
    question: "Quels défis rencontrez-vous sur des reprises de traditions très différentes ?",
    answers: [
      {
        name: "Marcel",
        text: "Trouver un équilibre entre ancienneté et modernité. Cela passe par des sons électro, des accords traditionnels mêlés à des effets modernes, tout en restant au centre.",
      },
      {
        name: "Emmanuelle",
        text: "Tous les placements vocaux sont insensés, extrêmement marqués, et reposent sur des tensions très fortes, tous différents et en perpétuelle alternance. Chaque jour, je m’en rapproche un peu plus, au gré du développement de la musculature de ma voix.",
      },
      {
        name: "Fred",
        text: "La difficulté n’est pas tant le choix du répertoire, que plutôt la formule Trio. A trois, nous sommes toujours dans l’esprit minimaliste & essentiel. L’objectif est de rendre le son dense & harmonieux.",
      },
    ],
  },
  {
    question: "Quels artistes ou groupes influencent le plus votre travail collectif ?",
    answers: [
      {
        name: "Marcel & Emmanuelle",
        text: "Ce n’est pas défini. C’est un ensemble.",
      },
      {
        name: "Fred",
        text: "Je me nourris de mon expérience passée, sans m’appuyer particulièrement sur un artiste ou groupe.",
      },
    ],
  },
  {
    question: "Quelle importance accordez-vous à la modernité ou à l’innovation ?",
    answers: [
      {
        name: "Marcel",
        text: "Nous cherchons à créer un son décisif.",
      },
      {
        name: "Emmanuelle",
        text: "Quand le son est là, c’est une évidence.",
      },
      {
        name: "Fred",
        text: "J’accorde de l'importance à la transformation du son par des effets électroniques, ou des techniques vocales hors norme (ex le Grunt). Je suis ouvert à toutes technologies, sans devoir utiliser des boucles pré-programmées (Loops).",
      },
    ],
  },
  {
    question: "Quels sont vos projets futurs pour continuer à explorer les musiques du monde ?",
    answers: [
      {
        name: "Marcel",
        text: "Nous continuons de chercher, c’est une quête sans fin.",
      },
      {
        name: "Emmanuelle",
        text: "Je préfère ne plus parler de « musiques du monde ». C’est simplement de la musique, tout court.",
      },
      {
        name: "Fred",
        text: "Les musiques du monde sont un prétexte à développer des textures sonores. J’espère pouvoir développer ensuite, davantage de pièces musicales composées par nos soins.",
      },
    ],
  },
];

const currentMembers = [
  {
    name: "Fred André",
    role: "Batterie, percussions & choeur",
    description:
      "Fred capte le mouvement et lui donne forme. Percussionniste, batteur et compositeur, il est le trait d'union entre l'instinct et la maîtrise. De ses voyages musicaux – du rock aux rythmes profonds du Bénin, de Cuba, des musiques latines & Afro-Caribéennes. Il apprend à laisser la pulsation guider la musique. Il façonne l'energy brute, équilibre la dynamique du trio et inscrit chaque pièce dans un flux vivant et organique.",
    image: "/images/members/fred.png",
    icon: <Drum className="h-6 w-6" />,
  },
  {
    name: "Emmanuelle Gabarra",
    role: "Chant, clavier & percussions",
    description:
      "Emmanuelle fait du chant une matière vivante, en dialogue constant avec le corps et l'espace. Sa voix, tantôt ancrée, tantôt aérienne, danse entre les styles et les émotions, traçant des ponts entre les cultures et les sensibilités. L'improvisation est son terrain de jeu, un espace où elle cherche le timbre juste, celui qui émerge de l'instant et résonne au-delà des mots. À la croisée du souffle et du geste, elle façonne un chant qui vibre et qui rassemble.",
    image: "/images/members/emmanuelle.png",
    icon: <Mic className="h-6 w-6" />,
  },
  {
    name: "Marcel Hamon",
    role: "Clavier, percussions & choeur",
    description:
      "Marcel construit la musique comme on sculpte un espace sonore. Percussionniste, pianiste et compositeur, il assemble rythmes et harmonies avec une précision d'orfèvre, jouant sur les contrastes entre structures solides et textures mouvantes. Il façonne des paysages sonores où la tradition dialogue with des explorations contemporaines, nous entraînant dans un univers évocateur, presque cinématographique.",
    image: "/images/members/marcel.png",
    icon: <Piano className="h-6 w-6" />,
  },
];

export function LeGroupe() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % galleryImages.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  return (
    <div className="flex flex-col">
      <ScrollUp />

      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src="/images/galerie/concert-3.png"
            alt="TriBa MonDo - Le Groupe"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/95" />
        </div>
        <div className="container relative z-10 py-20 text-center">
          <p className="electro-glitch mb-4 text-sm font-medium uppercase tracking-[0.3em] text-primary/80" data-text="Les artistes">
            Les artistes
          </p>
          <h1 className="font-display text-5xl font-bold md:text-7xl">
            Le <span className="text-primary">Groupe</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
            Trois musiciens issus de parcours multiples façonnent une musique libre, collective et mouvante explorant les sonorités et les univers urbains par l’improvisation et l’interaction.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="border-t border-red-500/30 bg-gradient-to-b from-red-950/30 via-red-950/20 to-black py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <ScrollReveal direction="down">
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                Notre <span className="text-primary">histoire</span>
              </h2>
            </ScrollReveal>
            <div className="mt-8 space-y-6 text-white/60 leading-relaxed">
              <ScrollReveal delay={0} duration={600}>
                <p>
                  TriBa MonDo est né d'une rencontre tardive mais nécessaire. Celle de trois musiciens, Emmanuelle, Fred et Marcel, collègues
                  depuis près de vingt ans au Conservatoire Olivier Messiaen de Champigny-sur-Marne, réunis par un même désir de création libre,
                  au-delà des cadres et des esthétiques.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={50} duration={600}>
                <p>
                  Le trio rassemble Emmanuelle, pianiste classique concertiste et
                  chanteuse, Marcel, percussionniste compositeur et arrangeur, et Fred,
                  batteur, percussionniste et compositeur, nourri de musiques du monde.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={100} duration={600}>
                <p>
                  Au fil de son parcours, Emmanuelle Gabarra a développé une pratique
                  transversale mêlant interprétation classique, voix et scène. Elle a
                  notamment été chanteuse au sein du groupe a cappella Mahna,
                  consacré aux musiques du monde, carrière de pianiste soliste (Japon,
                  europe, Amérique du Nord et du Sud) et en duo de quatre mains avec
                  la pianiste Xenia Maliarevitch, (Festivals en Europe) ainsi que des
                  collaborations with Bruno Dizien, et Ève Grinsztajn, danseuse à
                  l'Opéra de Paris, dans des projets croisant musique et mouvement.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={150} duration={600}>
                <p>
                  Marcel Hamon a évolué dans le champ de la musique symphonique et
                  de la création contemporaine, collaborant notamment with Marco
                  Zambelli, Michel Piquemal et Zahia Ziouani, et développant une
                  approche ouverte des percussions, à la croisée de l'écriture orchestrale et
                  des explorations sonores actuelles.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={200} duration={600}>
                <p>
                  Fred André s'est forgé une identité rythmique et musicale, au croisement
                  des musiques actuelles amplifiées et des musiques du monde de
                  traditions orales. Il a notamment joué au sein de formations telles que
                  The Barking Dogs (rock alternatif), Sita Lantaa (Afro-Groove) et Taï
                  Phong (rock progressif), et a collaboré with des percussionnistes issus
                  de différentes cultures, parmi lesquels Ayrald Petit, Milian Gali (Cuba)
                  et Jean Adagbenon (Bénin).
                </p>
              </ScrollReveal>
              <ScrollReveal delay={250} duration={600}>
                <p>
                  Trois trajectoires singulières, trois cultures musicales affirmées, mises en
                  dialogue dans un projet commun : TriBa MonDo, un espace de recherche
                  et de création fondé sur la circulation des langages musicaux.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={300} duration={600}>
                <p>
                  Après avoir existé sous différentes formes — quartet puis quintette —
                  TriBa MonDo est revenu à une configuration essentielle : rythme,
                  harmonie, mélodie. Un choix volontaire, favorisant l'écoute, l'interaction
                  et une écriture plus directe, pensée pour la scène.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={350} duration={600}>
                <p>
                  La musique de TriBa MonDo ne juxtapose pas les styles : elle les fait
                  interférer. Rock, urbain, musiques du monde, classique, blues, soul et
                  jazz constituent la matière vivante de leur travail. Ces influences,
                  profondément intégrées, sont le reflet d'années de pratiques, d'écoutes et
                  de croisements musicaux.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={400} duration={600}>
                <p>
                  Le groupe s'inscrit pleinement dans la maturité de ses membres. Il ne
                  s'agit pas de démontrer, mais de dire — quelque chose du monde, du
                  temps, du rythme, de la mémoire collective et de l'énergie du live. Des
                  parcours longtemps développés séparément convergent aujourd'hui with
                  évidence.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={450} duration={600}>
                <p>
                  Sur scène, TriBa MonDo propose une musique organique et évolutive,
                  où écriture et improvisation cohabitent. Piano et voix, percussions
                  acoustiques, batterie et textures sonores électroniques se répondent,
                  construisant une matière musicale en transformation permanente. Le
                  concert devient un espace de tension et de respiration, où la musique
                  se façonne en temps réel, au contact du lieu et du public.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={500} duration={600}>
                <p>
                  TriBa MonDo n'est pas un aboutissement, mais un territoire en
                  mouvement : un lieu où les expériences se croisent, où les musiques
                  dialoguent, et où l'écoute devient matière première.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <ScrollReveal direction="down">
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                M<span className="text-primary">usiciens</span>
              </h2>
              <div className="mt-6 space-y-3 text-white/70 leading-relaxed">
                <p>
                  Trois musiciens, trois parcours, une même énergie : celle de la rencontre et de la création.
                </p>
                <p>
                  TriBa MonDo explore les résonances du monde en tissant un dialogue entre traditions et 
                  modernité, entre pulsation instinctive, sons électroniques et écriture savante.
                </p>
              </div>
            </ScrollReveal>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {currentMembers.map((member, index) => (
              <ScrollReveal key={index} delay={index * 100} direction={index === 0 ? "right" : index === 2 ? "left" : "up"}>
                <div
                  className="group h-full rounded-2xl border border-red-500/30 bg-black/50 p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:bg-red-950/10 hover:shadow-2xl hover:shadow-primary/20"
                >
                  <div className="mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full border-2 border-primary/30 transition-all duration-500 group-hover:scale-105 group-hover:border-primary/60 group-hover:shadow-lg group-hover:shadow-primary/20">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="font-display text-2xl font-semibold transition-colors duration-300 group-hover:text-white md:text-3xl">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-primary">
                    {member.role}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-white/50 transition-colors duration-300 group-hover:text-white/70">
                    {member.description}
                  </p>
                  <div className="mt-6 flex justify-center text-primary/40 neon-icon">
                    {member.icon}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-red-500/30 bg-gradient-to-b from-black via-red-950/5 to-black py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <ScrollReveal direction="down">
              <div className="mb-12 text-center">
                <h2 className="font-display text-3xl font-bold md:text-4xl">
                  L'<span className="text-primary">Interview</span>
                </h2>
              </div>
            </ScrollReveal>

            <div className="space-y-6">
              {interviewData.map((item, qIndex) => (
                <ScrollReveal key={qIndex} delay={qIndex * 50} direction="up">
                  <div 
                    className={`overflow-hidden rounded-2xl border transition-all duration-500 ${
                      openIndex === qIndex 
                        ? "border-primary/40 bg-red-950/10 shadow-[0_0_30px_rgba(220,38,38,0.1)]" 
                        : "border-white/5 bg-white/[0.02] hover:border-primary/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    <button
                      onClick={() => toggleAccordion(qIndex)}
                      className="flex w-full items-center justify-between p-4 sm:p-5 text-left"
                    >
                      <span className={`text-sm font-medium transition-colors duration-300 md:text-base ${openIndex === qIndex ? "text-white" : "text-white/60"}`}>
                        <span className="text-primary mr-3 opacity-50">Q.</span>
                        {item.question}
                      </span>
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                        openIndex === qIndex ? "border-primary bg-primary text-black rotate-180" : "border-white/10 text-white/40"
                      }`}>
                        <ChevronDown className="h-5 w-5" />
                      </div>
                    </button>
                    
                    {openIndex === qIndex && (
                      <div className="border-t border-white/5 p-4 sm:p-5 sm:pt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="grid gap-8">
                          {item.answers.map((answer, aIndex) => (
                            <div 
                              key={aIndex} 
                              className="group/ans flex flex-col sm:flex-row gap-4 sm:gap-8"
                            >
                              <div className="flex items-center gap-3 sm:w-44 sm:flex-col sm:items-start sm:gap-1">
                                <div className="flex items-center gap-2">
                                  <div className="flex gap-1">
                                    {(answer.name.includes("Fred") || answer.name.includes("TriBa")) && <Drum className="h-4 w-4 text-primary/60 group-hover/ans:text-primary" />}
                                    {(answer.name.includes("Emmanuelle") || answer.name.includes("TriBa")) && <Mic className="h-4 w-4 text-primary/60 group-hover/ans:text-primary" />}
                                    {(answer.name.includes("Marcel") || answer.name.includes("TriBa")) && <Piano className="h-4 w-4 text-primary/60 group-hover/ans:text-primary" />}
                                  </div>
                                  <div className="font-display text-xl font-bold tracking-wider text-primary group-hover/ans:text-primary-light transition-colors">
                                    {answer.name}
                                  </div>
                                </div>
                                <div className="h-px w-8 bg-primary/20 hidden sm:block mt-2" />
                              </div>
                              <div className="relative flex-1">
                                <p className="text-base leading-relaxed text-white/70 group-hover/ans:text-white/90 transition-colors">
                                  {answer.text}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Photos Section */}
      <section className="border-t border-red-500/30 bg-black py-24">
        <div className="container">
          <ScrollReveal direction="down">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                Nos <span className="text-primary">Photos</span>
              </h2>
              <p className="mt-4 text-white/50">
                Captures d'instants, de vibrations et de rencontres.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((filename, index) => (
              <ScrollReveal 
                key={filename} 
                delay={index * 100} 
                direction="up" 
                scale={0.9}
              >
                <div 
                  onClick={() => setSelectedImageIndex(index)}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border border-red-500/20 bg-red-950/5 transition-all hover:border-primary/50"
                >
                  <img
                    src={`/images/galerie/${filename}`}
                    alt={`TriBa MonDo - Photo ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Association */}
      <section className="border-t border-red-500/30 bg-gradient-to-b from-red-950/30 via-red-950/20 to-black py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <ScrollReveal direction="up" scale={0.8}>
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                L'<span className="text-primary">association</span>
              </h2>
              <p className="mt-6 text-white/60 leading-relaxed">
                TRIBA MONDO PRODUCTION est une association loi 1901 créée en décembre 2025,
                basée au 10 rue Georges Wilson à Champigny-sur-Marne (94500).
                Elle est dédiée à la promotion du groupe, à l'organisation de concerts
                et à la participation à des échanges culturels en France et à l'étranger.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Étymologie */}
      <section className="border-t border-red-500/30 bg-gradient-to-b from-black via-red-950/10 to-black py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <ScrollReveal direction="up" scale={0.8}>
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                L'<span className="text-primary">Étymologie</span>
              </h2>
              <p className="mt-6 text-xl text-white/80 leading-relaxed font-medium">
                TriBa MonDo&nbsp;: Monde tribal en Espéranto.
              </p>
              <p className="mt-2 text-white/60 leading-relaxed">
                Tribue du monde en latin approximatif (selon google), tribue (au singulier) du monde (au singulier).
              </p>
            </ScrollReveal>

            <div className="mt-16 space-y-16">
              {/* MONDO */}
              <ScrollReveal direction="right" duration={800}>
                <h3 className="font-display text-2xl font-bold mb-6">
                  <span className="text-primary">MonDo</span>, du latin <em>Mundus</em>&nbsp;: ce qui est pur.
                </h3>
              </ScrollReveal>
              <div className="space-y-3 text-white/60 leading-relaxed -mt-10">
                <ScrollReveal delay={100} duration={600}>
                  <p>Du radical indo-européen commun <em>*mū-</em>&nbsp;: l'eau.</p>
                </ScrollReveal>
                <ScrollReveal delay={200} duration={600}>
                  <p>A donné&nbsp;: mondain, altermondialiste, immonde (qui ne peut être purifié).</p>
                </ScrollReveal>
                <ScrollReveal delay={300} duration={600}>
                  <p>
                    En sanskrit, <em>moun</em>&nbsp;: ensemble harmonieux du ciel et de la terre / univers / globe terrestre / terre habitée / ensemble des nations.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={400} duration={600}>
                  <p className="text-white/80 font-medium">
                    En français&nbsp;: Ensemble des choses et des êtres existants.
                  </p>
                </ScrollReveal>
              </div>

              {/* TRIBA */}
              <ScrollReveal direction="left" duration={800}>
                <h3 className="font-display text-2xl font-bold mb-6">
                  <span className="text-primary">TriBa</span>, dérivé du latin <em>tribus</em>&nbsp;: groupe social, famille.
                </h3>
              </ScrollReveal>
              <div className="space-y-3 text-white/60 leading-relaxed -mt-10">
                <ScrollReveal delay={100} duration={600}>
                  <p>
                    En sanskrit&nbsp;: <em>jāti</em>, qui signifie naissance. <em>sheng</em> 生 en chinois&nbsp;: de même langage.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={200} duration={600}>
                  <p>
                    Dans les langues indo-européennes, désigne l'appartenance à une même naissance, à la même terre.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={250} duration={600}>
                  <p>
                    Chez les Algonquin, d'un même esprit.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={300} duration={600}>
                  <p>
                    De l'indo-européen commun <em>trab</em>&nbsp;: poutre maîtresse de la maison. Qui donne <em>trev</em> en breton&nbsp;: hameau, groupe de maisons.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={350} duration={600}>
                  <p>
                    Du grec ancien <em>τρίβω</em>, <em>tribô</em>&nbsp;: ceux qui s'étendent sur (la terre) pour exister.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={400} duration={600}>
                  <p>
                    Selon les langues&nbsp;: plèbe, foule, ensemble des pauvres.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={450} duration={600}>
                  <p>
                    A donné les mots&nbsp;: tribunal, tribune, attribuer, contribution.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={500} duration={600}>
                  <p>
                    Affilié aux mots&nbsp;: clans, lignages, classes, fraternité, sororité.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={550} duration={600}>
                  <p className="text-white/80 font-medium">
                    En français&nbsp;: ensembles d'hommes et de femmes de toutes les générations qui se considèrent comme apparentés et solidaires.
                  </p>
                </ScrollReveal>
              </div>

              {/* Espéranto */}
              <ScrollReveal direction="up" duration={1200} scale={0.9}>
                <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-8 transition-all duration-500 hover:border-primary hover:bg-red-950/40 hover:shadow-2xl hover:shadow-primary/20 hover:scale-[1.02]">
                  <h3 className="font-display text-2xl font-bold mb-4">
                    En <span className="text-primary">espéranto</span>&nbsp;:
                  </h3>
                  <p className="text-white/80 leading-relaxed italic text-lg">
                    Triba mondo. Une planète comme univers unique, fini et infini / lien universel entre esprit, corps et nature / mise en commun des cultures et des histoires / Ensemble de tout ce que l'on connaît et de ce qui nous rassemble.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm transition-all animate-in fade-in duration-300"
          onClick={() => setSelectedImageIndex(null)}
        >
          <button 
            className="absolute top-6 right-6 z-[110] text-primary transition-transform hover:scale-110 p-2"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex(null);
            }}
          >
            <X className="h-10 w-10 stroke-[3px]" />
          </button>

          {/* Navigation Arrows */}
          <button
            className="absolute left-4 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-black/50 p-3 text-white/50 transition-all hover:bg-primary hover:text-black"
            onClick={prevImage}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            className="absolute right-4 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-black/50 p-3 text-white/50 transition-all hover:bg-primary hover:text-black"
            onClick={nextImage}
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          
          <div className="relative max-h-[70vh] max-w-[80vw] overflow-hidden rounded-xl shadow-2xl">
            <img
              key={selectedImageIndex}
              src={`/images/galerie/${galleryImages[selectedImageIndex]}`}
              alt="TriBa MonDo full preview"
              className="max-h-[70vh] w-auto object-contain animate-in zoom-in-95 duration-300"
            />
          </div>
        </div>
      )}
    </div>
  );
}
