import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Flash } from './components/Flash';

const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const Signup = lazy(() => import('./pages/Signup').then((m) => ({ default: m.Signup })));
const ListingsIndex = lazy(() => import('./pages/ListingsIndex').then((m) => ({ default: m.ListingsIndex })));
const ShowListing = lazy(() => import('./pages/ShowListing').then((m) => ({ default: m.ShowListing })));
const NewListing = lazy(() => import('./pages/NewListing').then((m) => ({ default: m.NewListing })));
const EditListing = lazy(() => import('./pages/EditListing').then((m) => ({ default: m.EditListing })));
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Profile = lazy(() => import('./pages/Profile'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-4 border-surface-container-high border-t-primary rounded-full animate-spin" />
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-page-fade">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/user/login" element={<Login />} />
          <Route path="/user/signup" element={<Signup />} />
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/listing" element={<ListingsIndex />} />
          <Route path="/listing/new" element={<NewListing />} />
          <Route path="/listings/:id" element={<ShowListing />} />
          <Route path="/listings/:id/edit" element={<EditListing />} />
          <Route path="*" element={<Navigate to="/listing" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <FavoritesProvider>
          <div className="flex flex-col min-h-screen bg-surface">
            <Navbar />
            <Flash />
            <div className="flex-1 w-full">
              <AnimatedRoutes />
            </div>
            <Footer />
          </div>
        </FavoritesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
