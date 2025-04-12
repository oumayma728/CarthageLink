import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes.js';
import './index.css';
import { DarkModeProvider } from './contexts/DarkModeContext.js';
import { AuthProvider } from './contexts/AuthContext.js';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';

function App() {
  return (
    <div className="App">
      <DarkModeProvider>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {AppRoutes.map((route, index) => {
                if (route.children) {
                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={route.element}
                    >
                      {route.children.map((child, childIndex) => (
                        <Route
                          key={childIndex}
                          index={child.index}
                          path={child.path}
                          element={child.element}
                        />
                      ))}
                    </Route>
                  );
                }
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                  />
                );
              })}
            </Routes>
          </Suspense>
        </AuthProvider>
      </DarkModeProvider>
    </div>
  );
}

export default App;