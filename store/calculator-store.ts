'use client';
import { create } from 'zustand';
import type { AgeGroup, ProductType, Variant } from '@/types';

interface CalculatorState {
  ageGroup:              AgeGroup | null;
  birthDate:             Date | null;
  questionnaireComplete: boolean;
  turnstileVerified:     boolean;
  selectedProduct:       ProductType | null;
  selectedVariant:       Variant | null;
  addons: {
    mediplan:          boolean;
    medicalAssistance: boolean;
    globalDoctors:     boolean;
  };
  setAgeGroup:              (g: AgeGroup) => void;
  setBirthDate:             (d: Date) => void;
  setQuestionnaireComplete: (v: boolean) => void;
  setTurnstileVerified:     (v: boolean) => void;
  setProduct:               (p: ProductType) => void;
  setVariant:               (v: Variant) => void;
  toggleAddon:              (key: 'mediplan' | 'medicalAssistance' | 'globalDoctors') => void;
  reset:                    () => void;
}

// NIE używamy persist — dane medyczne nie mogą trafić do localStorage
export const useCalculatorStore = create<CalculatorState>((set) => ({
  ageGroup: null,
  birthDate: null,
  questionnaireComplete: false,
  turnstileVerified: false,
  selectedProduct: null,
  selectedVariant: null,
  addons: { mediplan: false, medicalAssistance: false, globalDoctors: false },

  setAgeGroup:              (g) => set({ ageGroup: g }),
  setBirthDate:             (d) => set({ birthDate: d }),
  setQuestionnaireComplete: (v) => set({ questionnaireComplete: v }),
  setTurnstileVerified:     (v) => set({ turnstileVerified: v }),
  setProduct:               (p) => set({ selectedProduct: p, selectedVariant: null }),
  setVariant:               (v) => set({ selectedVariant: v }),
  toggleAddon:              (key) => set((s) => ({
    addons: { ...s.addons, [key]: !s.addons[key] },
  })),
  reset: () => set({
    ageGroup: null, birthDate: null,
    questionnaireComplete: false, turnstileVerified: false,
    selectedProduct: null, selectedVariant: null,
    addons: { mediplan: false, medicalAssistance: false, globalDoctors: false },
  }),
}));
