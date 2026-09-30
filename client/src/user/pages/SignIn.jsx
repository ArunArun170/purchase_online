import { useState } from "react";
import { useNavigate } from "react-router";

function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim() || loading) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to sign in");

      localStorage.setItem("anon_token", data.token);
      localStorage.setItem("anon_user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authUpdated"));
      navigate("/checkout");
    } catch (error) {
      window.alert(error.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grow flex items-center justify-center py-10 md:py-20 px-5 animate-fade-in">

      <div className="w-full max-w-md">

        {/* =========================
            TITLE
            ========================= */}
        <div className="text-center mb-8">

          <h1 className="text-2xl md:text-3xl font-black text-[#ad2d47] mb-2 uppercase tracking-tight">
            Sign In
          </h1>

          <p className="text-[#5e5e5e] text-sm">
            Please sign in to proceed to secure checkout
          </p>

        </div>


        {/* =========================
            FORM CARD
            ========================= */}
        <div className="bg-white rounded-xl p-6 md:p-8 border border-[#e5e2e1] shadow-sm">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* EMAIL */}
            <div>

              <label className="text-[11px] font-bold text-[#5e5e5e] uppercase mb-1 block tracking-wider">
                Email Address
              </label>

              <div className="relative">

                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#5e5e5e]">
                  mail
                </span>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 bg-[#fcf9f8] border border-[#dfbfc1] rounded-lg focus:ring-2 focus:ring-[#ad2d47] focus:border-[#ad2d47] outline-none text-sm transition-all"
                  placeholder="name@example.com"
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div>

              <div className="flex justify-between items-center mb-1">

                <label className="text-[11px] font-bold text-[#5e5e5e] uppercase tracking-wider">
                  Password
                </label>

                <button
                  type="button"
                  className="text-[11px] font-bold text-[#ad2d47] hover:underline"
                  onClick={() =>
                    alert("Password reset will be connected later.")
                  }
                >
                  Forgot Password?
                </button>

              </div>


              <div className="relative">

                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#5e5e5e]">
                  lock
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  className="w-full pl-10 pr-12 py-3 bg-[#fcf9f8] border border-[#dfbfc1] rounded-lg focus:ring-2 focus:ring-[#ad2d47] focus:border-[#ad2d47] outline-none text-sm transition-all"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5e5e5e] hover:text-[#ad2d47]"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword
                      ? "visibility_off"
                      : "visibility"}
                  </span>
                </button>

              </div>

            </div>


            {/* SIGN IN */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ad2d47] text-white py-3.5 rounded-lg font-bold hover:bg-[#8c1231] active:scale-95 transition-all flex justify-center items-center gap-2 mt-2 shadow-sm uppercase tracking-wider text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >

              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    sync
                  </span>

                  Signing In...
                </>
              ) : (
                <>
                  Sign In

                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </>
              )}

            </button>

          </form>


          {/* =========================
              SOCIAL LOGIN
              ========================= */}
          <div className="relative my-8">

            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e5e2e1]"></div>
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-[#5e5e5e] font-bold tracking-wider">
                Or continue with
              </span>
            </div>

          </div>


          <div className="grid grid-cols-2 gap-4">

            <button
              type="button"
              onClick={() =>
                alert("Google OAuth will be connected later.")
              }
              className="flex items-center justify-center gap-2 py-3 border border-[#dfbfc1] rounded-lg hover:bg-[#fcf9f8] transition-colors text-xs font-bold text-[#5e5e5e]"
            >
              Google
            </button>

            <button
              type="button"
              onClick={() =>
                alert("Apple OAuth will be connected later.")
              }
              className="flex items-center justify-center gap-2 py-3 border border-[#dfbfc1] rounded-lg hover:bg-[#fcf9f8] transition-colors text-xs font-bold text-[#5e5e5e]"
            >
              Apple
            </button>

          </div>


          {/* =========================
              SIGN UP
              ========================= */}
          <div className="mt-8 text-center border-t border-[#e5e2e1] pt-6">

            <p className="text-sm text-[#5e5e5e]">

              New to Anon?{" "}

              <button
                type="button"
                onClick={() =>
                  navigate("/signup")
                }
                className="text-[#ad2d47] font-bold hover:underline"
              >
                Create an account
              </button>

            </p>

          </div>

        </div>

      </div>

    </main>
  );
}

export default SignIn;