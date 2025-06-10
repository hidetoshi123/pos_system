import { useState } from "react";
import type { OrderItem } from "../../../interfaces/order_item/order_item";
import type { Order } from "../../../interfaces/order/order";
import type { OrderFieldErrors } from "../../../interfaces/order/orderFieldError";
import OrderServices from "../../../services/OrderService";
import { useNavigate } from "react-router-dom";

interface OrderFormProps {
  orderItems: OrderItem[];
}

const OrderForm = ({ orderItems }: OrderFormProps) => {
  const navigate = useNavigate();
  // --- FIX 1: Include total_price in the initial state ---
  const [order, setOrder] = useState<Omit<Order, "order_date">>({
    order_id: 0,
    customer_email: "",
    first_name: "",
    last_name: "",
    total_price: 0, // Initialize total_price here
  });

  const [errors, setErrors] = useState<OrderFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  const grandTotal = orderItems.reduce(
    (sum, item) => sum + Number(item.discounted_price) * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({}); // Clear previous errors

    // --- FIX 2: Pass grandTotal as total_price in the payload ---
    const formData = {
      ...order,
      total_price: grandTotal, // Assign the calculated grandTotal to total_price
      orderItems: orderItems.map((item) => ({
        item_id: item.item_id,
        quantity: item.quantity,
        discounted_price: item.discounted_price,
        // No total_price for individual items here, as per your new schema
      })),
    };

    try {
      const response = await OrderServices.createOrders(formData);
      console.log("Order created successfully:", response.data);
      alert("Order created successfully!");

      // Optionally reset form here
      setOrder({
        order_id: 0,
        customer_email: "",
        first_name: "",
        last_name: "",
        total_price: 0, // Reset total_price as well
      });
      setErrors({});
    } catch (error: any) {
      console.error("Order creation failed:", error);

      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        alert("An error occurred while creating the order.");
      }
    } finally {
      setIsSubmitting(false);
    }
    const response = await OrderServices.createOrders(formData);
    console.log("Order created successfully:", response.data);

    // Navigate to receipt page with state (order info + items)
    navigate("/receipt", {
      state: {
        order_id: response.data.order_id,
        customer_email: order.customer_email,
        first_name: order.first_name,
        last_name: order.last_name,
        orderItems: orderItems,
        grandTotal: grandTotal,
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card"
      style={{
        height: "640px",
        width: "100%",
        maxWidth: "500px",
        display: "flex",
        flexDirection: "column",
        fontSize: "1.2rem",
      }}
    >
      <div className="card-header">
        <h2 className="h5 mb-0" style={{ fontSize: "1.5rem" }}>
          Order Form
        </h2>
      </div>

      <div
        className="card-body"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
        }}
      >
        {/* Order fields */}
        <div className="mb-3">
          <label className="form-label">Customer Email</label>
          <input
            type="email"
            name="customer_email"
            value={order.customer_email}
            onChange={handleChange}
            className={`form-control ${
              errors.customer_email ? "is-invalid" : ""
            }`}
            required
          />
          {errors.customer_email && (
            <div className="invalid-feedback">
              {errors.customer_email.join(", ")}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            name="first_name"
            value={order.first_name}
            onChange={handleChange}
            className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
            required
          />
          {errors.first_name && (
            <div className="invalid-feedback">
              {errors.first_name.join(", ")}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={order.last_name}
            onChange={handleChange}
            className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
            required
          />
          {errors.last_name && (
            <div className="invalid-feedback">
              {errors.last_name.join(", ")}
            </div>
          )}
        </div>

        {/* Order items */}
        <h5 className="mt-4">Order List</h5>
        {orderItems.length === 0 ? (
          <p className="text-muted" style={{ fontSize: "1.2rem" }}>
            No items selected
          </p>
        ) : (
          <table
            className="table table-bordered table-striped mt-3"
            style={{
              fontSize: "1.2rem",
              width: "100%",
            }}
          >
            <thead className="table-light" style={{ fontSize: "1.3rem" }}>
              <tr>
                <th style={{ padding: "15px" }}>Item Name</th>
                <th style={{ padding: "15px" }}>Quantity</th>
                <th style={{ padding: "15px" }}>Item Price</th>
                <th style={{ padding: "15px" }}>Total Price</th>{" "}
                {/* This is still item-specific for display */}
              </tr>
            </thead>
            <tbody>
              {orderItems.map((orderItem) => (
                <tr key={orderItem.item_id} style={{ fontSize: "1.2rem" }}>
                  <td style={{ padding: "15px" }}>
                    {orderItem.item?.item_name || "Unnamed Item"}
                  </td>
                  <td style={{ padding: "15px" }}>{orderItem.quantity}</td>
                  <td style={{ padding: "15px" }}>
                    ${Number(orderItem.discounted_price).toFixed(2)}
                  </td>
                  <td style={{ padding: "15px" }}>
                    $
                    {(
                      Number(orderItem.discounted_price) * orderItem.quantity
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ padding: "15px", textAlign: "right" }}>
                  <strong>Grand Total:</strong>
                </td>
                <td style={{ padding: "15px" }}>
                  <strong>${grandTotal.toFixed(2)}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      <div className="card-footer">
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Order"}
        </button>
      </div>
    </form>
  );
};

export default OrderForm;
