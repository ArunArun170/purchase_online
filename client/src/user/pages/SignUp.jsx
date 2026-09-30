import { useState } from "react";
import { useNavigate } from "react-router";

function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [acceptedTerms, setAcceptedTerms] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim() || !password || !acceptedTerms || loading) {
      if (!acceptedTerms) window.alert("Please accept the Terms & Privacy Policy.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), email: email.trim(), password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to create account");

      localStorage.setItem("anon_token", data.token);
      localStorage.setItem("anon_user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authUpdated"));
      navigate("/checkout");
    } catch (error) {
      window.alert(error.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grow flex items-center justify-center py-10 md:py-20 px-5 animate-fade-in">

      <div className="w-full max-w-[480px]">

        {/* =========================
            TITLE
            ========================= */}
        <div className="text-center mb-8">

          <h1 className="text-3xl md:text-4xl font-black text-[#ad2d47] mb-2 uppercase tracking-tight">
            Create Account
          </h1>

          <p className="text-[#5e5e5e] text-sm">
            Join the community for premium shopping
          </p>

        </div>


        {/* =========================
            FORM CARD
            ========================= */}
        <div className="bg-white rounded-xl p-6 md:p-8 border border-[#e5e2e1] shadow-sm">

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* FULL NAME */}
            <div>

              <label className="text-[11px] font-bold text-[#5e5e5e] uppercase mb-1 block tracking-wider">
                Full Name
              </label>

              <input
                type="text"
                required
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                className="w-full px-4 py-3 bg-[#fcf9f8] border border-[#dfbfc1] rounded-lg focus:ring-2 focus:ring-[#ad2d47] focus:border-[#ad2d47] outline-none text-sm transition-all"
                placeholder="John Doe"
              />

            </div>


            {/* PHONE + EMAIL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>

                <label className="text-[11px] font-bold text-[#5e5e5e] uppercase mb-1 block tracking-wider">
                  Phone Number
                </label>

                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  className="w-full px-4 py-3 bg-[#fcf9f8] border border-[#dfbfc1] rounded-lg focus:ring-2 focus:ring-[#ad2d47] focus:border-[#ad2d47] outline-none text-sm transition-all"
                  placeholder="(555) 000-0000"
                />

              </div>


              <div>

                <label className="text-[11px] font-bold text-[#5e5e5e] uppercase mb-1 block tracking-wider">
                  Email Address
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className="w-full px-4 py-3 bg-[#fcf9f8] border border-[#dfbfc1] rounded-lg focus:ring-2 focus:ring-[#ad2d47] focus:border-[#ad2d47] outline-none text-sm transition-all"
                  placeholder="john@example.com"
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div>

              <label className="text-[11px] font-bold text-[#5e5e5e] uppercase mb-1 block tracking-wider">
                Password
              </label>

              <div className="relative">

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
                  className="w-full pl-4 pr-12 py-3 bg-[#fcf9f8] border border-[#dfbfc1] rounded-lg focus:ring-2 focus:ring-[#ad2d47] focus:border-[#ad2d47] outline-none text-sm transition-all"
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


            {/* TERMS */}
            <div className="flex items-start gap-2 py-2">

              <input
                id="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) =>
                  setAcceptedTerms(
                    event.target.checked
                  )
                }
                className="mt-1 h-4 w-4 rounded border-[#dfbfc1] text-[#ad2d47] focus:ring-[#ad2d47]"
              />

              <label
                htmlFor="terms"
                className="text-[11px] md:text-xs text-[#5e5e5e]"
              >
                By clicking, I agree to the{" "}

                <span className="text-[#ad2d47]">
                  Terms
                </span>{" "}

                &{" "}

                <span className="text-[#ad2d47]">
                  Privacy Policy
                </span>
                .
              </label>

            </div>


            {/* CREATE ACCOUNT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ad2d47] text-white py-3.5 rounded-lg font-bold hover:bg-[#8c1231] active:scale-95 transition-all shadow-sm mt-2 uppercase tracking-wider text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >

              {loading
                ? "Creating..."
                : "Join Anon"}

            </button>

          </form>


          {/* SIGN IN */}
          <div className="mt-8 pt-6 border-t border-[#e5e2e1] text-center">

            <p className="text-sm text-[#5e5e5e]">

              Already have an account?{" "}

              <button
                type="button"
                onClick={() =>
                  navigate("/signin")
                }
                className="text-[#ad2d47] font-bold hover:underline"
              >
                Sign In
              </button>

            </p>

          </div>

        </div>

      </div>

    </main>
  );
}

export default SignUp;