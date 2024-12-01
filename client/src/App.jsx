import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/landing_page/home/Home";
import IndexLayout from "./layout/IndexLayout";
import About from "./components/landing_page/about/About";
import Services from "./components/landing_page/services/Services";
import Features from "./components/landing_page/features/Features";
import Support from "./components/landing_page/support/Support";
import Login from "./components/admin/Login";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./components/admin/dashboard/Dashboard";
import StoreApplication from "./components/admin/stores/StoreApplication";
import RegisteredStore from "./components/admin/stores/RegisteredStore";
import ArchivedStores from "./components/admin/stores/ArchivedStores";
import ManageAccounts from "./components/admin/accounts/ManageAccounts";
import ArchivedAccounts from "./components/admin/accounts/ArchivedAccounts";
import ManageContents from "./components/admin/contents/ManageContents";
import ArchivedContents from "./components/admin/contents/ArchivedContents";
import CollectionSchedules from "./components/admin/schedules/CollectionSchedules";
import ManageMaterials from "./components/admin/materials/ManageMaterials";
import ArchivedMaterials from "./components/admin/materials/ArchivedMaterials";
import Analytics from "./components/admin/analytics/Analytics";
import MyProfile from "./components/admin/profile/MyProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "services", element: <Services /> },
      { path: "features", element: <Features /> },
      { path: "support", element: <Support /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'application-request', element: <StoreApplication /> },
      { path: 'registered-stores', element: <RegisteredStore /> },
      { path: 'archived-stores', element: <ArchivedStores /> },
      { path: 'manage-accounts', element: <ManageAccounts /> },
      { path: 'archived-accounts', element: <ArchivedAccounts /> },
      { path: 'manage-contents', element: <ManageContents /> },
      { path: 'archived-contents', element: <ArchivedContents /> },
      { path: 'collection-schedules', element: <CollectionSchedules /> },
      { path: 'manage-materials', element: <ManageMaterials /> },
      { path: 'archived-materials', element: <ArchivedMaterials /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'my-profile', element: <MyProfile /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
