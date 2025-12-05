import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900">Intern Log</h1>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Daftar
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
            Sistem Pencatatan <span className="text-blue-600">Aktivitas Intern</span>
          </h2>
          <p className="text-base lg:text-xl text-gray-600 mb-6 lg:mb-8 px-4">
            Kelola kehadiran, catat aktivitas harian, dan pantau perkembangan magang Anda
            dengan mudah dan efisien.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center px-4">
            <Link
              href="/register"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg"
            >
              Mulai Sekarang
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-lg"
            >
              Sudah Punya Akun
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 mt-12 lg:mt-20">
          <FeatureCard
            icon={<ClockIcon />}
            title="Absensi Digital"
            description="Check-in dan check-out dengan foto selfie dan lokasi GPS untuk verifikasi kehadiran."
          />
          <FeatureCard
            icon={<ClipboardIcon />}
            title="Log Aktivitas"
            description="Catat semua aktivitas harian dengan kategori dan durasi untuk tracking progress."
          />
          <FeatureCard
            icon={<ChartIcon />}
            title="Laporan Otomatis"
            description="Generate laporan mingguan dan bulanan secara otomatis dengan bantuan AI."
          />
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-12 lg:mt-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8 text-center text-gray-500 text-sm">
          <p>&copy; 2024 Intern Log System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
