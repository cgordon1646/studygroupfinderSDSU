import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  reconcileExpiredAuth,
  tokenIsAuthenticated,
} from "../../auth/session";
import "../shared-ui.css";

export function RequireAuth({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    reconcileExpiredAuth();
    if (!tokenIsAuthenticated()) {
      navigate("/signin", {
        state: { from: location.pathname },
        replace: true,
      });
      return;
    }
    setAllowed(true);
  }, [navigate, location.pathname]);

  if (!allowed) {
    return (
      <div className="auth-gate" role="status" aria-live="polite">
        Checking your session…
      </div>
    );
  }

  return <>{children}</>;
}
