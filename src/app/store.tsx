import { createContext, useContext, useState, ReactNode } from "react";

export interface CardSection {
  id: string;
  label: string;
  content: string;
  fontSize: number;
  isVisible: boolean;
  isEditable: boolean;
}

export interface UserProfile {
  name: string;
  reason: number[]; // Array of selected reasons (now step 1, can select multiple)
  condition: string; // Medical condition (step 2)
  otherDietaryPreferences: string; // Additional dietary preferences
  symptomatic: number; // 0-3 (step 3)
  symptomNotes: string; // Additional symptom comments
  crossContamination: number; // 0-4 (step 4)
  crossContaminationNotes: string; // Additional cross-contamination comments
  isHelpingOther: boolean; // Track if helping someone else
  spokenLanguages?: string; // Languages the user speaks
  cardSections?: CardSection[]; // Custom card sections
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
}

const Ctx = createContext<AppState>({} as AppState);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, _setProfile] = useState<UserProfile>({
    name: "Your Name",
    reason: [],
    condition: "",
    otherDietaryPreferences: "",
    symptomatic: -1,
    symptomNotes: "",
    crossContamination: -1,
    crossContaminationNotes: "",
    isHelpingOther: false,
  });
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [cardLanguage, setCardLanguage] = useState("en");
  const [trips, setTrips] = useState<Trip[]>([]);

  const setProfile = (p: Partial<UserProfile>) =>
    _setProfile((prev) => ({ ...prev, ...p }));

  const addTrip = (trip: Trip) => setTrips((prev) => [...prev, trip]);

  const updateTrip = (id: string, updates: Partial<Trip>) =>
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === id ? { ...trip, ...updates } : trip
      )
    );

  const deleteTrip = (id: string) =>
    setTrips((prev) => prev.filter((trip) => trip.id !== id));

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
      }}
    >
      {children}
    </Ctx.Provider>
  );
}