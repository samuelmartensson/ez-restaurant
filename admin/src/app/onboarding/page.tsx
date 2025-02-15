"use client";

import OnboardingSite from "@/components/OnboardingSite";
import OnboardingDomain from "@/components/OnboardingDomain";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDataContext } from "@/components/DataContextProvider";
import OnboardingMenu from "@/components/OnboardingMenu";

type Steps = "start" | "domain" | "site" | "menu" | "end";

// Domain
// - Url unique name
// Site
// - Name
// Menu
// - Add first category and menu item

const Onboarding = () => {
  const router = useRouter();
  const { selectedDomain } = useDataContext();

  const [step, setStep] = useState<Steps>(selectedDomain ? "site" : "start");

  return (
    <div className="fixed inset-0 z-10 grid place-items-center bg-white">
      <div className="grid w-full max-w-md">
        <h1 className="mb-4 text-3xl">EZRest - Onboarding</h1>
        {step === "start" && (
          <div className="m-auto grid">
            <h2 className="mb-2 text-xl">Welcome to EZ Rest</h2>
            <p className="mb-8 text-muted-foreground">
              To get up and running ASAP we will take you through the necessary
              first steps.
            </p>
            <Button onClick={() => setStep("domain")}>Okay, lets go!</Button>
          </div>
        )}
        <div className="m-auto grid w-full place-items-center">
          {step === "domain" && (
            <OnboardingDomain onNextClick={() => setStep("site")} />
          )}
          {step === "site" && (
            <OnboardingSite onNextClick={() => setStep("menu")} />
          )}
          {step === "menu" && (
            <OnboardingMenu onNextClick={() => setStep("end")} />
          )}
          {step === "end" && (
            <div className="m-auto grid max-w-md">
              <h2 className="mb-2 text-xl">All done!</h2>
              <p className="mb-8 text-muted-foreground">
                The minimum requirements of your website are setup! Continue
                customizing and adding information in your dashboard.
              </p>
              <Button onClick={() => router.replace("/")}>
                Go to my dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
