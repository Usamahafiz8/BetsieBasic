export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export interface Endpoint {
  method: HttpMethod;
  url: string;
}
