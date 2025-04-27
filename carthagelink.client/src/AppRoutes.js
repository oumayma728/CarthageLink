import { lazy } from 'react';
import { ProtectedRoute } from './components/ProtectedRoutes/ProtectedRoute.js';
import Home from "./components/Main/HomePage.js";
import Register from "./Pages/register.js";
import Login from "./Pages/login.js"; 
import NotFoundPage from "./components/NotFound.js";

// Lazy-loaded components
const Main = lazy(() => import("./Pages/DashboardRedirect.jsx"));
const DevicePage = lazy(() => import("./Pages/SAdmindashboard/DevicePage.jsx"));
const UserPage = lazy(() => import("./Pages/SAdmindashboard/UserPage.jsx"));
const Factory = lazy(() => import("./Pages/SAdmindashboard/FactoryPage.jsx"));
const License = lazy(() => import("./Pages/SAdmindashboard/LicensePage.jsx"));
const AddUser = lazy(() => import("./components/User/AddUser.js"));
const AddFactory = lazy(() => import("./components/Factory/AddFactory.js"));
const Profile = lazy(() => import("./components/features/users/Profile/UserProfile.jsx"));
const UserInfo = lazy(() => import("./components/features/users/Profile/UserInfo.jsx"));
const PersoInfoCard = lazy(() => import("./components/features/users/Profile/PersoInfoCard.jsx"));
const LicensePlan = lazy(() => import("./Pages/FAdmindashboard/LicensePlan.jsx"));
const ResetPassword = lazy(() => import("./components/Layouts/User/ResetPassword.jsx"));
const FactoryUserPage = lazy(() => import("./Pages/FAdmindashboard/FactoryUserPage.jsx"));
const Alert = lazy(() => import("./components/Layouts/Dashboard/Alerts/Alert.jsx"));
const DevicesView = lazy(() => import("./components/features/Devices/DevicesView.jsx"));
const EditDevice = lazy(() => import("./components/features/Devices/EditDevice.jsx"));
const EditFactory = lazy(() => import("./components/features/factories/EditFactory.jsx"));
const EditLicense = lazy(() => import("./components/features/licenses/EditLicense.jsx"));
const EditUser = lazy(() => import("./components/features/users/EditUser.jsx"));
const Report = lazy(() => import("./Pages/Report/Report.jsx"));
const Settings = lazy(() => import("./Pages/Settings.jsx"));
const DeviceData = lazy(() => import("./components/Layouts/Dashboard/deviceData/index.jsx"));
//const Insights = lazy(() => import("./components/Layouts/Dashboard/insights/index.jsx"));
//const FactoryData = lazy(() => import("./FactoryData/index.jsx"));
const FactoryDevice = lazy(() => import("./Pages/FAdmindashboard/FactoryDevice.jsx"));
//const Settings = lazy(() => import("./components/Layouts/Settings.jsx"));
const OperatorDashboardPage= lazy(() => import("./Pages/Operatordashboard/OperatordashboardPage.jsx"));

const AppRoutes = [
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/ResetPassword",
    element: <ResetPassword />
  },
  {
    path: "/NotFoundPage",
    element: <NotFoundPage />
  },

  // ============ Protected Routes ============
  // In your router configuration (likely App.js or routes.js)

  {
    path: "/main",
    //element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Main />
      },
      {
        path: "device/:deviceId",
        element: <OperatorDashboardPage />
      }
    ]
  },
  // In your router file
{
  path: "/device/:deviceId",
  element: <OperatorDashboardPage />,
},
  {
    path: "/Device",
    // element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <DevicePage />
      }
    ]
  },
  {
    path: "/User",
    // element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <UserPage />
      }
    ]
  },
  {
    path: "/License",
    // element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <License />
      }
    ]
  },
  {
    path: "/Factory",
    // element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Factory />
      }
    ]
  },
  {
    path: "/add-user",
    // element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <AddUser />
      }
    ]
  },
  {
    path: "/factories/new",
    // element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <AddFactory />
      }
    ]
  },
  {
    path: "/Profile",
    // element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Profile />
      }
    ]
  },
  {
    path: "/UserInfo",
    // element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <UserInfo />
      }
    ]
  },
  {
    path: "/PersoInfoCard",
    // element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <PersoInfoCard />
      }
    ]
  },
  {
    path: "/LicensePlan",
    // element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <LicensePlan />
      }
    ]
  },
  {
    path: "/FactoryUsers",
    // element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <FactoryUserPage />
      }
    ]
  },
  {
    path: "/Alert",
    // element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Alert />
      }
    ]
  },
  {
    path: "/devices/view/:deviceId",
    // element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <DevicesView />
      }
    ]
  },
  {
    path: "/devices/edit/:id",
    // element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <EditDevice />
      }
    ]
  },
  {
    path: "/licenses/edit/:id",
    // element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <EditLicense />
      }
    ]
  },
  {
    path: "/factories/edit/:id",
    // element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <EditFactory />
      }
    ]
  },
  {
    path: "/users/edit/:id",
    // element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <EditUser />
      }
    ]
  },
  {
    path: "/Report",
    // element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Report />
      }
    ]
  },
  {
    path: "/settings",
    // element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Settings />
      }
    ]
  },

  {
    path: "/FactoryDevice/:deviceId",
    // element: <ProtectedRoute />,
    children: [
      { 
        index: true, 
        element: <FactoryDevice/> 
      }
    ]
  },
  {
    path: "/devices/:deviceId",
    //element: <ProtectedRoute />,
    children: [
      { 
        index: true, 
        element: <DeviceData /> 
      }
    ]
  },



  
  {
    path: "*",
    element: <NotFoundPage />
  }
];

export default AppRoutes;
