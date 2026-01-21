"use client";
import FeedbackForm from '@/components/FeedbackForm';

export default function PageAvis() {
  return (
    <main className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <FeedbackForm />
      </div>
    </main>
  );
}