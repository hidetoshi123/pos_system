import { useLocation } from "react-router-dom";

const ReceiptPage = () => {
  const location = useLocation();
  const {
    order_id,
    customer_email,
    first_name,
    last_name,
    orderItems,
    grandTotal,
  } = location.state || {};

  return (
    <div style={{ padding: "20px" }}>
      <h2>Order Receipt</h2>
      <p>
        <strong>Order ID:</strong> {order_id}
      </p>
      <p>
        <strong>Customer:</strong> {first_name} {last_name}
      </p>
      <p>
        <strong>Email:</strong> {customer_email}
      </p>

      <h4>Items:</h4>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ccc",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Item Name
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Quantity
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Item Price
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Total Price
            </th>
          </tr>
        </thead>
        <tbody>
          {orderItems?.map((item: any) => (
            <tr key={item.item_id}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {item.item?.item_name || "Unnamed Item"}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {item.quantity}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                ${Number(item.discounted_price).toFixed(2)}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                ${(Number(item.discounted_price) * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 style={{ marginTop: "20px" }}>
        Grand Total: ${grandTotal?.toFixed(2)}
      </h4>
    </div>
  );
};

export default ReceiptPage;
