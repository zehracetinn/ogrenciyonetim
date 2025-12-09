export const API_URL = "http://localhost:5297/api";

export const loginStudent = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/student-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return await res.json();
};
