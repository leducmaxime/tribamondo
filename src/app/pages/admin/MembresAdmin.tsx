"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Image as ImageIcon, Upload, Check, ZoomIn, Move, Save, BookOpen } from "lucide-react";
import { useRequireAuth } from "@/app/hooks/useRequireAuth";
import { Toast } from "@/app/components/admin/Toast";

interface MemberCard {
  key: string;
  label: string;
  instrument: string;
  isGroup?: boolean;
}

const MEMBERS: MemberCard[] = [
  { key: "fred", label: "Fred André", instrument: "Batterie & percussions" },
  { key: "emmanuelle", label: "Emmanuelle Gabarra", instrument: "Chant & clavier" },
  { key: "marcel", label: "Marcel Hamon", instrument: "Clavier & percussions" },
  { key: "groupe", label: "Photo de groupe", instrument: "Notre histoire", isGroup: true },
];

const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  fred: "Fred capte le mouvement et lui donne forme. Percussionniste, batteur et compositeur, il est le trait d'union entre l'instinct et la maîtrise. De ses voyages musicaux – du rock aux rythmes profonds du Bénin, de Cuba, des musiques latines & Afro-Caribéennes. Il apprend à laisser la pulsation guider la musique. Il façonne l'energy brute, équilibre la dynamique du trio et inscrit chaque pièce dans un flux vivant et organique.",
  emmanuelle: "Emmanuelle fait du chant une matière vivante, en dialogue constant avec le corps et l'espace. Sa voix, tantôt ancrée, tantôt aérienne, danse entre les styles et les émotions, traçant des ponts entre les cultures et les sensibilités. L'improvisation est son terrain de jeu, un espace où elle cherche le timbre juste, celui qui émerge de l'instant et résonne au-delà des mots. À la croisée du souffle et du geste, elle façonne un chant qui vibre et qui rassemble.",
  marcel: "Marcel construit la musique comme on sculpte un espace sonore. Percussionniste, pianiste et compositeur, il assemble rythmes et harmonies avec une précision d'orfèvre, jouant sur les contrastes entre structures solides et textures mouvantes. Il façonne des paysages sonores où la tradition dialogue avec des explorations contemporaines, nous entraînant dans un univers évocateur, presque cinématographique.",
};

const DEFAULT_NOTRE_HISTOIRE = `TriBa MonDo est né d'une rencontre tardive mais nécessaire. Celle de trois musiciens, Emmanuelle, Fred et Marcel, collègues depuis près de vingt ans au Conservatoire Olivier Messiaen de Champigny-sur-Marne, réunis par un même désir de création libre, au-delà des cadres et des esthétiques.

Le trio rassemble Emmanuelle, pianiste classique concertiste et chanteuse, Marcel, percussionniste compositeur et arrangeur, et Fred, batteur, percussionniste et compositeur, nourri de musiques du monde.

Au fil de son parcours, Emmanuelle Gabarra a développé une pratique transversale mêlant interprétation classique, voix et scène. Elle a notamment été chanteuse au sein du groupe a cappella Mahna, consacré aux musiques du monde, carrière de pianiste soliste (Japon, europe, Amérique du Nord et du Sud) et en duo de quatre mains avec la pianiste Xenia Maliarevitch, (Festivals en Europe) ainsi que des collaborations with Bruno Dizien, et Ève Grinsztajn, danseuse à l'Opéra de Paris, dans des projets croisant musique et mouvement.

Marcel Hamon a évolué dans le champ de la musique symphonique et de la création contemporaine, collaborant notamment with Marco Zambelli, Michel Piquemal et Zahia Ziouani, et développant une approche ouverte des percussions, à la croisée de l'écriture orchestrale et des explorations sonores actuelles.

Fred André s'est forgé une identité rythmique et musicale, au croisement des musiques actuelles amplifiées et des musiques du monde de traditions orales. Il a notamment joué au sein de formations telles que The Barking Dogs (rock alternatif), Sita Lantaa (Afro-Groove) et Taï Phong (rock progressif), et a collaboré with des percussionnistes issus de différentes cultures, parmi lesquels Ayrald Petit, Milian Gali (Cuba) et Jean Adagbenon (Bénin).

Trois trajectoires singulières, trois cultures musicales affirmées, mises en dialogue dans un projet commun : TriBa MonDo, un espace de recherche et de création fondé sur la circulation des langages musicaux.

Après avoir existé sous différentes formes — quartet puis quintette — TriBa MonDo est revenu à une configuration essentielle : rythme, harmonie, mélodie. Un choix volontaire, favorisant l'écoute, l'interaction et une écriture plus directe, pensée pour la scène.

La musique de TriBa MonDo ne juxtapose pas les styles : elle les fait interférer. Rock, urbain, musiques du monde, classique, blues, soul et jazz constituent la matière vivante de leur travail. Ces influences, profondément intégrées, sont le reflet d'années de pratiques, d'écoutes et de croisements musicaux.

Le groupe s'inscrit pleinement dans la maturité de ses membres. Il ne s'agit pas de démontrer, mais de dire — quelque chose du monde, du temps, du rythme, de la mémoire collective et de l'énergie du live. Des parcours longtemps développés séparément convergent aujourd'hui with évidence.

Sur scène, TriBa MonDo propose une musique organique et évolutive, où écriture et improvisation cohabitent. Piano et voix, percussions acoustiques, batterie et textures sonores électroniques se répondent, construisant une matière musicale en transformation permanente. Le concert devient un espace de tension et de respiration, où la musique se façonne en temps réel, au contact du lieu et du public.

TriBa MonDo n'est pas un aboutissement, mais un territoire en mouvement : un lieu où les expériences se croisent, où les musiques dialoguent, et où l'écoute devient matière première.`;

