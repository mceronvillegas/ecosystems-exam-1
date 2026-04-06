import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../api/client";

interface FormState {
  email: string;
  password: string;
  username: string;
  role: string;
  storeName?: string;
}

const inputClass =
  "w-full border-2 border-blue p-2 outline-none font-lexend text-sm transition-all duration-300 focus:scale-103 focus:border-blue2";
const labelClass = "font-lexend text-sm font-semibold text-blue mb-1 block";

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    username: "",
    role: "consumer",
    storeName: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const payload = { ...form };

    if (form.role !== "store") {
      delete payload.storeName;
    }

    try {
      if (isLogin) {
        const { data } = await apiClient.post("/auth/login", {
          email: form.email,
          password: form.password,
        });

        localStorage.setItem("access_token", data.session.access_token);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...data.user.user_metadata, id: data.user.id }),
        );

        navigate(`/${data.user.user_metadata.role}`);
      } else {
        await apiClient.post("/auth/register", payload);
        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
        setIsLogin(true);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Error";
      setError(`Error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue flex items-center justify-center p-4 transition-all">
      <h1 className="absolute top-0 left-0 text-white/25 italic text-[250px] leading-none tracking-tight">
        {isLogin ? "Welcome Back!" : "This is Sweet"}
      </h1>

      <div className="receipt-container w-full max-w-120 bg-white p-8 shadow-lg transition-all">
        <header className="text-center mb-4">
          <h1 className="text-blue text-[80px]  leading-none mb-2">FOODIES</h1>
          <div className="border-t-2 border-blue  border-dashed mb-4" />
          <h3 className="uppercase text-[12px] tracking-widest font-bold text-blue2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h3>
        </header>

        {error && (
          <div className="bg-red-50 border-2 border-brown text-brown p-2 mb-4 text-sm font-bold uppercase text-center font-lexend">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2 transition-all">
          {!isLogin && (
            <>
              <div>
                <label className={labelClass}>Username</label>
                <input
                  name="username"
                  type="text"
                  required
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full border-2 text-blue border-blue p-2 outline-none font-lexend text-sm transition-all duration-300 focus:scale-103"
                >
                  <option value="consumer" className="text-blue">
                    Consumer
                  </option>
                  <option value="store">Store</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>
              {form.role === "store" && (
                <div>
                  <label className={labelClass}>Store Name</label>
                  <input
                    name="storeName"
                    type="text"
                    required
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className={labelClass}>Email Address</label>
            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Password (at least 6 characters)
            </label>
            <input
              name="password"
              type="password"
              required
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue text-white font-instrument font-semibold py-2 text-xl  active:translate-y-1 active:shadow-none transition-all cursor-pointer  mt-4"
          >
            {isLogin ? "LOGIN" : "SIGN UP "}
          </button>
        </form>

        <footer className="mt-8 pt-4 border-t-2 border-dashed border-blue2 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="cursor-pointer font-lexend text-[12px] font-bold text-blue2  hover:text-blue transition-colors underline underline-offset-4"
          >
            {isLogin ? "New to the app? Sign Up" : "Have an account? Log In"}
          </button>
        </footer>
      </div>
    </div>
  );
}
