
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

import ManageMaterials from "./components/admin/materials/ManageMaterials";
import ArchivedMaterials from "./components/admin/materials/ArchivedMaterials";
import Analytics from "./components/admin/analytics/Analytics";
import MyProfile from "./components/admin/profile/MyProfile";
import CreateOfficer from "./components/admin/accounts/CreateOfficer";
import ManageAccountLayout from "./components/admin/accounts/ManageAccountLayout";
import MyProfileLayout from "./layout/sub_layout/MyProfileLayout";
import UpdateProfile from "./components/admin/profile/UpdateProfile";
import ManageContentLayout from "./layout/sub_layout/ManageContentLayout";
import CreatePosts from "./components/admin/contents/CreatePosts";
import MaterialLayout from "./layout/sub_layout/MaterialLayout";
import AddMaterials from "./components/admin/materials/AddMaterials";
import StoresLayout from "./layout/sub_layout/StoresLayout";
import StoreApplicationLayout from "./layout/sub_layout/StoreApplicationLayout";
import ViewStoreApplication from "./components/admin/stores/ViewStoreApplication";
import ViewStoreApplicationLayout from "./layout/sub_layout/ViewStoreApplicationLayout";
import ViewDti from "./components/admin/stores/ViewDti";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./util/http";
import EditOfficer from "./components/admin/accounts/EditOfficer";
import PaymentRequest from "./components/admin/payments/PaymentRequest";
import ViewBarangayPermit from "./components/admin/stores/ViewBarangayPermit";
import ErrorPage from "./components/ErrorPage";
import ViewStore from "./components/admin/stores/ViewStore";
import ViewContent from "./components/admin/contents/ViewContent";
import EditContent from "./components/admin/contents/EditContent";
import ViewPaymentRequest from "./components/admin/payments/ViewPaymentRequest";
import PaymentLayout from "./layout/sub_layout/PaymentLayout";
import AccountActivation from "./components/landing_page/verify/AccountActivation";
const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "services", element: <Services /> },
      { path: "features", element: <Features /> },
      { path: "support", element: <Support /> },
      { path: "verify/:id", element: <AccountActivation /> },
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
      {
        path: 'stores', element: <StoresLayout />, children: [
          { index: true, element: <RegisteredStore /> },
          { path: ':id', element: <ViewStore /> },
          {
            path: 'application-request', element: <StoreApplicationLayout />, children: [
              { index: true, element: <StoreApplication /> },
              {
                path: ':id', element: <ViewStoreApplicationLayout />, children: [
                  { index: true, element: <ViewStoreApplication /> },
                  { path: 'dti', element: <ViewDti /> },
                  { path: 'barangay-permit', element: <ViewBarangayPermit /> },
                ]
              }
            ]
          },
          { path: 'archived', element: <ArchivedStores /> },
        ]
      },
      {
        path: 'accounts', element: <ManageAccountLayout />, children: [
          { index: true, element: <ManageAccounts /> },
          { path: 'add', element: <CreateOfficer /> },
          { path: 'archived', element: <ArchivedAccounts /> },
          { path: 'edit/:id', element: <EditOfficer /> },
        ]
      },
      { path: 'archived-accounts', element: <ArchivedAccounts /> },
      {
        path: 'contents', element: <ManageContentLayout />, children: [
          { index: true, element: <ManageContents /> },
          { path: ':id', element: <ViewContent /> },
          { path: 'edit/:id', element: <EditContent /> },
          { path: 'add', element: <CreatePosts /> },
          { path: 'archived', element: <ArchivedContents /> },
        ]
      },
      {
        path: 'payments', element: <PaymentLayout />, children: [
          {index: true, element:<PaymentRequest/>},
          {path:':id', element:<ViewPaymentRequest/>},
        ]
      },
      {
        path: 'materials', element: <MaterialLayout />, children: [
          { index: true, element: <ManageMaterials /> },
          { path: 'archived', element: <ArchivedMaterials /> },
          { path: 'add', element: <AddMaterials /> }
        ]
      },
      { path: 'reports', element: <Analytics /> },
      { path: 'my-profile', element: <MyProfileLayout />, children: [{ index: true, element: <MyProfile /> }, { path: 'update-profile', element: <UpdateProfile /> }] },
    ],
  },
]);

function App() {
  return <QueryClientProvider client={queryClient}><RouterProvider router={router} /></QueryClientProvider>;
}

export default App;
