import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes.js';
import './index.css';
import { DarkModeProvider } from './contexts/DarkModeContext.js';
import { AuthProvider } from './contexts/AuthContext.js';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';
import { AlertProvider } from './contexts/AlertContext.js';
function App() {
  return (
    <div className="App">
      <AlertProvider>
      <DarkModeProvider>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner />}>
          <Routes>
        {AppRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element}>
            {route.children?.map((child, childIndex) => (
              <Route key={childIndex} index={child.index} element={child.element} />
            ))}
          </Route>
        ))}
            </Routes>
          </Suspense>
        </AuthProvider>
      </DarkModeProvider>
      </AlertProvider>
    </div>
  );
}

export default App;