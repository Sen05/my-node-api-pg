export interface User {
  id: number;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  message?: string;
}
