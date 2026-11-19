'use client';
import { create } from 'zustand';
import type { AgeGroup, ProductType, Variant } from '@/types';

interface CalculatorState {
  ageGroup:              AgeGroup | null;
  birthDate:             Date | null;
  questionnaireComplete: boolean;
  selectedProduct:       ProductType | null;
  selectedVariant:       Variant | null;
  addons: {
    mediplan:          boolean;
    medicalAssistance: boolean;
    globalDoctors:     boolean;
  };
  /** Adres e-mail z wysłanego formularza — tylko do wyświetlenia na stronie sukcesu. */
  submittedEmail:        string | null;
  setAgeGroup:              (g: AgeGroup) => void;
  setBirthDate:             (d: Date) => void;
  setQuestionnaireComplete: (v: boolean) => void;
  setProduct:               (p: ProductType) => void;
  setVariant:               (v: Variant) => void;
  toggleAddon:              (key: 'mediplan' | 'medicalAssistance' | 'globalDoctors') => void;
  setSubmittedEmail:        (email: string) => void;
  reset:                    () => void;
}

// NIE używamy persist — stan żyje wyłącznie w pamięci karty przeglądarki.
// Dane medyczne i kontaktowe nie mogą trafić do localStorage/sessionStorage.
export const useCalculatorStore = create<CalculatorState>((set) => ({
  ageGroup: null,
  birthDate: null,
  questionnaireComplete: false,
  selectedProduct: null,
  selectedVariant: null,
  addons: { mediplan: false, medicalAssistance: false, globalDoctors: false },
  submittedEmail: null,

  setAgeGroup:              (g) => set({ ageGroup: g }),
  setBirthDate:             (d) => set({ birthDate: d }),
  setQuestionnaireComplete: (v) => set({ questionnaireComplete: v }),
  setProduct:               (p) => set({ selectedProduct: p, selectedVariant: null }),
  setVariant:               (v) => set({ selectedVariant: v }),
  toggleAddon:              (key) => set((s) => ({
    addons: { ...s.addons, [key]: !s.addons[key] },
  })),
  setSubmittedEmail:        (email) => set({ submittedEmail: email }),
  reset: () => set({
    ageGroup: null, birthDate: null,
    questionnaireComplete: false,
    selectedProduct: null, selectedVariant: null,
    addons: { mediplan: false, medicalAssistance: false, globalDoctors: false },
    submittedEmail: null,
  }),
}));
