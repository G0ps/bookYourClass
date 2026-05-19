import { BrowserRouter, Routes, Route } from "react-router-dom";
import Authentication from "./authentication/Authentication.jsx";

/**
 * Route Configuration
 */

const APP_ROUTES = [
  {
    path: "/",
    element: <><Authentication></Authentication></>,
  },
  {
    path: "/about",
    element: <div>About</div>,
  },
  {
    path: "/login",
    element: <div>Login</div>,
  },
];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {APP_ROUTES.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;