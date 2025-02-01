"use client";

import hasDomain from "@/components/hasDomain";
import LanguageManager from "@/components/LanguageManager";

const Languages = () => {
  return (
    <div className="max-w-lg">
      <LanguageManager />
    </div>
  );
};

export default hasDomain(Languages);
