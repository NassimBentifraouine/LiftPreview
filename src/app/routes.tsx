import { createBrowserRouter } from "react-router";
import SharedLayout from "./components/SharedLayout";
import HomePage from "./components/HomePage";
import GestionTiersPage from "./components/GestionTiersPage";
import GestionClientsPage from "./components/GestionClientsPage";
import ClientFormPage from "./components/ClientFormPage";
import TierFormPage from "./components/TierFormPage";
import BrouillonsPage from "./components/BrouillonsPage";
import ExportPage from "./components/ExportPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SharedLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "tiers", Component: GestionTiersPage },
      { path: "tiers/new", Component: TierFormPage },
      { path: "clients", Component: GestionClientsPage },
      { path: "clients/new", Component: ClientFormPage },
      { path: "brouillons", Component: BrouillonsPage },
      { path: "export", Component: ExportPage },
    ],
  },
]);
