import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ReceiptPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    order_id,
    customer_email,
    first_name,
    last_name,
    orderItems,
    grandTotal,
  } = location.state || {};

  // Send webhook on page load
  useEffect(() => {
    if (!order_id || !grandTotal || !customer_email) return;

    const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
    if (!webhookUrl) return;

    const sendWebhook = async () => {
      try {
        const payload = {
          grand_total: Number(grandTotal) || 0,
          first_name: first_name || "",
          last_name: last_name || "",
          email: customer_email || "",
        };

        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Webhook failed with status ${response.status}`);
        }
      } catch (error) {
        // Fail silently
      }
    };

    sendWebhook();
  }, [order_id, grandTotal, customer_email, first_name, last_name]);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "40px",
        background: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <h2 style={{ color: "#4A90E2", marginBottom: "10px" }}>
          Thank you for shopping with TechFour, {first_name}!
        </h2>
        <p style={{ fontSize: "16px", color: "#555" }}>
          Your order has been placed successfully. Below is a summary of your
          receipt.
        </p>

        <div style={{ marginTop: "30px" }}>
          <h4 style={{ color: "#333", marginBottom: "5px" }}>Order ID</h4>
          <p style={{ margin: 0, fontWeight: "bold" }}>{order_id}</p>

          <h4 style={{ color: "#333", marginTop: "20px", marginBottom: "5px" }}>
            Customer
          </h4>
          <p style={{ margin: 0 }}>
            {first_name} {last_name}
          </p>
          <p style={{ margin: 0 }}>{customer_email}</p>
        </div>

        <div style={{ marginTop: "30px" }}>
          <h4 style={{ color: "#333", marginBottom: "15px" }}>
            Items Purchased
          </h4>
          {orderItems?.map((item: any) => (
            <div
              key={item.item_id}
              style={{
                padding: "12px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "15px" }}>
                {item.item?.item_name || "Unnamed Item"}
              </div>
              <div style={{ fontSize: "14px", color: "#555" }}>
                Quantity: {item.quantity}
              </div>
              <div style={{ fontSize: "14px", color: "#555" }}>
                Price: ${Number(item.discounted_price).toFixed(2)}
              </div>
              <div style={{ fontSize: "14px", color: "#111", fontWeight: 500 }}>
                Total: $
                {(Number(item.discounted_price) * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "30px",
            paddingTop: "20px",
            borderTop: "2px solid #4A90E2",
          }}
        >
          <h3 style={{ color: "#4A90E2" }}>
            Grand Total: ${grandTotal?.toFixed(2)}
          </h3>
        </div>

        <div style={{ marginTop: "40px", fontSize: "14px", color: "#777" }}>
          If you have any questions, feel free to contact TechFour's support
          team.
        </div>

        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: "30px",
            backgroundColor: "#4A90E2",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            fontSize: "16px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
};

export default ReceiptPage;
