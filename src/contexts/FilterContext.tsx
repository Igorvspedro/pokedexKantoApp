import { createContext, ReactNode, useContext, useState } from 'react';

export type ClassificationType = 'todos' | 'comum' | 'pseudo' | 'lendario';

export type RegionType =
  | 'kanto' // gen 1
  | 'johto' // gen 2
  | 'hoenn' // gen 3
  | 'sinnoh' // gen 4
  | 'unova' // gen 5
  | 'kalos' // gen 6
  | 'alola' // gen 7
  | 'galar' // gen 8
  | 'paldea'; // gen 9

export const REGIONS: Record<RegionType, { label: string; limit: number; offset: number }> = {
  kanto: { label: 'Kanto (Gen I)', limit: 151, offset: 0 },
  johto: { label: 'Johto (Gen II)', limit: 100, offset: 151 },
  hoenn: { label: 'Hoenn (Gen III)', limit: 135, offset: 251 },
  sinnoh: { label: 'Sinnoh (Gen IV)', limit: 107, offset: 386 },
  unova: { label: 'Unova (Gen V)', limit: 156, offset: 493 },
  kalos: { label: 'Kalos (Gen VI)', limit: 72, offset: 649 },
  alola: { label: 'Alola (Gen VII)', limit: 88, offset: 721 },
  galar: { label: 'Galar (Gen VIII)', limit: 96, offset: 809 },
  paldea: { label: 'Paldea (Gen IX)', limit: 120, offset: 905 },
};

interface FilterContextData {
  selectedRegion: RegionType;
  selectedType: string | null;
  selectedClassification: ClassificationType;
  setRegion: (region: RegionType) => void;
  setType: (type: string | null) => void;
  setClassification: (classification: ClassificationType) => void;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextData | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [selectedRegion, setRegion] = useState<RegionType>('kanto');
  const [selectedType, setType] = useState<string | null>(null);
  const [selectedClassification, setClassification] = useState<ClassificationType>('todos');

  const clearFilters = () => {
    setType(null);
    setClassification('todos');
    // Não limparemos a região para n perder o contexto atual da tela
  };

  return (
    <FilterContext.Provider
      value={{
        selectedRegion,
        selectedType,
        selectedClassification,
        setRegion,
        setType,
        setClassification,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters deve ser usado dentro de um FilterProvider');
  }
  return context;
}
