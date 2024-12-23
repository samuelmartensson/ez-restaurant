"use client";
import { Button } from "./ui/button";

const DomainNotFound = () => {
  return (
    <html lang="en">
      <title>EZ Rest</title>
      <body>
        <div className="max-w-lg m-auto h-screen grid place-items-center">
          <div className="grid gap-2">
            <span>Domain not found. Sign up now at</span>
            <Button
              onClick={() => (window.location.href = "https://www.ezrest.se")}
            >
              EZ Rest
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
};

export default DomainNotFound;
