import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CardSection {
  id: string;
  label: string;
  content: string;
  fontSize: number;
  isBold: boolean;
  isVisible: boolean;
  isEditable: boolean;
}

export interface UserProfile {
  name: string;
  reason: number[];
  condition: string;
  otherDietaryPreferences: string;
  symptomatic: number;
  symptomNotes: string;
  crossContamination: number;
  crossContaminationNotes: string;
  isHelpingOther: boolean;
  additionalRestrictions: string[];
  customBlockedIngredients: string[];
  spokenLanguages?: string;
  cardSections?: CardSection[];
}

type RiskLevel = "safe" | "caution";

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  riskLevel: RiskLevel;
  notes: string;
}

export interface Trip {
  id: string;
  name: string;
  location: string;
  image: string;
  startDate?: string;
  endDate?: string;
  restaurants: Restaurant[];
}

export interface ScanHistoryEntry {
  id: string;
  scannedAt: string;
  restaurant: string;
  cuisine: string;
  safeCount: number;
  cautionCount: number;
  avoidCount: number;
  results: unknown;
}

const STORAGE_KEY = "glutenguard_state";
const ACCOUNT_SNAPSHOT_KEY = "glutenguard_account_snapshot";
const SCAN_HISTORY_KEY = "glutenguard_scan_history";

const DEFAULT_PROFILE: UserProfile = {
  name: "Your Name",
  reason: [],
  condition: "",
  otherDietaryPreferences: "",
  symptomatic: -1,
  symptomNotes: "",
  crossContamination: -1,
  crossContaminationNotes: "",
  isHelpingOther: false,
  additionalRestrictions: [],
  customBlockedIngredients: [],
};

interface PersistedState {
  profile: UserProfile;
  onboardingComplete: boolean;
  cardLanguage: string;
  trips: Trip[];
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      return {
        profile: { ...DEFAULT_PROFILE, ...(parsed.profile ?? {}) },
        onboardingComplete: parsed.onboardingComplete ?? false,
        cardLanguage: parsed.cardLanguage ?? "en",
        trips: parsed.trips ?? [],
      };
    }
  } catch {
    // corrupted storage — start fresh
  }
  return {
    profile: DEFAULT_PROFILE,
    onboardingComplete: false,
    cardLanguage: "en",
    trips: [],
  };
}

function saveState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage quota exceeded or unavailable — silently ignore
  }
}

function loadAccountSnapshot(): PersistedState | null {
  try {
    const raw = localStorage.getItem(ACCOUNT_SNAPSHOT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      profile: { ...DEFAULT_PROFILE, ...(parsed.profile ?? {}) },
      onboardingComplete: parsed.onboardingComplete ?? true,
      cardLanguage: parsed.cardLanguage ?? "en",
      trips: parsed.trips ?? [],
    };
  } catch {
    return null;
  }
}

interface AppState {
  profile: UserProfile;
  setProfile: (p: Partial<UserProfile>) => void;
  onboardingComplete: boolean;
  setOnboardingComplete: (v: boolean) => void;
  cardLanguage: string;
  setCardLanguage: (v: string) => void;
  trips: Trip[];
  setTrips: (trips: Trip[]) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  signOut: () => void;
  restoreAccount: () => boolean;
  lastScanResults: unknown | null;
  setLastScanResults: (r: unknown | null) => void;
  scanHistory: ScanHistoryEntry[];
  addScanHistory: (entry: ScanHistoryEntry) => void;
}

const Ctx = createContext<AppState>({} as AppState);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }: { children: ReactNode }) {
  const initial = loadState();

  const [profile, _setProfile] = useState<UserProfile>(initial.profile);
  const [onboardingComplete, _setOnboardingComplete] = useState(initial.onboardingComplete);
  const [cardLanguage, _setCardLanguage] = useState(initial.cardLanguage);
  const [trips, _setTrips] = useState<Trip[]>(initial.trips);
  const [lastScanResults, setLastScanResults] = useState<unknown | null>(null);

  const [scanHistory, _setScanHistory] = useState<ScanHistoryEntry[]>(() => {
    try {
      const raw = localStorage.getItem(SCAN_HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  const addScanHistory = (entry: ScanHistoryEntry) => {
    _setScanHistory((prev) => {
      const next = [entry, ...prev].slice(0, 50);
      try { localStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // Persist every change to localStorage
  useEffect(() => {
    saveState({ profile, onboardingComplete, cardLanguage, trips });
  }, [profile, onboardingComplete, cardLanguage, trips]);

  const setProfile = (p: Partial<UserProfile>) =>
    _setProfile((prev) => ({ ...prev, ...p }));

  const setOnboardingComplete = (v: boolean) => _setOnboardingComplete(v);
  const setCardLanguage = (v: string) => _setCardLanguage(v);
  const setTrips = (t: Trip[]) => _setTrips(t);

  const addTrip = (trip: Trip) => _setTrips((prev) => [...prev, trip]);

  const updateTrip = (id: string, updates: Partial<Trip>) =>
    _setTrips((prev) =>
      prev.map((trip) => (trip.id === id ? { ...trip, ...updates } : trip))
    );

  const deleteTrip = (id: string) =>
    _setTrips((prev) => prev.filter((trip) => trip.id !== id));

  const signOut = () => {
    localStorage.setItem(
      ACCOUNT_SNAPSHOT_KEY,
      JSON.stringify({ profile, onboardingComplete, cardLanguage, trips }),
    );
    _setProfile(DEFAULT_PROFILE);
    _setOnboardingComplete(false);
    _setCardLanguage("en");
    _setTrips([]);
  };

  const restoreAccount = () => {
    const snapshot = loadAccountSnapshot();
    if (!snapshot) return false;
    _setProfile(snapshot.profile);
    _setOnboardingComplete(snapshot.onboardingComplete);
    _setCardLanguage(snapshot.cardLanguage);
    _setTrips(snapshot.trips);
    return true;
  };

  return (
    <Ctx.Provider
      value={{
        profile,
        setProfile,
        onboardingComplete,
        setOnboardingComplete,
        cardLanguage,
        setCardLanguage,
        trips,
        setTrips,
        addTrip,
        updateTrip,
        deleteTrip,
        signOut,
        restoreAccount,
        lastScanResults,
        setLastScanResults,
        scanHistory,
        addScanHistory,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
