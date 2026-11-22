import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Privacy from '../pages/Privacy/Privacy';
import PeriodicTable from '../pages/PeriodicTable/PeriodicTable';
import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/table" element={<PeriodicTable />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
