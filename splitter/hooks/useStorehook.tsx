"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";

export const useStoreUser = () => {
  const { user, isLoaded } = useUser();
  const [storing, setStoring] = useState(true);
  const [stored, setStored] = useState(false);

  useEffect(() => {
    const store = async () => {
      try {
        await axios.post("/api/userstore/storeuser");
        setStored(true);
      } catch (error) {
        setStored(false);
        console.log("error aa gay");
        console.error("Error . store nahi hua bhia", error);
      } finally {
        setStoring(false);
      }
    };
    store();
  }, [user, isLoaded]);

  return {
    isLoading: !isLoaded || storing,
    isAuthenticated: !!user && stored,
  };
};