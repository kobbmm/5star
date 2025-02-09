"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../../app/Style/signup.css"; // นำเข้าไฟล์ CSS

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Sign up failed");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        {/* กล่องแรก Welcome */}
        <div className="bg-white shadow-lg rounded-xl p-6 text-center w-full max-w-md welcome-section">
        <h1 className="text-[64px] font-bold text-white">Welcome to</h1>
        <h2 className="text-[64px] font-bold text-primary">CLOUD & CRÈME</h2>
        <p className="mt-2 text-secondary">Your favourite foods delivered fast at your door.</p>
      </div>

        {/* กล่องที่สอง Sign-Up */}
        <div className="signup-box">
          <h2 className="signup-title">Sign Up</h2>
          
          {error && <div className="signup-error">{error}</div>}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="mb-4">
              <label htmlFor="fullName" className="block">Full Name</label>
              <input
                id="fullName"
                type="text"
                className="signup-input"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block">Email</label>
              <input
                id="email"
                type="email"
                className="signup-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block">Password</label>
              <input
                id="password"
                type="password"
                className="signup-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="signup-button"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-4">
            Already have an account? <a href="#" className="signup-link">Sign In</a>
          </p>

          <p className="mt-2 text-secondary">-------Sign up with-------</p>

          <div className="social-signup">
          <button className="social-button facebook">
              <span>Facebook</span>
            </button>
            <button className="social-button google">
              <span>Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
