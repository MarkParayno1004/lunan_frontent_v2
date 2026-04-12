"use client";

import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { USER_LOGIN_MUTATION } from "@/features/auth/graphql";
import { getCsrfToken } from "@/lib/csrf";

type LoginVariables = {
  loginUser: {
    email: string;
    password: string;
  };
};

type LoginResponse = {
  userLogin: {
    token: string | null;
    user: {
      id: string | null;
      firstName: string | null;
      lastName: string | null;
      email: string | null;
      role: string | null;
    } | null;
  } | null;
};

function resolveRedirectPath(role: string | null | undefined) {
  if (role === "PATIENT") return "/dashboard/patient";
  if (role === "COUNSELOR") return "/dashboard/counselor";
  if (role === "ADMIN") return "/dashboard/admin";
  return "/login";
}

export function useLogin() {
  const router = useRouter();
  const [mutate, { loading, error }] = useMutation<LoginResponse, LoginVariables>(USER_LOGIN_MUTATION);

  async function login(email: string, password: string) {
    const csrfToken = await getCsrfToken();

    const response = await mutate({
      variables: {
        loginUser: {
          email,
          password,
        },
      },
      context: {
        fetchOptions: {
          credentials: "include",
        },
        headers: csrfToken
          ? {
              "X-CSRFToken": csrfToken,
            }
          : undefined,
      },
    });

    const user = response.data?.userLogin?.user;
    const role = user?.role;
    const userEmail = user?.email;
    const userId = user?.id;
    const token = response.data?.userLogin?.token;

    if (token) {
      localStorage.setItem("auth_token", token);
      document.cookie = `auth_token=${encodeURIComponent(token)}; Path=/; Max-Age=604800; SameSite=Lax`;
    }

    if (role) {
      localStorage.setItem("user_role", role);
    }

    if (userEmail) {
      localStorage.setItem("user_email", userEmail);
    }

    if (userId) {
      localStorage.setItem("user_id", userId);
    }

    const firstName = user?.firstName?.trim();
    if (firstName) {
      localStorage.setItem("user_first_name", firstName);
    } else {
      localStorage.removeItem("user_first_name");
    }

    router.push(resolveRedirectPath(role));
  }

  return {
    login,
    loading,
    error,
  };
}
