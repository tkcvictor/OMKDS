import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { toast } from "react-toastify";
import "./VerifySubscription.css";

const VerifySubscription = () => {
  const { url, token, fetchSubscription } = useContext(StoreContext);
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const plan = searchParams.get("plan");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Verifying your subscription...");

  useEffect(() => {
    const verifySubscription = async () => {
      try {
        setMessage(`Verifying plan: ${plan}, success: ${success}`);

        if (!token) {
          // Try to get token from localStorage if not in context
          const storedToken = localStorage.getItem("token");
          if (!storedToken) {
            setMessage("No token found. Please login again.");
            toast.error("Authentication required. Please login again.");
            setTimeout(() => navigate("/"), 2000);
            return;
          }

          // Use the stored token instead
          const response = await axios.post(
            `${url}/api/subscription/verify`,
            { success, plan },
            { headers: { token: storedToken } }
          );

          if (response.data.success) {
            setMessage("Subscription activated successfully!");
            toast.success("Subscription activated successfully!");
            // Refresh subscription data
            fetchSubscription();
            setTimeout(() => navigate("/my-plan"), 1500);
          } else {
            setMessage(response.data.message || "Verification failed");
            toast.error(response.data.message);
            setTimeout(() => navigate("/"), 2000);
          }
        } else {
          // Token exists in context
          const response = await axios.post(
            `${url}/api/subscription/verify`,
            { success, plan },
            { headers: { token } }
          );

          if (response.data.success) {
            setMessage("Subscription activated successfully!");
            toast.success("Subscription activated successfully!");
            // Refresh subscription data
            fetchSubscription();
            setTimeout(() => navigate("/my-plan"), 1500);
          } else {
            setMessage(response.data.message || "Verification failed");
            toast.error(response.data.message);
            setTimeout(() => navigate("/"), 2000);
          }
        }
      } catch (error) {
        setMessage("Error verifying subscription");
        toast.error("Error verifying subscription");
        console.error("Subscription verification error:", error);
        setTimeout(() => navigate("/"), 2000);
      } finally {
        setLoading(false);
      }
    };

    verifySubscription();
  }, []);

  return (
    <div className="verify-subscription">
      {loading && <div className="spinner"></div>}
      <p>{message}</p>
    </div>
  );
};

export default VerifySubscription;
