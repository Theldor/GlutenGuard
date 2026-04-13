import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AppProvider } from "./store";

export default function App() {
  return (
    <AppProvider>
      <div
        className="mx-auto h-screen max-w-[430px] bg-white relative overflow-hidden"
        style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
      >
        <RouterProvider router={router} />
      </div>
    </AppProvider>
  );
}