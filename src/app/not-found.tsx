import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-midnight flex flex-col items-center justify-center text-center px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-rose-glow/8 via-transparent to-transparent blur-3xl" />
      </div>
      <div className="relative z-10">
        <p className="text-8xl font-light serif-text bg-gradient-to-b from-white to-text-secondary bg-clip-text text-transparent mb-4">404</p>
        <p className="text-sm text-text-secondary mb-8">This shadow doesn&apos;t exist. Yet.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="px-6 py-2.5 bg-white text-midnight font-bold rounded-xl text-sm hover:bg-gray-200 transition-all">Go Home</Link>
          <Link href="/dashboard" className="px-6 py-2.5 border border-glass-border text-white text-sm font-medium rounded-xl hover:bg-glass-bg transition-all">Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
