import { Toaster } from "@/components/ui/sonner";
import CalendarPage from "@/pages/CalendarPage";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute();

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: CalendarPage,
});

const routeTree = rootRoute.addChildren([calendarRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="bottom-right" />
    </>
  );
}
