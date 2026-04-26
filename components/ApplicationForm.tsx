'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  User, Phone, Mail, MapPin, Camera, ChevronRight,
  ChevronLeft, Send, Loader2, AlertCircle, Wifi, CheckCircle,
} from 'lucide-react';

import ProgressSteps from '@/components/ProgressSteps';
import FileUpload from '@/components/FileUpload';
import { step1Schema, step2Schema, type Step1Values, type Step2Values } from '@/lib/validations';
import { cn } from '@/lib/utils';

// ─── shared field styles ───────────────────────────────────────────────────
const inputBase =
  'w-full border rounded-xl px-4 py-3 text-sm bg-white text-slate-900 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500';
const inputError = 'border-red-300 focus:border-red-400 focus:ring-red-200/40 bg-red-50/30';
const inputOk = 'border-slate-200 hover:border-slate-300';

// ─── slide animation ───────────────────────────────────────────────────────
const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

// ─── field helper ──────────────────────────────────────────────────────────
function Field({
  label, required, error, children,
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1 animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── data accumulator type ─────────────────────────────────────────────────
interface FormState extends Step1Values, Step2Values {
  photo: File | null;
  plan: 'Plan 888' | 'Plan 999';
}

// ─── steps metadata ────────────────────────────────────────────────────────
const STEPS = [
  { label: 'Personal', icon: <User className="w-4 h-4" /> },
  { label: 'Address', icon: <MapPin className="w-4 h-4" /> },
  { label: 'Photo', icon: <Camera className="w-4 h-4" /> },
  { label: 'Review', icon: <Send className="w-4 h-4" /> },
];

// ───────────────────────────────────────────────────────────────────────────
export default function ApplicationForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formState, setFormState] = useState<Partial<FormState>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ── Step 1 form ────────────────────────────────────────────────────────
  const form1 = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      fullName: formState.fullName ?? '',
      cellphone: formState.cellphone ?? '',
      email: formState.email ?? '',
    },
  });

  // ── Step 2 form ────────────────────────────────────────────────────────
  const form2 = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      sitio: formState.sitio ?? '',
      barangay: formState.barangay ?? '',
      municipality: formState.municipality ?? '',
    },
  });

  // ── navigation helpers ─────────────────────────────────────────────────
  function goNext(data: Partial<FormState>) {
    setFormState((prev) => ({ ...prev, ...data }));
    setDirection(1);
    setStep((s) => s + 1);
    window.scrollTo({ top: document.getElementById('apply')?.offsetTop ?? 0, behavior: 'smooth' });
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => s - 1);
  }

  // ── step 3 next ────────────────────────────────────────────────────────
  function handlePhotoNext() {
    if (!photoFile) {
      setPhotoError('Please upload a valid ID photo to continue');
      return;
    }
    setPhotoError(null);
    setDirection(1);
    setStep(4);
  }

  // ── final submit ───────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!photoFile) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setUploadProgress((p) => Math.min(p + 12, 85));
      }, 300);

      const body = new FormData();
      Object.entries(formState).forEach(([k, v]) => {
        if (v != null) body.append(k, v as string);
      });
      body.append('photo', photoFile);

      const res = await fetch('/api/submit', { method: 'POST', body });
      clearInterval(progressInterval);
      setUploadProgress(100);

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Submission failed');
      }

      const params = new URLSearchParams({
        id: json.data.applicationId,
        name: json.data.applicantName,
        date: json.data.submittedAt,
      });
      router.push(`/success?${params.toString()}`);
    } catch (err) {
      setSubmitting(false);
      setUploadProgress(0);
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  // ── render ────────────────────────────────────────────────────────────
  return (
    <div id="apply" className="w-full max-w-lg mx-auto">
      {/* Card */}
      <div className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 pt-8 pb-6">
          <h2 className="text-xl font-bold text-white mb-1">Apply for Converge Fiber</h2>
          <p className="text-blue-200 text-sm">
            Step {step} of {STEPS.length} — {STEPS[step - 1].label}
          </p>
          <div className="mt-5">
            <ProgressSteps steps={STEPS} current={step} />
          </div>
        </div>

        {/* Form body */}
        <div className="px-8 py-8 min-h-[340px]">
          <AnimatePresence mode="wait" custom={direction}>
            {/* ── Step 1: Personal Info ──────────────────────────────────── */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <form
                  onSubmit={form1.handleSubmit((data) => goNext(data))}
                  className="space-y-5"
                >
                  {/* Plan Selection */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">
                      Select a Plan <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { value: 'Plan 888', price: '₱888', speed: '75 Mbps' },
                        { value: 'Plan 999', price: '₱999', speed: '100 Mbps' },
                      ] as const).map((plan) => {
                        const selected = form1.watch('plan') === plan.value;
                        return (
                          <button
                            key={plan.value}
                            type="button"
                            onClick={() => form1.setValue('plan', plan.value, { shouldValidate: true })}
                            className={cn(
                              'relative flex flex-col items-center gap-1 rounded-xl border-2 p-4 transition-all duration-200',
                              selected
                                ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100'
                                : 'border-slate-200 bg-white hover:border-blue-300'
                            )}
                          >
                            {selected && (
                              <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-blue-500" />
                            )}
                            <Wifi className={cn('w-5 h-5', selected ? 'text-blue-500' : 'text-slate-400')} />
                            <span className={cn('font-bold text-sm', selected ? 'text-blue-700' : 'text-slate-700')}>
                              {plan.value}
                            </span>
                            <span className={cn('text-xs font-semibold', selected ? 'text-blue-600' : 'text-slate-500')}>
                              {plan.speed}
                            </span>
                            <span className={cn('text-xs', selected ? 'text-blue-400' : 'text-slate-400')}>
                              {plan.price}/mo
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {form1.formState.errors.plan && (
                      <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1 animate-fade-in">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {form1.formState.errors.plan.message}
                      </p>
                    )}
                  </div>

                  <Field
                    label="Full Name"
                    required
                    error={form1.formState.errors.fullName?.message}
                  >
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        {...form1.register('fullName')}
                        placeholder="Juan Dela Cruz"
                        className={cn(
                          inputBase,
                          'pl-10',
                          form1.formState.errors.fullName ? inputError : inputOk
                        )}
                      />
                    </div>
                  </Field>

                  <Field
                    label="Cellphone Number"
                    required
                    error={form1.formState.errors.cellphone?.message}
                  >
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        {...form1.register('cellphone')}
                        placeholder="09171234567"
                        type="tel"
                        className={cn(
                          inputBase,
                          'pl-10',
                          form1.formState.errors.cellphone ? inputError : inputOk
                        )}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Must be exactly 11 digits starting with 09
                    </p>
                  </Field>

                  <Field
                    label="Email Address"
                    required
                    error={form1.formState.errors.email?.message}
                  >
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        {...form1.register('email')}
                        placeholder="juan@email.com"
                        type="email"
                        className={cn(
                          inputBase,
                          'pl-10',
                          form1.formState.errors.email ? inputError : inputOk
                        )}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Must be a valid email (e.g., juan@gmail.com)
                    </p>
                  </Field>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3.5 rounded-xl shadow-blue hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ── Step 2: Address ────────────────────────────────────────── */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <form
                  onSubmit={form2.handleSubmit((data) => goNext(data))}
                  className="space-y-5"
                >
                  <p className="text-sm text-slate-500 -mt-1 mb-1">
                    Enter your service installation address.
                  </p>

                  <Field
                    label="Sitio / Purok"
                    required
                    error={form2.formState.errors.sitio?.message}
                  >
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        {...form2.register('sitio')}
                        placeholder="Sitio Mabuhay"
                        className={cn(
                          inputBase,
                          'pl-10',
                          form2.formState.errors.sitio ? inputError : inputOk
                        )}
                      />
                    </div>
                  </Field>

                  <Field
                    label="Barangay"
                    required
                    error={form2.formState.errors.barangay?.message}
                  >
                    <input
                      {...form2.register('barangay')}
                      placeholder="Brgy. San Isidro"
                      className={cn(
                        inputBase,
                        form2.formState.errors.barangay ? inputError : inputOk
                      )}
                    />
                  </Field>

                  <Field
                    label="Municipality / City"
                    required
                    error={form2.formState.errors.municipality?.message}
                  >
                    <input
                      {...form2.register('municipality')}
                      placeholder="Quezon City"
                      className={cn(
                        inputBase,
                        form2.formState.errors.municipality ? inputError : inputOk
                      )}
                    />
                  </Field>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={goBack}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl transition-all duration-200"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-blue transition-all duration-200 hover:-translate-y-0.5"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ── Step 3: Photo Upload ───────────────────────────────────── */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <div className="space-y-5">
                  <p className="text-sm text-slate-500 -mt-1">
                    Upload a clear, front-facing photo of yourself or a valid government ID.
                  </p>

                  <FileUpload
                    value={photoFile}
                    onChange={(f) => {
                      setPhotoFile(f);
                      if (f) setPhotoError(null);
                    }}
                    error={photoError ?? undefined}
                  />

                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={goBack}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl transition-all duration-200"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handlePhotoNext}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-blue transition-all duration-200 hover:-translate-y-0.5"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 4: Review & Submit ────────────────────────────────── */}
            {step === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <div className="space-y-5">
                  <p className="text-sm text-slate-500 -mt-1">
                    Please review your details before submitting.
                  </p>

                  {/* Summary card */}
                  <div className="bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-100">
                    <ReviewRow icon={<Wifi />} label="Selected Plan" value={formState.plan} />
                    <ReviewRow icon={<User />} label="Full Name" value={formState.fullName} />
                    <ReviewRow icon={<Phone />} label="Cellphone" value={formState.cellphone} />
                    <ReviewRow icon={<Mail />} label="Email" value={formState.email} />
                    <div className="border-t border-slate-200 my-2" />
                    <ReviewRow
                      icon={<MapPin />}
                      label="Address"
                      value={[formState.sitio, formState.barangay, formState.municipality]
                        .filter(Boolean)
                        .join(', ')}
                    />
                    {photoFile && (
                      <ReviewRow
                        icon={<Camera />}
                        label="Photo"
                        value={`${photoFile.name} (${(photoFile.size / 1024 / 1024).toFixed(2)} MB)`}
                      />
                    )}
                  </div>

                  {/* Upload progress bar */}
                  {submitting && (
                    <div className="space-y-1.5 animate-fade-in">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Uploading to Google Drive…</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {submitError && (
                    <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl p-4 animate-fade-in">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600">{submitError}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={goBack}
                      disabled={submitting}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-semibold py-3.5 rounded-xl transition-all duration-200"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-blue transition-all duration-200 hover:-translate-y-0.5 disabled:hover:translate-y-0"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Application
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 text-center pt-1">
                    By submitting, you agree to allow Converge to contact you regarding your application.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ReviewRow({
  icon, label, value,
}: {
  icon: React.ReactNode; label: string; value?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-8 h-8 bg-white rounded-lg border border-slate-200 flex items-center justify-center shrink-0 text-blue-500 [&>svg]:w-3.5 [&>svg]:h-3.5">
        {icon}
      </span>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-sm text-slate-800 font-medium mt-0.5">{value || '—'}</p>
      </div>
    </div>
  );
}
