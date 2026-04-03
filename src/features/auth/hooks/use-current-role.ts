"use client";

import { useEffect, useState } from "react";

export function useCurrentRole() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem("user_role"));
  }, []);

  return role;
}
