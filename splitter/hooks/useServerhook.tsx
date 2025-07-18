"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

const useServerhook = <T,>(url:string,method:RequestMethod="GET",body?:Record<string, any>|undefined) => {
    const [data, setData] = useState<T | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error|null>(null)
    useEffect(() => {
      async function fetchData() {
        try {
          if (method === "GET") {
            const response = await axios.get<T>(url);
            setData(response.data);
          } else {
            const response = await axios.request<T>({
              method,
              url,
              data: body,
            });
            setData(response.data);
          }

          setError(null);
        } catch (error) {
          setError(error as Error);
          toast.error((error as Error).message);
        } finally {
          setIsLoading(false);
        }
      }
      fetchData();
    }, [url, method,JSON.stringify(body)]);//{}!=={} true

  return (
    {data,isLoading,error}
  )
}

export default useServerhook;