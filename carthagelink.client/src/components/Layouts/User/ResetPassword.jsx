import { useState } from "react";
import { useLocation } from "react-router-dom";

const resetPassword = async (token, password) => {
  const response = await fetch('http://localhost:5000/api/auth/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, password }),
  });

  if (!response.ok) {
    throw new Error('Failed to reset password.');
  }
};

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token"); // Get token from URL

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password) {
      setError("Password is required.");
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(token, password);
      alert("Password reset successful.");
      // Redirect user to login page or dashboard
    } catch (error) {
      setError("Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default ResetPasswordPage;
