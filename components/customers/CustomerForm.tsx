"use client";
import React, { useState, SyntheticEvent, ChangeEvent } from "react";
import { HiExclamationTriangle } from "react-icons/hi2";
import { toast } from "sonner";

export type FormValues = {
  name: string;
  phone: string;
  note: string;
};

type Props = {
  onAdd: (customer: FormValues) => Promise<void> | void;
};

export default function CustomerForm({ onAdd }: Props) {
  const [values, setValues] = useState<FormValues>({
    name: "",
    phone: "",
    note: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    const name = values.name.trim();
    const phone = values.phone.trim();
    const note = values.note.trim();

    if (name.length < 2) {
      setError("Müşteri adı en az 2 karakter olmalıdır.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onAdd({ name, phone, note });
      setValues({ name: "", phone: "", note: "" });
      toast.success("Müşteri başarıyla eklendi.");
    } catch {
      setError("Müşteri eklenirken bir hata oluştu.");
      toast.error("Müşteri eklenirken bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 rounded-xl border border-slate-700/60 p-4"
    >
      <p className="text-sm font-semibold text-slate-200 mb-3">Yeni Müşteri Ekle</p>

      <div className="space-y-2.5">
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="Müşteri adı (zorunlu)"
          className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
        <input
          type="text"
          name="phone"
          value={values.phone}
          onChange={handleChange}
          placeholder="Telefon numarası"
          className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
        <textarea
          name="note"
          value={values.note}
          onChange={handleChange}
          placeholder="Not (isteğe bağlı)"
          rows={2}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
        />
      </div>

      {error && (
        <p className="mt-2.5 text-xs text-rose-500 flex items-center gap-1">
          <HiExclamationTriangle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-3 w-full rounded-lg bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2.5 text-sm font-medium text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        {submitting && (
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {submitting ? "Ekleniyor..." : "Ekle"}
      </button>
    </form>
  );
}