interface PhotoData {
  url: string;
  imagePosX: number;
  imagePosY: number;
  imageScale: number;
}

interface CropEdit {
  x: number;
  y: number;
  scale: number;
}

export function MembresAdmin() {
  const { ready } = useRequireAuth();
  const [selected, setSelected] = useState<string>("fred");
  const [photos, setPhotos] = useState<Record<string, PhotoData>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadedOk, setUploadedOk] = useState(false);
  const [cropEdit, setCropEdit] = useState<CropEdit | null>(null);
  const [savingCrop, setSavingCrop] = useState(false);
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [savingDesc, setSavingDesc] = useState(false);
  const [savedDesc, setSavedDesc] = useState(false);
  const [notreHistoire, setNotreHistoire] = useState("");
  const [savingHistoire, setSavingHistoire] = useState(false);
  const [savedHistoire, setSavedHistoire] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  const dragRef = useRef<{ lastX: number; lastY: number } | null>(null);

  const member = MEMBERS.find((m) => m.key === selected)!;
  const photo = photos[selected];
  const posX = photo?.imagePosX ?? 50;
  const posY = photo?.imagePosY ?? 50;
  const scale = photo?.imageScale ?? 1;

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragRef.current || !cropEdit) return;
      const dx = e.clientX - dragRef.current.lastX;
      const dy = e.clientY - dragRef.current.lastY;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
      setCropEdit((prev) =>
        prev
          ? { ...prev, x: Math.max(0, Math.min(100, prev.x - dx * 0.5)), y: Math.max(0, Math.min(100, prev.y - dy * 0.5)) }
          : prev
      );
    }

    function onTouchMove(e: TouchEvent) {
      if (!dragRef.current || !cropEdit) return;
      e.preventDefault();
      const touch = e.touches[0];
      const dx = touch.clientX - dragRef.current.lastX;
      const dy = touch.clientY - dragRef.current.lastY;
      dragRef.current.lastX = touch.clientX;
      dragRef.current.lastY = touch.clientY;
      setCropEdit((prev) =>
        prev
          ? { ...prev, x: Math.max(0, Math.min(100, prev.x - dx * 0.5)), y: Math.max(0, Math.min(100, prev.y - dy * 0.5)) }
          : prev
      );
    }

    function onDragEnd() {
      dragRef.current = null;
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onDragEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onDragEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onDragEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onDragEnd);
    };
  }, [cropEdit]);

  useEffect(() => {
    if (!ready) return;
    loadAll();
  }, [ready]);

  useEffect(() => {
    setCropEdit(null);
    setUploadedOk(false);
  }, [selected]);

  async function loadAll() {
    await Promise.all([fetchPhotos(), fetchSiteContent()]);
  }

  async function fetchPhotos() {
    try {
      const res = await fetch("/api/member-photos");
      const data = (await res.json()) as { success: boolean; data: Record<string, PhotoData> };
      if (data.success) setPhotos(data.data);
    } catch {}
    finally { setLoading(false); }
  }

  async function fetchSiteContent() {
    try {
      const res = await fetch("/api/site-content");
      const data = (await res.json()) as { success: boolean; data: Record<string, string> };
      if (data.success) {
        const descs: Record<string, string> = {};
        for (const key of ["fred", "emmanuelle", "marcel"]) {
          descs[key] = data.data[`description_${key}`] ?? DEFAULT_DESCRIPTIONS[key];
        }
        setDescriptions(descs);
        setNotreHistoire(data.data["notre_histoire"] ?? DEFAULT_NOTRE_HISTOIRE);
      } else {
        setDescriptions({ fred: DEFAULT_DESCRIPTIONS.fred, emmanuelle: DEFAULT_DESCRIPTIONS.emmanuelle, marcel: DEFAULT_DESCRIPTIONS.marcel });
        setNotreHistoire(DEFAULT_NOTRE_HISTOIRE);
      }
    } catch {
      setDescriptions({ fred: DEFAULT_DESCRIPTIONS.fred, emmanuelle: DEFAULT_DESCRIPTIONS.emmanuelle, marcel: DEFAULT_DESCRIPTIONS.marcel });
      setNotreHistoire(DEFAULT_NOTRE_HISTOIRE);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = (await uploadRes.json()) as { success: boolean; url: string; error?: string };
      if (!uploadData.success) {
        setToast({ message: "Erreur lors de l'opération", type: "error" });
        return;
      }
      await fetch(`/api/member-photos/${selected}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: uploadData.url }),
      });
      const newPhoto = { url: uploadData.url, imagePosX: 50, imagePosY: 50, imageScale: 1, ...photos[selected] ? { imagePosX: photos[selected].imagePosX, imagePosY: photos[selected].imagePosY, imageScale: photos[selected].imageScale } : {} };
      setPhotos((prev) => ({ ...prev, [selected]: { ...newPhoto, url: uploadData.url } }));
      setUploadedOk(true);
      setTimeout(() => setUploadedOk(false), 2500);
    } catch {
      setToast({ message: "Erreur lors de l'opération", type: "error" });
    }
    finally { setUploading(false); e.target.value = ""; }
  }

  function openCrop() {
    if (!photo) return;
    setCropEdit({ x: photo.imagePosX, y: photo.imagePosY, scale: photo.imageScale });
  }

  function handleDragStart(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    dragRef.current = { lastX: clientX, lastY: clientY };
  }

  async function saveCrop() {
    if (!cropEdit) return;
    setSavingCrop(true);
    try {
      const res = await fetch(`/api/member-photos/${selected}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePosX: cropEdit.x, imagePosY: cropEdit.y, imageScale: cropEdit.scale }),
      });
      const data = (await res.json()) as { success: boolean };
      if (data.success) {
        setPhotos((prev) => ({ ...prev, [selected]: { ...prev[selected], imagePosX: cropEdit.x, imagePosY: cropEdit.y, imageScale: cropEdit.scale } }));
        setCropEdit(null);
      } else {
        setToast({ message: "Erreur lors de l'opération", type: "error" });
      }
    } catch {
      setToast({ message: "Erreur lors de l'opération", type: "error" });
    }
    finally { setSavingCrop(false); }
  }

  async function saveDescription() {
    setSavingDesc(true);
    try {
      await fetch(`/api/site-content/description_${selected}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: descriptions[selected] }),
      });
      setSavedDesc(true);
      setTimeout(() => setSavedDesc(false), 2500);
    } catch {
      setToast({ message: "Erreur lors de l'opération", type: "error" });
    }
    finally { setSavingDesc(false); }
  }

  async function saveNotreHistoire() {
    setSavingHistoire(true);
    try {
      await fetch("/api/site-content/notre_histoire", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: notreHistoire }),
      });
      setSavedHistoire(true);
      setTimeout(() => setSavedHistoire(false), 2500);
    } catch {
      setToast({ message: "Erreur lors de l'opération", type: "error" });
    }
    finally { setSavingHistoire(false); }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  const cropActive = cropEdit !== null;
  const displayCrop = cropActive ? cropEdit : { x: posX, y: posY, scale };

  return (
    <div className="min-h-screen py-20">
      <div className="container max-w-3xl">
        <div className="mb-6">
          <a href="/admin" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Retour au Dashboard
          </a>
        </div>

        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold">
            Gestion du <span className="text-primary">Groupe</span>
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {MEMBERS.map((m) => {
            const p = photos[m.key];
            const isActive = selected === m.key;
            const px = p?.imagePosX ?? 50;
            const py = p?.imagePosY ?? 50;
            const ps = p?.imageScale ?? 1;

            return (
              <button
                key={m.key}
                onClick={() => setSelected(m.key)}
                className={`group relative flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all ${
                  isActive
                    ? "border-primary bg-red-950/30 shadow-lg shadow-primary/20"
                    : "border-white/10 bg-black/40 hover:border-primary/40 hover:bg-red-950/10"
                }`}
              >
                <div className={`relative ${m.isGroup ? "w-full h-16 rounded-xl overflow-hidden" : "h-16 w-16 rounded-full overflow-hidden border-2 " + (isActive ? "border-primary" : "border-white/20 group-hover:border-primary/50")}`}>
                  {p?.url ? (
                    <img
                      src={p.url}
                      alt={m.label}
                      className="h-full w-full object-cover"
                      style={{ objectPosition: `${px}% ${py}%`, transform: `scale(${ps})`, transformOrigin: "center" }}
                    />
                  ) : m.isGroup ? (
                    <div className="flex h-full w-full items-center justify-center bg-white/5">
                      <BookOpen className="h-5 w-5 text-white/20" />
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/5">
                      <ImageIcon className="h-5 w-5 text-white/20" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className={`text-xs font-semibold leading-tight transition-colors ${isActive ? "text-primary" : "text-white/80 group-hover:text-white"}`}>
                    {m.isGroup ? "Groupe" : m.label.split(" ")[0]}
                  </p>
                  {m.instrument && (
                    <p className="text-[10px] text-white/30 mt-0.5">{m.instrument}</p>
                  )}
                </div>
                {isActive && (
                  <span className="absolute -bottom-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>

        {member.isGroup && !cropActive && (
          <div className="-mx-4 mb-4 overflow-hidden rounded-2xl border border-red-500/20">
            {photo?.url ? (
              <img
                src={photo.url}
                alt="Photo de groupe"
                className="w-full object-cover h-[390px]"
                style={{ objectPosition: `${displayCrop.x}% ${displayCrop.y}%`, transform: `scale(${displayCrop.scale})`, transformOrigin: "center" }}
              />
            ) : (
              <div className="flex h-[390px] items-center justify-center bg-black/40 text-white/20">
                <ImageIcon className="h-10 w-10" />
              </div>
            )}
          </div>
        )}

        {member.isGroup && cropActive && photo?.url && (
          <div className="-mx-4 mb-4">
            <div
              className="overflow-hidden rounded-2xl border border-red-500/20 cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              <img
                src={photo.url}
                className="w-full object-cover h-[390px] pointer-events-none"
                style={{ objectPosition: `${cropEdit!.x}% ${cropEdit!.y}%`, transform: `scale(${cropEdit!.scale})`, transformOrigin: "center" }}
                draggable={false}
              />
            </div>
            <div className="mt-3 px-1">
              <div className="flex items-center justify-between text-xs text-white/40 mb-1.5">
                <span className="flex items-center gap-1"><ZoomIn className="h-3 w-3" /> Zoom</span>
                <span>{Math.round(cropEdit!.scale * 100)}%</span>
              </div>
              <input
                type="range" min={1} max={2} step={0.01} value={cropEdit!.scale}
                onChange={(e) => setCropEdit((prev) => prev ? { ...prev, scale: parseFloat(e.target.value) } : prev)}
                className="w-full accent-red-500"
              />
              <div className="flex gap-2 mt-3">
                <button onClick={() => setCropEdit(null)} className="flex-1 rounded-full border border-white/10 px-3 py-2 text-sm text-white/50 hover:text-white transition-colors">
                  Annuler
                </button>
                <button
                  onClick={saveCrop}
                  disabled={savingCrop}
                  className="flex-1 rounded-full bg-primary px-3 py-2 text-sm font-semibold text-black hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
                >
                  {savingCrop ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-red-500/20 bg-black/50 p-6 sm:p-8">
          {member.isGroup ? (
            <>
              <h2 className="font-display text-xl font-bold mb-1">
                Photo de <span className="text-primary">groupe</span>
              </h2>
              <p className="text-xs text-white/40 mb-4">Affichée au-dessus de « Notre histoire »</p>

              <div className="flex flex-wrap gap-2 mb-6">
                <label className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
                  uploadedOk ? "border-green-500/50 bg-green-950/30 text-green-400" : "border-primary/40 bg-primary/10 text-primary hover:bg-primary hover:text-black"
                } ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
                  {uploadedOk ? <><Check className="h-4 w-4" /> Photo mise à jour</> : uploading ? <><Upload className="h-4 w-4 animate-bounce" /> Upload…</> : <><Upload className="h-4 w-4" /> Changer la photo</>}
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                </label>
                {photo?.url && !cropActive && (
                  <button onClick={openCrop} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/60 hover:border-primary/50 hover:text-primary transition-colors">
                    Recadrer
                  </button>
                )}
              </div>

              <div className="border-t border-white/5 pt-6">
                <h3 className="font-display text-lg font-bold mb-1">
                  Notre <span className="text-primary">histoire</span>
                </h3>
                <p className="text-xs text-white/40 mb-3">Paragraphes séparés par une ligne vide.</p>
                <textarea
                  value={notreHistoire}
                  onChange={(e) => setNotreHistoire(e.target.value)}
                  rows={16}
                  className="w-full rounded-lg border border-red-500/20 bg-black/60 px-3 py-2.5 text-sm text-white/80 focus:border-primary focus:outline-none resize-none"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={saveNotreHistoire}
                    disabled={savingHistoire}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
                      savedHistoire ? "border-green-500/50 bg-green-950/30 text-green-400" : "border-primary/40 bg-primary/10 text-primary hover:bg-primary hover:text-black"
                    } disabled:opacity-50`}
                  >
                    {savedHistoire ? <><Check className="h-4 w-4" /> Enregistré</> : <><Save className="h-4 w-4" /> {savingHistoire ? "Enregistrement…" : "Enregistrer"}</>}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="font-display text-xl font-bold mb-0.5">
                {member.label}
              </h2>
              <p className="text-sm text-primary mb-6">{member.instrument}</p>

              <div className="flex items-start gap-6 mb-6">
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-primary/30 bg-black/60">
                  {photo?.url ? (
                    <img
                      src={photo.url}
                      alt={member.label}
                      className="h-full w-full object-cover"
                      style={{ objectPosition: `${displayCrop.x}% ${displayCrop.y}%`, transform: `scale(${displayCrop.scale})`, transformOrigin: "center" }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-7 w-7 text-white/20" />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <label className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
                    uploadedOk ? "border-green-500/50 bg-green-950/30 text-green-400" : "border-primary/40 bg-primary/10 text-primary hover:bg-primary hover:text-black"
                  } ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
                    {uploadedOk ? <><Check className="h-4 w-4" /> Photo mise à jour</> : uploading ? <><Upload className="h-4 w-4 animate-bounce" /> Upload…</> : <><Upload className="h-4 w-4" /> Changer la photo</>}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                  {photo?.url && !cropActive && (
                    <button onClick={openCrop} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/60 hover:border-primary/50 hover:text-primary transition-colors">
                      Recadrer
                    </button>
                  )}
                </div>
              </div>

              {cropActive && (
                <div className="mb-6">
                  <CropPanel
                    photo={photo}
                    cropEdit={cropEdit!}
                    onDragStart={handleDragStart}
                    onScaleChange={(v) => setCropEdit((prev) => prev ? { ...prev, scale: v } : prev)}
                    onCancel={() => setCropEdit(null)}
                    onSave={saveCrop}
                    saving={savingCrop}
                  />
                </div>
              )}

              <div className="border-t border-white/5 pt-6">
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Description affichée sur la page Le Groupe
                </label>
                <textarea
                  value={descriptions[selected] ?? ""}
                  onChange={(e) => setDescriptions((prev) => ({ ...prev, [selected]: e.target.value }))}
                  rows={6}
                  className="w-full rounded-lg border border-red-500/20 bg-black/60 px-3 py-2.5 text-sm text-white/80 focus:border-primary focus:outline-none resize-none"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={saveDescription}
                    disabled={savingDesc}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
                      savedDesc ? "border-green-500/50 bg-green-950/30 text-green-400" : "border-primary/40 bg-primary/10 text-primary hover:bg-primary hover:text-black"
                    } disabled:opacity-50`}
                  >
                    {savedDesc ? <><Check className="h-4 w-4" /> Enregistré</> : <><Save className="h-4 w-4" /> {savingDesc ? "Enregistrement…" : "Enregistrer"}</>}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

function CropPanel({
  photo,
  cropEdit,
  onDragStart,
  onScaleChange,
  onCancel,
  onSave,
  saving,
  variant = "round",
}: {
  photo: PhotoData;
  cropEdit: CropEdit;
  onDragStart: (e: React.MouseEvent | React.TouchEvent) => void;
  onScaleChange: (v: number) => void;
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
  variant?: "round" | "card";
}) {
  const isCard = variant === "card";
  return (
    <div className="rounded-xl border border-primary/30 bg-black/60 p-4">
      <p className="text-xs text-white/40 mb-3 text-center flex items-center justify-center gap-1.5">
        <Move className="h-3 w-3" />
        Faites glisser pour recadrer
      </p>
      <div className={`flex justify-center mb-4 ${isCard ? '-mx-4' : ''}`}>
        <div
          className={`relative overflow-hidden border-2 border-primary/30 cursor-grab active:cursor-grabbing select-none ${
            isCard ? "w-full h-[320px] rounded-2xl" : "h-48 w-48 rounded-full"
          }`}
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
        >
          <img
            src={photo.url}
            className="h-full w-full object-cover pointer-events-none"
            style={{ objectPosition: `${cropEdit.x}% ${cropEdit.y}%`, transform: `scale(${cropEdit.scale})`, transformOrigin: "center" }}
            draggable={false}
          />
          {isCard && (
            <div className="absolute inset-0 flex items-end justify-center rounded-2xl bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 pointer-events-none">
              <p className="text-center text-sm font-bold text-white">Fred André</p>
            </div>
          )}
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-white/40 mb-1.5">
          <span className="flex items-center gap-1"><ZoomIn className="h-3 w-3" /> Zoom</span>
          <span>{Math.round(cropEdit.scale * 100)}%</span>
        </div>
        <input
          type="range" min={1} max={2} step={0.01} value={cropEdit.scale}
          onChange={(e) => onScaleChange(parseFloat(e.target.value))}
          className="w-full accent-red-500"
        />
      </div>
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 rounded-full border border-white/10 px-3 py-2 text-sm text-white/50 hover:text-white transition-colors">
          Annuler
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="flex-1 rounded-full bg-primary px-3 py-2 text-sm font-semibold text-black hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}
