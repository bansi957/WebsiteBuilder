import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";

function LiveSite() {
  const { websiteKey } = useParams();
  const [website, setWebsite] = useState(null);
  const [error, setError] = useState(null);

  const websiteId = websiteKey?.split("-").pop();

  useEffect(() => {
    const fetchWebsite = async () => {
      if (!websiteId) {
        setError({ message: "Website id not found" });
        return;
      }

      try {
        const result = await axios.get(
          `${serverUrl}/api/website/public/${websiteId}`,
          {
            withCredentials: true,
          }
        );
        setWebsite(result.data);
      } catch (error) {
        setError(error.response?.data || { message: "Failed to load website" });
      }
    };

    fetchWebsite();
  }, [websiteId]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white px-6 text-center">
        <h1 className="text-2xl font-semibold">{error.message}</h1>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white px-6 text-center">
        <h1 className="text-2xl font-semibold text-zinc-300">Loading live site...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <iframe
        title={website.title}
        srcDoc={website.latestCode}
        className="h-screen w-full border-0 bg-white"
      />
    </div>
  );
}

export default LiveSite;
