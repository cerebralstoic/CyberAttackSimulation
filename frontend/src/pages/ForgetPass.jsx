import { useState } from "react";
import { Shield, Mail, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage({
  onResetPassword,
  onNavigateToLogin,
}) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(email))
      newErrors.email = "Please enter a valid email address";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSuccess(false);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onResetPassword(email);
      setIsSuccess(true);
      setEmail("");
    } catch (e) {
      setErrors({
        general:
          e.message ||
          "Failed to send reset email. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="size-10 text-blue-500" />
            <h1 className="text-3xl font-semibold text-white">
              Cyber Range
            </h1>
          </div>
          <p className="text-gray-400">Reset your password</p>
        </div>

        <div className="bg-[#0d1238] border border-gray-800 rounded-xl p-8">
          {isSuccess && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex gap-3 mb-3">
                <CheckCircle2 className="size-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-400 mb-1">
                    Reset email sent!
                  </p>
                  <p className="text-sm text-green-400/80">
                    Check your inbox or spam folder.
                  </p>
                </div>
              </div>
              <button
                onClick={onNavigateToLogin}
                className="w-full mt-4 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-medium"
              >
                Return to Sign In
              </button>
            </div>
          )}

          {errors.general && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3">
              <AlertCircle className="size-5 text-red-500" />
              <p className="text-sm text-red-400">
                {errors.general}
              </p>
            </div>
          )}

          {!isSuccess && (
            <>
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-400">
                  Enter your email address and we'll send you a reset
                  link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
                    <input
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full bg-[#0a0e27] border ${
                        errors.email
                          ? "border-red-500"
                          : "border-gray-700"
                      } rounded-lg pl-11 pr-4 py-3 text-white`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400 flex gap-1">
                      <AlertCircle className="size-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white py-3 rounded-lg"
                >
                  {isLoading
                    ? "Sending reset link..."
                    : "Send Reset Link"}
                </button>
              </form>

              <button
                onClick={onNavigateToLogin}
                className="w-full mt-4 flex items-center justify-center gap-2 text-gray-400 hover:text-gray-200 py-2"
              >
                <ArrowLeft className="size-4" />
                Back to Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
