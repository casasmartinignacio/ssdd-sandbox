import { request } from "@/services/http";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type UserResponse = {
  name: string;
  email: string;
};

export type LogoutResponse = {
  ok: true;
};

export function login(body: LoginRequest) {
  return request<UserResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function register(body: RegisterRequest) {
  return request<UserResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function logout() {
  return request<LogoutResponse>("/api/auth/logout", { method: "POST" });
}

export function getMe() {
  return request<UserResponse>("/api/auth/me");
}
