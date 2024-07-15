"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

import { createDocument } from "@/lib/actions/room.actions";

import { Button } from "./ui/button";

export const AddDocumentBtn = ({ userId, email }: AddDocumentBtnProps) => {
  const router = useRouter();

  const addDocumentHandler = async () => {
    try {
      const room = await createDocument({
        userId,
        email,
      });

      if (room) router.push(`/documents/${room.id}`);
    } catch (error) {
      console.log("Error notif:", error);
    }
  };

  return (
    <Button
      type="submit"
      className="gradient-blue flex gap-1 shadow-md"
      onClick={addDocumentHandler}
    >
      <Image src="/assets/icons/add.svg" alt="add" width={24} height={24} />
      <p className="hidden sm:block">Start a blank document</p>
    </Button>
  );
};
