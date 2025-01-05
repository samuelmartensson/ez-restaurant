"use client";

import { Coffee } from "lucide-react";
import { useEffect, useState } from "react";

const AppLoader = () => {
  const [loadingPhrase, setLoadingPhrase] = useState("");

  function getRandomLoadingPhrase() {
    const phrases = [
      "Setting things up",
      "Almost there",
      "Loading your experience",
      "Please wait...",
      "Gathering data",
      "Crunching numbers",
      "Preparing everything",
      "Just a moment...",
      "Hang tight",
      "Getting things ready",
      "We’re on it",
      "Making things happen",
      "Working on it",
      "Taking care of it",
      "Loading the magic",
      "Unpacking your content",
      "Fetching results",
      "Building your experience",
      "Hold tight",
      "Initializing...",
      "Please be patient",
      "Finishing up",
      "Bringing it all together",
      "Your content is almost ready",
      "Just a few more seconds",
    ];

    const randomIndex = Math.floor(Math.random() * phrases.length);
    return phrases[randomIndex];
  }

  useEffect(() => {
    setLoadingPhrase(getRandomLoadingPhrase());
  }, []);

  return (
    <div className="grid h-svh w-svw place-items-center">
      <div className="grid place-items-center">
        <div className="flex items-center gap-2">
          <Coffee size={28} />
          <h1 className="text-3xl">EZRest</h1>
        </div>
        <p className="h-4 animate-in fade-in">
          {loadingPhrase ?? "Initializing..."}
        </p>
      </div>
    </div>
  );
};

export default AppLoader;
