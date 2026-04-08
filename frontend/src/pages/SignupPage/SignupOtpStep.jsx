import { motion as Motion } from "framer-motion";
import { Link } from "react-router";

function SignupOtpStep({
  otp,
  onOtpChange,
  errors,
  loading,
  onSubmit,
  onResend,
  email,
  timeLeft,
  expired,
  t,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {errors.submit && <p className="text-red-400 text-sm text-center mb-3">{errors.submit}</p>}
      <div>
        <input
          type="text"
          placeholder={t("forgetPassword.otpPlaceholder")}
          maxLength="4"
          className="form-input text-center tracking-widest text-2xl"
          value={otp}
          onChange={onOtpChange}
        />
        {errors.otp && <p className="text-red-400 text-xs mt-1 ml-4">{errors.otp}</p>}
      </div>

      <Motion.button
        type="submit"
        className="create-account-button mx-auto block"
        disabled={loading || expired}
        whileHover={{ scale: loading ? 1 : 1.05 }}
        whileTap={{ scale: loading ? 1 : 0.95 }}
      >
        {loading ? t("forgetPassword.verifying") : t("forgetPassword.verifyOtp")}
      </Motion.button>

      <div className="text-center text-sm text-secondary mt-6 flex flex-col gap-3">
        <p>
          {t("forgetPassword.otpSent")}
          <br />
          <span className="text-white font-semibold">{email}</span>
        </p>
        <p className="text-xs text-white/70">
          {expired
            ? "OTP expired. Please resend to get a new code."
            : `Expires in ${Math.floor(timeLeft / 60)
                .toString()
                .padStart(2, "0")} : ${String(timeLeft % 60).padStart(2, "0")}`}
        </p>
        <p>
          {t("forgetPassword.didntReceiveCode")}
          <button
            type="button"
            onClick={(e)=>{onResend(e)}}
            disabled={loading}
            className="text-primary hover:text-white transition-colors disabled:opacity-50"
          >
            {t("forgetPassword.resend")}
          </button>
        </p>
      </div>
    </form>
  );
}

export default SignupOtpStep;
