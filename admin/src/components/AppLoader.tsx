"use client";

import { useEffect, useState } from "react";
import BrandLogo from "./BrandLogo";

const AppLoader = () => {
  const [loadingPhrase, setLoadingPhrase] = useState("");

  function getRandomLoadingPhrase() {
    const phrases = [
      "Setting things up",
      "Almost there",
      "Loading your experience",
      "Please wait",
      "Gathering data",
      "Crunching numbers",
      "Preparing everything",
      "Just a moment",
      "Hang tight",
      "Getting things ready",
      "We're on it",
      "Making things happen",
      "Working on it",
      "Taking care of it",
      "Loading the magic",
      "Unpacking your content",
      "Fetching results",
      "Building your experience",
      "Hold tight",
      "Initializing",
      "Please be patient",
      "Finishing up",
      "Bringing it all together",
      "Your content is almost ready",
      "Just a few more seconds",
      "Brewing your results",
      "Summoning your data",
      "Weaving digital magic",
      "Untangling the internet",
      "Connecting the dots",
      "Polishing pixels",
      "Computing awesomeness",
      "Decoding the universe",
      "Aligning the stars",
      "Forging your experience",
      "Assembling bytes",
      "Sprinkling digital fairy dust",
      "Herding electrons",
      "Calibrating quantum flux",
      "Scanning the horizon",
      "Powering up the engines",
      "Feeding the hamsters",
      "Charging the crystals",
      "Consulting the oracle",
      "Igniting the processors",
      "Waking up the servers",
      "Channeling digital energy",
      "Spinning up the gears",
      "Warming up the matrix",
      "Refactoring reality",
      "Defragmenting dimensions",
      "Navigating cyberspace",
      "Unlocking potential",
      "Bending time and space",
      "Harmonizing algorithms",
      "Tuning the digital orchestra",
      "Mining for gold nuggets",
      "Translating binary whispers",
      "Calculating the incalculable",
      "Manifesting your request",
      "Unfolding possibilities",
      "Traversing the digital frontier",
      "Compiling brilliance",
      "Buffering excellence",
      "Distilling knowledge",
      "Synchronizing particles",
      "Generating awesomeness",
      "Parsing the impossible",
      "Optimizing your journey",
      "Bridging digital divides",
      "Shuffling the deck",
      "Whispering to databases",
      "Arranging digital atoms",
      "Taming wild data",
      "Orchestrating digital symphonies",
      "Crafting your moment",
      "Painting your canvas",
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
        <BrandLogo className="w-52" />
        <p className="h-4 animate-in fade-in">
          {loadingPhrase ? `${loadingPhrase}...` : "Initializing..."}
        </p>
      </div>
    </div>
  );
};

export default AppLoader;
