import React from 'react';

const Dashboard = () => {
  const user = {
    name: 'Gamal Hossam Eldin',
    phone: '0222671281',
    status: 'Active',
    plan: 'WE SPACE - Super speed 1-(400GB)',
    renewal: '24 July',
    remainingGB: 182,
    totalGB: 400,
    balance: '19.04 EGP'
  };

  const percent = Math.round((user.remainingGB / user.totalGB) * 100 * 10) / 10; // 1 decimal
  const radius = 54;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Welcome back,</h1>
            <p className="text-xl font-bold">{user.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-300">Phone</p>
            <p className="font-medium">{user.phone}</p>
          </div>
        </header>

        <main className="space-y-6">
          <section className="bg-white/6 border border-white/10 backdrop-blur-md rounded-2xl p-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center text-xs font-bold">GH</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                    <span className="flex items-center gap-2 text-sm text-green-300">
                      <span className="w-2 h-2 rounded-full bg-green-400 block" />
                      {user.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{user.plan}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-300">Renewal</p>
              <p className="font-semibold">{user.renewal}</p>
              <p className="text-sm text-gray-300 mt-2">Balance</p>
              <p className="font-medium">{user.balance}</p>
            </div>
          </section>

          <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="col-span-2">
              <h3 className="text-sm text-gray-300">Data Quota</h3>
              <p className="text-lg font-semibold">{user.remainingGB} GB Remaining of {user.totalGB} GB</p>
              <p className="text-sm text-gray-400 mt-2">Plan: {user.plan} • Renewal: {user.renewal}</p>
            </div>
            <div className="flex justify-center">
              <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                <defs>
                  <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <circle
                  stroke="rgba(255,255,255,0.06)"
                  fill="transparent"
                  strokeWidth={stroke}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
                <circle
                  stroke="url(#g1)"
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  strokeDasharray={circumference + ' ' + circumference}
                  style={{ strokeDashoffset }}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-white text-sm font-semibold" style={{ fontSize: 12 }}>
                  {user.remainingGB} GB
                </text>
              </svg>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4">
              <h4 className="text-sm text-gray-300">Current Plan</h4>
              <p className="font-semibold mt-2">{user.plan}</p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4">
              <h4 className="text-sm text-gray-300">Renewal Date</h4>
              <p className="font-semibold mt-2">{user.renewal}</p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4">
              <h4 className="text-sm text-gray-300">Remaining Balance</h4>
              <p className="font-semibold mt-2">{user.balance}</p>
            </div>
          </section>
        </main>

        <nav className="fixed left-1/2 transform -translate-x-1/2 bottom-6 w-[92%] max-w-3xl bg-white/4 border border-white/10 backdrop-blur-md rounded-3xl p-3 flex items-center justify-around">
          <button className="flex flex-col items-center text-sm text-gray-200">
            <div className="w-6 h-6 mb-1 bg-white/6 rounded-md" />
            Home
          </button>
          <button className="flex flex-col items-center text-sm text-gray-200">
            <div className="w-6 h-6 mb-1 bg-white/6 rounded-md" />
            Customers
          </button>
          <button className="flex flex-col items-center text-sm text-gray-200">
            <div className="w-6 h-6 mb-1 bg-white/6 rounded-md" />
            Orders
          </button>
          <button className="flex flex-col items-center text-sm text-gray-200">
            <div className="w-6 h-6 mb-1 bg-white/6 rounded-md" />
            Account
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Dashboard;
