import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import LoginModel from "../components/LoginModel";
import { useDispatch, useSelector } from "react-redux";
import { Coins } from "lucide-react";
import { serverUrl } from "../App";
import { setUserData } from "../redux/user_slice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Home() {
  const highlights = [
    "AI Generated Code",
    "Fully Responsive Layouts",
    "Production Ready Output",
  ];
  const navigate=useNavigate()
  const [openProfile, setOpenProfile] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const [openLogin, setOpenLogin] = useState(false);
  const [websites, setWebsites] = useState([]);
  const [websitesLoading, setWebsitesLoading] = useState(false);
  const [websitesError, setWebsitesError] = useState(null);
  const dispatch=useDispatch()

  React.useEffect(() => {
    const fetchWebsites = async () => {
      if (!userData) {
        setWebsites([]);
        return;
      }

      setWebsitesLoading(true);
      try {
        const result = await axios.get(`${serverUrl}/api/website/get-all`, {
          withCredentials: true,
        });
        setWebsites(result.data);
        setWebsitesError(null);
      } catch (error) {
        console.log(error);
        setWebsitesError(error.response?.data?.error || "Failed to load websites");
      } finally {
        setWebsitesLoading(false);
      }
    };

    fetchWebsites();
  }, [userData]);

  const handleLogout=async ()=>{
    try {
        await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
        dispatch(setUserData(null))
        setOpenProfile(false)
    } catch (error) {
        console.log(error)
    }
  }
  return (
    <div className="relative min-h-screen bg-[#040404] text-white overflow-hidden">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop:blur-xl bg-black/40 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-lg font-semibold">GenWeb.ai</div>
          <div className="flex items-center gap-5">
                  <div 
                    className="hidden md:inline text-sm text-zinc-400 hover:text-white cursor-pointer"
                    onClick={() => navigate("/pricing")}
                  >
              Pricing
            </div>
            {userData && (
              <div className=" hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10 transition" onClick={()=>navigate("/pricing")}>
                      <Coins size={14} className="text-yellow-400" onClick={() => navigate("/pricing")} />
                <span className="text-zinc-300">Credits</span>
                <span>{userData.credits}</span>
                <span className="font-semibold">+</span>
              </div>
            )}
            {!userData ? (
              <button
                onClick={() => setOpenLogin(true)}
                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-sm"
              >
                Get Started
              </button>
            ) : (
              <div className="relative ">
                <button
                  className="flex items-center cursor-pointer"
                  onClick={() => setOpenProfile((prev) => !prev)}
                >
                  <img
                    src={
                      userData?.avatar ||
                      `https://ui-avatars.com/api/?name=${userData.name}`
                    }
                    alt=""
                    className="w-9 h-9 rounded-full border border-white/20 object-cover"
                  />
                </button>
                <AnimatePresence>
                  {openProfile && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-60 z-50 rounded-xl bg-[#0b0b0b] border border-white/10 shadow-2xl overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm font-medium truncate">
                            {userData.name}
                          </p>
                          <p className="text-xs text-zinc-500 truncate">
                            {userData.email}
                          </p>
                        </div>
                        <button className="md:hidden w-full px-4 py-3 flex items-center gap-2 text-sm border-b border-white/10 hover:bg-white/5" onClick={()=>navigate("/pricing")}>
                          <Coins size={14} className="text-yellow-400" />
                          <span className="text-zinc-300">Credits</span>
                          <span>{userData.credits}</span>
                          <span className="font-semibold">+</span>
                        </button>
                        <button onClick={()=>navigate("/dashboard")} className="w-full px-4 py-3 text-left text-sm hover:bg-white/5">Dashboard</button>
                        <button onClick={handleLogout} className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/5">Logout </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <section className="pt-44 pb-32 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight"
        >
          Build Stunning Websites <br />
          <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            With AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-8 max-w-2xl mx-auto text-zinc-400 text-lg"
        >
          Describe your idea and let AI generate a modern responsive,
          production-ready website.
        </motion.p>
            {userData?<button
          className=" mt-12 px-10 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition"
          onClick={() =>navigate("/dashboard")}
        >
          Go to dashboard
        </button>:<button
          className=" mt-12 px-10 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition"
          onClick={() => setOpenLogin(true)}
        >
          Get Started
        </button>}
        
      </section>
        {userData ? (
          <section className="max-w-7xl mx-auto px-6 pb-24">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Your websites</p>
                <h2 className="text-2xl font-semibold">Recent projects</h2>
              </div>
            
            </div>

            {websitesLoading ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-zinc-400">
                Loading your websites...
              </div>
            ) : websitesError ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-10 text-center text-red-200">
                {websitesError}
              </div>
            ) : websites?.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center">
                <h3 className="text-2xl font-semibold">No websites yet</h3>
                <p className="mt-3 text-sm text-zinc-400">
                  When you generate a website, it will appear here in a card.
                </p>
                <button
                  onClick={() => navigate("/generate")}
                  className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-105"
                >
                  Generate Website
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {websites.map((item, index) => (
                  <motion.div
                    key={item._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -6 }}
                    className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition flex flex-col"
                  >
                    <div
                      className="relative h-40 bg-black cursor-pointer"
                      onClick={() => navigate(`/editor/${item._id}`)}
                    >
                      <iframe
                        srcDoc={item.latestCode}
                        className="absolute inset-0 h-[140%] w-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white"
                      />
                      <div className="absolute inset-0 bg-black/30"></div>
                    </div>
                    <div className="flex flex-1 flex-col gap-4 p-5">
                      <h3 className="text-base font-semibold line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Last Updated {item.updatedAt && new Date(item.updatedAt).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() => navigate(`/editor/${item._id}`)}
                        className="mt-auto rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:scale-105"
                      >
                        Open
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        ) : null}

      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white/5 border border-white/10 p-8"
            >
              <h1 className="text-xl font-semibold mb-3">{h}</h1>
              <p className="text-sm text-zinc-400">
                GenWeb.ai builds real websites - clean code, animations,
                responsiveness and scalable structure
              </p>
            </motion.div>
          ))}
        </div>
      </section>


      <footer className="border-t border-white/10 py-10 text-center text-sm text-zinc-500">
        &copy; {new Date().getFullYear()} GenWeb.ai
      </footer>

      {openLogin && (
        <LoginModel open={openLogin} onClose={() => setOpenLogin(false)} />
      )}
    </div>
  );
}

export default Home;
