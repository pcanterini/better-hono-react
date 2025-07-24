import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn, authClient } from "@better-hono-react/auth-client";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn.email(
        {
          email,
          password,
          callbackURL: "/dashboard",
        },
        {
          onSuccess: () => {
            navigate("/dashboard");
          },
          onError: (ctx) => {
            setError(ctx.error.message || "Failed to sign in");
          },
        },
      );
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      setError("Failed to sign in with Google");
    }
  };

  return (
    <div className="container">
      <h1>Sign In</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div style={{ margin: "20px 0" }}>
        <button onClick={handleGoogleSignIn} style={{ width: "100%" }}>
          Sign in with Google
        </button>
      </div>

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
