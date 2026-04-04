"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "user_first_name";

export function useCurrentUserFirstName() {
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setFirstName(stored?.trim() ? stored.trim() : null);
  }, []);

  return firstName;
}
