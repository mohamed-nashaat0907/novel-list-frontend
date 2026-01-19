import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axiosInstance from "../axios/axios.config"; // تأكد أن المسار صحيح حسب مكان الملف
import type { AxiosError } from "axios";

// import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios/axios.config";
import { useNavigate } from "react-router-dom";
export default function VerifyEmail() {
  const navigate = useNavigate();
  const { token } = useParams();
  const { data, error, isLoading } = useQuery({
    queryKey: ['verifyEmail', token],
    queryFn: async () => {
      const response = await axiosInstance.get(`/auth/verifyEmail/${token}`);
      return response.data;
    },
    enabled: !!token, // فقط يشغل الاستعلام إذا token موجود
  })

  const showresponse = () => {
    if (isLoading) {
      return <h1 className="text-xl font-semibold text-blue-600 animate-pulse">
        Verifying your email...
      </h1>
    }
    if (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = `❌ ${axiosError.response?.data.message || "there is error"}`;
      
      // console.log(axiosError);
      return <h1 className="text-xl font-semibold text-red-600">{errorMessage}</h1>
    }
    if (data) {
      const sucsessMessage = `✅${data.message || "Email verified successfully!"}`;
      setTimeout(() => {
        navigate("/sign-in" ,{ replace: true });
      }, 3000);
      return <h1 className="text-xl font-semibold text-green-600">{sucsessMessage} you will navigate to login page</h1>
    }
  }



  // const navigate = useNavigate();
  // const [message, setMessage] = useState("Verifying your email...");
  // const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  // const [dots, setDots] = useState(".");


  // useEffect(() => {
  //   const controller = new AbortController();
  //   console.log(controller);

  //   const interval = setInterval(() => {
  //     setDots((prev) => (prev.length < 4 ? prev + "." : "."));
  //   }, 500);

  //   const verifyEmail = async () => {
  //     await new Promise((resolve) => setTimeout(resolve, 200));
  //     try {
  //       const response = await axiosInstance.get(`/auth/verifyEmail/${token}`, {
  //         signal: controller.signal
  //       });
  //       setMessage(`✅ ${response.data.message || "Email verified successfully!"}, you will navigate to the login page after 3 seconds to sign in.`);
  //       setStatus("success");
  //       console.log(response);
  //       // setTimeout(() => {
  //       //   navigate("/sign in");
  //       // }, 3000);

  //     } catch (error) {
  //       const errorobj = error as AxiosError
  //       const { message } = errorobj.response?.data as { message?: string };
  //       const errorMessage = `${message || 'Verification failed. Please try again.'}`;
  //       setMessage(`❌ ${errorMessage}`);
  //       setStatus("error");
  //       console.log(errorobj);

  //     }

  //   };

  //   verifyEmail();

  //   return () => {
  //     controller.abort();
  //     clearInterval(interval)
  //   };

  // }, []);

  return (
    <div className="flex flex-col items-center justify-center m-auto min-h-screen   max-w-[90%]">

      <div className="bg-white shadow-lg rounded-2xl p-8 w-f text-center">
        {showresponse()}
      </div>
    </div>
  );
}
