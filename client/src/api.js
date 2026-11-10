const request = async (path, options = {}) => {
  const response = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    ...options,
  });

  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.error?.message ?? "Request failed.");
    error.code = body.error?.code;
    error.status = response.status;
    throw error;
  }
  return body;
};

export const api = {
  me: () => request("/api/auth/me"),
  login: (email, password) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  items: () => request("/api/items"),
  createItem: (input) =>
    request("/api/items", { method: "POST", body: JSON.stringify(input) }),
  requests: () => request("/api/borrow-requests"),
  createRequest: (input) =>
    request("/api/borrow-requests", { method: "POST", body: JSON.stringify(input) }),
  approve: (id) => request(`/api/borrow-requests/${id}/approve`, { method: "POST" }),
  reject: (id, reason) =>
    request(`/api/borrow-requests/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
  returnItem: (id) => request(`/api/borrow-requests/${id}/return`, { method: "POST" }),
};
