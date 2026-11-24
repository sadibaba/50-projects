import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CardList from "./components/cardList";
import Profile from "./components/profile";

const App = () => (
  <Router>
    <div className="min-h-screen bg-[#f3e7dc] text-slate-900">
      <header className="border-b border-[#d9c3b0] bg-[#e8d3c1]/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#8a6448]">Phase 1 project</p>
            <h1 className="text-2xl font-bold sm:text-3xl">Travel Stories</h1>
          </div>
          <p className="text-sm text-[#6b513d]">
            A static React blog built with local data and client-side routing.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <Routes>
          <Route path="/" element={<CardList />} />
          <Route path="/profile/:name" element={<Profile />} />
          <Route
            path="*"
            element={
              <div className="py-20 text-center">
                <h2 className="text-2xl font-semibold">Page not found</h2>
                <p className="mt-2 text-slate-600">Return to the story list to continue.</p>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  </Router>
);

export default App;
