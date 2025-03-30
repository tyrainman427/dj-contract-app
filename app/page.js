"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export default function DJContractForm() {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Live City DJ Contract</h1>
      <p className="mb-4">Contact Information:<br/>Phone: (203) 694-9388<br/>Email: therealdjbobbydrake@gmail.com</p>

      <Card className="mb-4">
        <CardContent className="space-y-4 pt-4">
          <Input placeholder="Client Name" />
          <Input placeholder="Contact Phone Number" />
          <Input placeholder="Email Address" />
          <Input placeholder="Type of Event" />
          <Input placeholder="Number of Guests" />
          <Input placeholder="Venue Name" />
          <Input placeholder="Venue Location" />
          <Input placeholder="Event Date" type="date" />
          <Input placeholder="Additional Hours ($75/hour)" type="number" />

          <div className="flex items-center gap-2">
            <label className="font-semibold">Standard DJ Package 💰 $350.00</label>
            <Tooltip>
              <TooltipTrigger><Info className="h-4 w-4" /></TooltipTrigger>
              <TooltipContent>
                5 Hours<br/>
                Includes professional DJ/EMCEE, high-quality sound system, wireless microphone, extensive music selection, setup & teardown
              </TooltipContent>
            </Tooltip>
          </div>

          <h2 className="font-semibold">Event Add-ons</h2>
          <div className="flex items-center gap-2">
            <Checkbox id="lighting" />
            <label htmlFor="lighting">Event Lighting</label>
            <Tooltip>
              <TooltipTrigger><Info className="h-4 w-4" /></TooltipTrigger>
              <TooltipContent>Strobe/party lighting. Requires venue access 2 hours before event.</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="photography" />
            <label htmlFor="photography">Event Photography</label>
            <Tooltip>
              <TooltipTrigger><Info className="h-4 w-4" /></TooltipTrigger>
              <TooltipContent>50 high-quality candid shots, delivered within 48 hours.</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="visual" />
            <label htmlFor="visual">Video Visual</label>
            <Tooltip>
              <TooltipTrigger><Info className="h-4 w-4" /></TooltipTrigger>
              <TooltipContent>Slideshows, presentations, etc.</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox id="terms" checked={agreed} onCheckedChange={() => setAgreed(!agreed)} />
            <div>
              <label htmlFor="terms">I agree to the Terms and Conditions</label>
              <Tooltip>
                <TooltipTrigger><Info className="h-4 w-4 inline ml-1" /></TooltipTrigger>
                <TooltipContent className="text-sm max-w-xs">
                  <strong>GENERAL TERMS & CONDITIONS</strong><br/>
                  DJ services can extend beyond the contracted time only with venue approval.<br/>
                  If the event is canceled by the client, the advance payment deposit is non-refundable.<br/>
                  Cancellations within 30 days of the event require full payment of the contracted amount. Cancellations must be submitted in writing via email or text message.<br/>
                  LIVE CITY reserves the right to shut down equipment if there is any risk of harm to attendees or property.<br/>
                  LIVE CITY cannot be held liable for any amount greater than the contracted fee.<br/>
                  Outdoor events must provide access to electricity.<br/>
                  Tipping is optional and at the discretion of the client.
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <Button disabled={!agreed}>Submit Contract</Button>
        </CardContent>
      </Card>
    </div>
  );
}
