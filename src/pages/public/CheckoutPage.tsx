import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import axios from "axios";
import { type AxiosError } from "axios";

function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const isMock = params.get("mock") === "true";
  const trx = params.get("trx") || "";
  const token = params.get("token") || ""; // paypal token when real flow

  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function handle() {
      if (isMock) {
        setStatus("success");
        setMessage(`Payment simulated. Transaction ref: ${trx}`);
        return;
      }

      if (!token) {
        setStatus("error");
        setMessage("Missing payment token");
        return;
      }

      setStatus("processing");
      try {
        // Call backend capture endpoint directly (not via api/v1 base)
        const res = await axios.get(`http://localhost:5000/buy/confirm?token=${encodeURIComponent(token)}`,
          {
            timeout: 30000, // الوقت بالميلي ثانية، هنا 30 ثانية
          });
        if (res?.data?.success) {
          setStatus("success");
          setMessage(res.data.message || "Payment captured successfully");
        } else {
          setStatus("error");
          setMessage(res?.data?.message || "Capture response not successful");
        }
      } catch (error) {
        const err = error as AxiosError;

        console.log(err);

        // setStatus("error");
        // setMessage(err?.response?.data?.message ?? err.message ?? "Capture failed");
      }
    }

    handle();
  }, [isMock, trx, token]);

  return (
    <div className="w-full p-6 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Checkout Result</h1>

      {status === "processing" && <p>Processing payment...</p>}

      {status === "success" && (
        <div className="text-center">
          <p className="text-green-600 font-medium">{message}</p>
          {trx && <p className="mt-2">Transaction: {trx}</p>}
          <div className="mt-4 flex gap-4 justify-center">
            <Button classname="bg-blue-600 text-white" onClick={() => navigate('/')}>Go Home</Button>
            <Button classname="bg-gray-600 text-white" onClick={() => navigate('/profile')}>My Profile</Button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="text-center">
          <p className="text-red-600">{message}</p>
          <div className="mt-4 flex gap-4 justify-center">
            <Button classname="bg-blue-600 text-white" onClick={() => navigate('/')}>Go Home</Button>
            <Button classname="bg-gray-600 text-white" onClick={() => window.history.back()}>Back</Button>
          </div>
        </div>
      )}

      {status === "idle" && <p>Waiting for payment result...</p>}
    </div>
  );
}

export default CheckoutPage;
