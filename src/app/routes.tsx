import { createBrowserRouter } from "react-router";
import { OnboardingWelcome } from "./components/OnboardingWelcome";
import { OnboardingQuestion } from "./components/OnboardingQuestion";
import { OnboardingCard } from "./components/OnboardingCard";
import { ScanCamera } from "./components/ScanCamera";
import { ScanReview } from "./components/ScanReview";
import { ScanResults } from "./components/ScanResults";
import { ItemDetail } from "./components/ItemDetail";
import { AllergyCard } from "./components/AllergyCard";
import { EditCardPage } from "./components/EditCardPage";
import { ExploreMap } from "./components/ExploreMap";
import { RestaurantDetail } from "./components/RestaurantDetail";
import { Bookmarks } from "./components/Bookmarks";
import { TravelGuide } from "./components/TravelGuide";
import { Profile } from "./components/Profile";
import { ContactRestaurant } from "./components/ContactRestaurant";

export const router = createBrowserRouter([
  { path: "/", Component: OnboardingWelcome },
  { path: "/onboarding/card", Component: OnboardingCard },
  { path: "/onboarding/:step", Component: OnboardingQuestion },
  { path: "/scan", Component: ScanCamera },
  { path: "/scan/review", Component: ScanReview },
  { path: "/scan/results", Component: ScanResults },
  { path: "/scan/item", Component: ItemDetail },
  { path: "/allergy-card", Component: AllergyCard },
  { path: "/edit-card", Component: EditCardPage },
  { path: "/explore", Component: ExploreMap },
  { path: "/explore/restaurant", Component: RestaurantDetail },
  { path: "/explore/bookmarks", Component: Bookmarks },
  { path: "/explore/contact", Component: ContactRestaurant },
  { path: "/travel", Component: TravelGuide },
  { path: "/profile", Component: Profile },
]);