import { lazy } from 'react';
import { ProtectedRoute} from './components/ProtectedRoutes/ProtectedRoute.js'; // Fixed import path
import Home from "./components/HomePage/HomePage.js";
import Register from "./Pages/register.js";
import Login from "./Pages/login.js"; 
import NotFoundPage from "./components/NotFound.js";
// Lazy load dashboard components for better performance
const Main = lazy(() => import("./Pages/DashboardRedirect.jsx"));
const DevicePage = lazy(() => import("./Pages/SAdmindashboard/DevicePage.jsx"));
const UserPage = lazy(() => import("./Pages/SAdmindashboard/UserPage.jsx"));
const Factory = lazy(() => import("./Pages/SAdmindashboard/FactoryPage.jsx"));
const License = lazy(() => import("./Pages/SAdmindashboard/LicensePage.jsx"));
const AddUser = lazy(() => import("./components/User/AddUser.js"));
const AddFactory = lazy(() => import("./components/Factory/AddFactory.js"));
const Profile =lazy(() => import ("./components/features/users/Profile/UserProfile.jsx"))
const UserInfo =lazy(()=> import("./components/features/users/Profile/UserInfo.jsx") )
const PersoInfoCard =lazy(()=> import("./components/features/users/Profile/PersoInfoCard.jsx") )
const LicensePlan =lazy(()=> import("./Pages/FAdmindashboard/LicensePlan.jsx") )
const AppRoutes = [
  // Public routes (no authentication required)
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
    path: "/NotFoundPage",
    element: <NotFoundPage /> 
  },

  // Protected routes (require authentication)
  {
    path: "/main",
    //element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Main />
      }
    ]
  },
  {
    path: "/Device",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <DevicePage />
      }
    ]
  },
  {
    path: "/User",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <UserPage />
      }
    ]
  },
  {
    path: "/License",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <License />
      }
    ]
  },
  {
    path: "/Factory",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Factory />
      }
    ]
  },
  {
    path: "/add-user",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <AddUser />
      }
    ]
  },
  {
    path: "/factories/new",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <AddFactory />
      }
    ]
  },{
    path: "/Profile",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Profile/>
      }
    ]
  },
  {
    path: "/UserInfo",
//element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <UserInfo/>
      }
    ]
  },
  {
    path: "/PersoInfoCard",
//element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <PersoInfoCard/>
      }
    ]
  }, {
    path: "/LicensePlan",
//element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <LicensePlan/>
      }
    ]
  },

// Fallback route for 404 errors
  {
    path: "*",
    element: <NotFoundPage />
  }
];

export default AppRoutes;