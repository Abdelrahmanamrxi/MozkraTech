/**
 * useSignupForm hook
 * -------------------
 * Encapsulates all signup page logic so the component can remain focused on rendering.
 * This hook manages form state, validation, OTP countdown, and API interactions.
 */
import { useCallback, useMemo, useState } from "react";
import { z } from "zod";
import axios from "axios";
import useOtpTimer from "./useOtpTimer";

// Base URL for the backend API. This should be configured in the Vite environment.
const baseUrl = import.meta.env.VITE_BACKEND_URL;

// The default shape of the signup form state.
const initialFormState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  gender: "",
  birthDate: { day: "", month: "", year: "" },
};

// Build a list of translated validation messages.
const createValidationMessages = (t) => ({
  fillAllFields: t("signupPage.errors.fillAllFields"),
  fullNameRequired: t("signupPage.errors.fullNameRequired"),
  nameMin: t("signupPage.errors.nameMin"),
  fullNamePattern: t("signupPage.errors.fullNamePattern"),
  emailRequired: t("signupPage.errors.emailRequired"),
  invalidEmail: t("signupPage.errors.invalidEmail"),
  passwordRequired: t("signupPage.errors.passwordRequired"),
  passwordMin: t("signupPage.errors.passwordMin"),
  passwordPattern: t("signupPage.errors.passwordPattern"),
  confirmPasswordRequired: t("signupPage.errors.confirmPasswordRequired"),
  genderRequired: t("signupPage.errors.genderRequired"),
  passwordsMatch: t("signupPage.errors.passwordsMatch"),
});

// Create the signup form validation schema using zod.
// This includes basic field checks and a cross-field password match rule.
const createUserSchema = (messages) =>
  z
    .object({
      fullName: z
        .string()
        .min(1, messages.fullNameRequired)
        .min(3, messages.nameMin)
        .regex(/^[A-Za-z\s]+$/, messages.fullNamePattern),
      email: z.string().min(1, messages.emailRequired).email(messages.invalidEmail),
      password: z
        .string()
        .min(1, messages.passwordRequired)
        .min(8, messages.passwordMin)
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, messages.passwordPattern),
      confirmPassword: z.string().min(1, messages.confirmPasswordRequired),
      gender: z.string().min(1, messages.genderRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.passwordsMatch,
      path: ["confirmPassword"],
    });

// Gender selector options for the signup form.
const getGenderOptions = (t) => [
  { value: "Male", label: t("signupPage.gender.male") },
  { value: "Female", label: t("signupPage.gender.female") },
  { value: "Other", label: t("signupPage.gender.other") },
];

export default function useSignupForm(t) {
  // Form data state.
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");

  // OTP countdown state.
  const { timeLeft, expired, startTimer } = useOtpTimer(60);

  // Build memoized helpers only when translation text changes.
  const validationMessages = useMemo(() => createValidationMessages(t), [t]);
  const userSchema = useMemo(() => createUserSchema(validationMessages), [validationMessages]);
  const genderOptions = useMemo(() => getGenderOptions(t), [t]);

  /**
   * Clear a single field error once the user begins editing that field.
   */
  const clearFieldError = useCallback(
    (field) => {
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors],
  );

  /**
   * Update form field values and clear field-specific errors.
   */
  const handleChange = (e) => {
      setErrors((prev) => ({ ...prev, submit: "" }));
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      clearFieldError(name);
    }
  

  /**
   * Update gender selection in the form.
   */
  const handleGenderChange = (selectedGender) => {
      setFormData((prev) => ({ ...prev, gender: selectedGender }));
      clearFieldError("gender");
    }
 
  /**
   * Update birth date fields and enforce upper limits.
   */
  const handleBirthDate = (field, value) => {
    const limits = { day: 31, month: 12, year: new Date().getFullYear() };
    if (value > limits[field]) return;
    setFormData((prev) => ({
      ...prev,
      birthDate: { ...prev.birthDate, [field]: value },
    }));
  }

  /**
   * Submit the signup form.
   * - validates the form locally
   * - sends a request to register
   * - advances to the OTP step on success
   */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const allEmpty = Object.values(formData).every((val) => {
        if (typeof val === "object" && val !== null) {
          return Object.values(val).every((subVal) => subVal === "");
        }
        return val === "";
      });

      if (allEmpty) {
        setErrors({ submit: validationMessages.fillAllFields });
        return;
      }

      const result = userSchema.safeParse(formData);
      if (!result.success) {
        const newErrors = {};
        result.error.issues.forEach((issue) => {
          newErrors[issue.path[0]] = issue.message;
        });
        setErrors(newErrors);
        return;
      }

      const { day, month, year } = formData.birthDate;
      const payload = {
        ...formData,
        gender: formData.gender.toLowerCase(),
        birthDate: new Date(Number(year), Number(month) - 1, Number(day)),
      };

      try {
        setLoading(true);
        await axios.post(`${baseUrl}/auth/register`, payload);
        startTimer(60);
        setStep(2);
        setErrors({});
      } catch (err) {
        const message = err?.response?.data?.message || err.message || "Registration failed";
        setErrors({ submit: message });
      } finally {
        setLoading(false);
      }
    },
    [formData, startTimer, userSchema, validationMessages],
  );

  /**
   * Submit the OTP verification step.
   */
  const handleOtpSubmit = useCallback(
    async (e, onSuccess) => {
      e.preventDefault();
      const newErrors = {};

      if (!otp.trim()) {
        newErrors.otp = t("forgetPassword.errors.otpRequired");
      } else if (otp.length !== 4) {
        newErrors.otp = t("forgetPassword.errors.otpDigits");
      }

      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;

      if (expired) {
        setErrors({ submit: "OTP has expired. Please resend to get a new code." });
        return;
      }

      try {
        setLoading(true);
        await axios.patch(`${baseUrl}/auth/confirm-email`, { email: formData.email, code: otp });
        setStep(3);
        setErrors({});
        if (typeof onSuccess === "function") {
          onSuccess();
        }
      } catch (err) {
        const message = err?.response?.data?.message || err.message || "OTP verification failed";
        setErrors({ submit: message });
      } finally {
        setLoading(false);
      }
    },
    [expired, formData.email, otp, t],
  );

  /**
   * Send a request to resend the OTP code.
   */
  const handleResendOtp = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        await axios.post(`${baseUrl}/auth/resend-otp`, { email: formData.email });
        startTimer(60);
        setErrors({});
      } catch (err) {
        setErrors({ submit: err?.response?.data?.message || "Resend failed" });
      } finally {
        setLoading(false);
      }
    },
    [formData.email, startTimer],
  );

  return {
    formData,
    errors,
    step,
    otp,
    loading,
    showPassword,
    showConfirmPassword,
    timeLeft,
    expired,
    genderOptions,
    handleChange,
    handleGenderChange,
    handleBirthDate,
    handleSubmit,
    handleOtpSubmit,
    handleResendOtp,
    setOtp,
    setFormData,
    setErrors,
    setStep,
    setShowPassword,
    setShowConfirmPassword,
  };
}
