function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white relative overflow-hidden">

      {/* Animated Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600 opacity-20 blur-3xl rounded-full animate-floatGlow"></div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 backdrop-blur-md bg-white/5 border-b border-white/10 sticky top-0 z-50">
        <h1 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Smart Life Scheduler
        </h1>

        <button className="bg-indigo-600 hover:bg-indigo-500 hover:-translate-y-1 hover:scale-105 transform transition duration-300 shadow-lg hover:shadow-indigo-500/40 px-4 py-2 rounded-lg">
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center mt-28 px-6 animate-fadeIn">

        <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
          Design Your Life.
          <br />
          Master Your Time.
        </h2>

        <p className="text-slate-400 max-w-xl mb-10 text-lg">
          AI-powered scheduling, intelligent analytics, and adaptive life optimization — all in one powerful system.
        </p>

        {/* Premium CTA Button */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300"></div>

          <button className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 hover:-translate-y-1 hover:scale-105 transform transition duration-300 shadow-2xl hover:shadow-purple-500/50 px-8 py-3 rounded-xl text-lg font-semibold">
            Get Started
          </button>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">

          <div>
            <h3 className="text-3xl font-bold text-indigo-400">12K+</h3>
            <p className="text-slate-400 mt-2">Active Users</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-purple-400">98%</h3>
            <p className="text-slate-400 mt-2">Task Completion Boost</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-indigo-300">35K+</h3>
            <p className="text-slate-400 mt-2">Schedules Optimized</p>
          </div>

        </div>

      </section>

    </div>
  )
}

export default App

