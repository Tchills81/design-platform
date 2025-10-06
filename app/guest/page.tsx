'use client';
export default function GuestEntry() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-whisper fade-in">
      <h1 className="text-3xl font-serif text-ceremonial mb-4">👤 Guest Mode</h1>
      <p className="text-muted text-center mb-6 font-inter">
        You’re entering as a guest. Your designs won’t be saved, but your journey begins now.
      </p>
      <button className="btn-primary">Start Designing</button>
    </div>
  );
}
