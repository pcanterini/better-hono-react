import { Link } from "react-router-dom";
import { useSession } from "@better-hono-react/auth-client";

export function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="container">
      <h1>Welcome to Better Hono</h1>
      <p>A modern authentication example with Hono and Better Auth</p>

      {session ? (
        <div>
          <p>Hello, {session.user.email}!</p>
          <Link to="/dashboard">
            <button>Go to Dashboard</button>
          </Link>
        </div>
      ) : (
        <div>
          <p>Please sign in or register to continue</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <Link to="/login">
              <button>Sign In</button>
            </Link>
            <Link to="/register">
              <button>Register</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
