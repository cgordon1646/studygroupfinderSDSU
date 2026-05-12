import { Link, useRouteError } from "react-router-dom";
import "./Global.css";
import "../components/shared-ui.css";

function routeErrorDetail(err: unknown): string {
  if (typeof err === "string") return err;
  if (typeof err === "object" && err !== null) {
    const o = err as { message?: unknown; statusText?: unknown };
    if (typeof o.message === "string") return o.message;
    if (typeof o.statusText === "string") return o.statusText;
  }
  return "";
}

function Error() {
  const message = routeErrorDetail(useRouteError());

  return (
    <div className="error-page">
      <h1>Page not found</h1>
      <p>
        The page you requested does not exist or the link is broken.
        {message ? ` (${message})` : ""}
      </p>
      <Link to="/">Back to home</Link>
    </div>
  );
}

export default Error;
