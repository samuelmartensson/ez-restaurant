"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CustomerConfigResponse,
  postPublicContact,
} from "@/generated/endpoints";
import { useState } from "react";

export default function ContactForm({
  data,
}: {
  data: CustomerConfigResponse;
}) {
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!data || !data.email) return null;

  const heroSection = data?.sections?.hero;

  return (
    <div className="bg-gray-50">
      <section className="py-12 max-w-screen-xl mx-auto">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              {heroSection?.heroImage ? (
                <Image
                  src={heroSection.heroImage ?? ""}
                  alt="Catering service"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg object-cover w-full max-h-[600px]"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-200 rounded-lg" />
              )}
            </div>
            {submitted ? (
              <div>
                <h2 className="text-3xl font-customer font-bold mb-2 text-primary">
                  THANK YOU FOR REACHING OUT!
                </h2>
                <p className="text-muted-foreground mb-6">
                  We will get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl font-customer font-bold mb-2 text-primary">
                  PLANNING AN EVENT?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Need catering or a special request? Tell us below!
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setError(false);
                    setLoading(true);
                    postPublicContact(
                      {
                        description,
                        name,
                        email,
                      },
                      { key: data.domain ?? "" }
                    )
                      .then(() => {
                        setSubmitted(true);
                      })
                      .catch(() => {
                        setError(true);
                      })
                      .finally(() => {
                        setLoading(false);
                      });
                  }}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      required
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell us about your event"
                      required
                      className="min-h-[100px]"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  {error && (
                    <div className="bg-red-500 p-4 rounded text-white">
                      We could not send your message. Please try again.
                    </div>
                  )}
                  <Button type="submit" disabled={loading} className="w-full">
                    Submit Request
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
