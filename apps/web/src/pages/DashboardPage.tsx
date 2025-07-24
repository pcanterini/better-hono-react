import { useNavigate } from "react-router-dom";
import { useSession, signOut } from "@better-hono-react/auth-client";

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate("/");
        },
      },
    });
  };

  if (!session) {
    return null;
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>

      <div style={{ marginBottom: "20px" }}>
        <h2>Welcome, {session.user.name || session.user.email}!</h2>
        <p>This is a protected page. Only authenticated users can see this.</p>
      </div>

      <div
        style={{ background: "#f5f5f5", padding: "20px", borderRadius: "4px" }}
      >
        <h3>User Information</h3>
        <p>
          <strong>ID:</strong> {session.user.id}
        </p>
        <p>
          <strong>Email:</strong> {session.user.email}
        </p>
        <p>
          <strong>Name:</strong> {session.user.name || "Not set"}
        </p>
        <p>
          <strong>Email Verified:</strong>{" "}
          {session.user.emailVerified ? "Yes" : "No"}
        </p>
        <p>
          <strong>Created:</strong>{" "}
          {new Date(session.user.createdAt).toLocaleString()}
        </p>
      </div>

      <button onClick={handleSignOut} style={{ marginTop: "20px" }}>
        Sign Out
      </button>
    </div>
  );
}
