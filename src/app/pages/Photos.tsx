"use client";

import { useState, useEffect } from "react";
import { ScrollUp } from "@/components/common/ScrollUp";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryPhoto } from "@/types/database";

export function Photos() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    try {
      const res = await fetch("/api/photos");
      const data = await res.json() as { success: boolean; data: GalleryPhoto[] };
      if (data.success) {
        setPhotos(data.data.sort((a, b) => a.order_index - b.order_index));
      }
    } catch (error) {
      console.error("Failed to fetch photos", error);
    } finally {
      setLoading(false);
    }
  }

  function prevImage() {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex(selectedImageIndex === 0 ? photos.length - 1 : selectedImageIndex - 1);
  }

  function nextImage() {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex(selectedImageIndex === photos.length - 1 ? 0 : selectedImageIndex + 1);
  }

  return (
    <div className="flex flex-col">
      <ScrollUp />

      {/* Hero */}
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden pt-20 md:min-h-[60vh]">
        <div className="absolute inset-0">
          <img
            src="/images/galerie/concert-1.png"
            alt="TriBa MonDo Photos"
            className="h-full w-full object-cover"
            fetchPriority="high"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black" />
        </div>
        <div className="container relative z-10 py-20 text-center">
          <p className="electro-glitch mb-4 text-sm font-medium uppercase tracking-[0.3em] text-primary/80" data-text="Galerie">
            Galerie
          </p>
          <h1 className="font-display text-5xl font-bold md:text-7xl">
            <span className="text-primary">Photos</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
            Captures d'instants, de vibrations et de rencontres.
          </p>
        </div>
      </section>

      {/* Photos Grid */}
      <section className="bg-black py-24">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-white/50">Chargement des photos...</p>
              </div>
            ) : photos.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-white/50">Aucune photo disponible.</p>
              </div>
            ) : (
              photos.map((photo, index) => (
                <ScrollReveal
                  key={photo.id}
                  delay={index * 50}
                  direction="up"
                  scale={0.9}
                >
                  <div
                    onClick={() => setSelectedImageIndex(index)}
                    className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border border-red-500/20 bg-red-950/5 transition-all hover:border-primary/50"
                  >
                    <img
                      src={photo.url}
                      alt={photo.description || `TriBa MonDo - Photo ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm transition-all animate-in fade-in duration-300"
          onClick={() => setSelectedImageIndex(null)}
        >
          <button
            className="absolute top-6 right-6 z-[10001] text-primary transition-transform hover:scale-110 p-2"
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
            {photos[selectedImageIndex] && (
              <img
                key={selectedImageIndex}
                src={photos[selectedImageIndex].url}
                alt={photos[selectedImageIndex].description || "TriBa MonDo"}
                className="max-h-[70vh] w-auto object-contain animate-in zoom-in-95 duration-300"
                loading="eager"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
