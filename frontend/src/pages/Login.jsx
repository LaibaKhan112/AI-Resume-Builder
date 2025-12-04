import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api.js";

const Login = () => {
  const [searchParams] = useSearchParams();
  const urlState = searchParams.get("state");
  const navigate = useNavigate();

  const [state, setState] = useState(urlState || "login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (urlState === "login" || urlState === "register") {
      setState(urlState);
    }
  }, [urlState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint =
        state === "login" ? "/api/user/login" : "/api/user/register";

      const payload =
        state === "login"
          ? { email: formData.email, password: formData.password }
          : formData;

      const res = await api.post(endpoint, payload);

      if (state === "register") {
        alert("User registered successfully!");
      }

      // LOGIN FLOW (after register or direct login)
      const loginRes =
        state === "login"
          ? res
          : await api.post("/api/user/login", {
              email: formData.email,
              password: formData.password,
            });
        console.log("API URL →", import.meta.env.VITE_API_URL);
        console.log(state);
        


      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("user", JSON.stringify(loginRes.data.user));

      navigate("/app");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 py-6 bg-white shadow"
      >
        <h1 className="text-gray-900 text-3xl mt-2 font-medium">
          {state === "login" ? "Login" : "Sign Up"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Please {state} to continue
        </p>

        {/* NAME FIELD */}
        {state === "register" && (
          <div className="flex items-center mt-4 w-full border border-gray-300/80 h-12 rounded-full pl-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="flex-1 outline-none border-none"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* EMAIL FIELD */}
        <div className="flex items-center mt-4 w-full border border-gray-300/80 h-12 rounded-full pl-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="flex-1 outline-none border-none"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* PASSWORD FIELD */}
        <div className="flex items-center mt-4 w-full border border-gray-300/80 h-12 rounded-full pl-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="flex-1 outline-none border-none"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* FORGOT PASSWORD */}
        <div className="mt-2 text-left text-indigo-500">
          <button type="reset" className="text-sm">
            Forgot password?
          </button>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition"
        >
          {loading ? "Processing..." : state === "login" ? "Login" : "Sign Up"}
        </button>

        {/* SWITCH LOGIN / REGISTER */}
        <p
          onClick={() => {
            setState(state === "login" ? "register" : "login");
            setError("");
          }}
          className="text-gray-500 text-sm mt-3 mb-2 cursor-pointer"
        >
          {state === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <span className="text-indigo-500 hover:underline">Click here</span>
        </p>

        {/* ERROR MESSAGE */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
