import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AppProvider, useApp } from "./store";
import { useEffect } from "react";

function AutoRedirect() {
  const { onboardingComplete } = useApp();

  useEffect(() => {
    // Only redirect from the root welcome screen, not mid-onboarding pages
    const hash = window.location.hash;
    if (onboardingComplete && (hash === "" || hash === "#/")) {
      router.navigate("/scan", { replace: true });
    }
  }, [onboardingComplete]);

  return null;
}

export default function App() {
  return (
    <AppProvider>
      <div
        className="mx-auto h-screen max-w-[430px] bg-white relative overflow-hidden"
        style={{ fontFamily: "'Geist', sans-serif" }}
      >
        <AutoRedirect />
        <RouterProvider router={router} />
      </div>
    </AppProvider>
  );
}
