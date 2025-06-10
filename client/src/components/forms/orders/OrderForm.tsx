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

  const [order, setOrder] = useState<Omit<Order, "order_date">>({
    order_id: 0,
    customer_email: "",
    first_name: "",
    last_name: "",
    total_price: 0,
  });
  const [errors, setErrors] = useState<OrderFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  const grandTotal = orderItems.reduce(
    (sum, item) => sum + Number(item.discounted_price) * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = {
      ...order,
      total_price: grandTotal,
      orderItems: orderItems.map((item) => ({
        item_id: item.item_id,
        quantity: item.quantity,
        discounted_price: item.discounted_price,
      })),
    };

    try {
      const response = await OrderServices.createOrders(formData);
      console.log("Order created successfully:", response.data);

      navigate("/receipt", {
        state: {
          order_id: response.data.order_id,
          customer_email: order.customer_email,
          first_name: order.first_name,
          last_name: order.last_name,
          orderItems,
          grandTotal,
        },
      });
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
  };

  return (
    <div className="container my-4">
      <div className="card w-100">
        <div className="card-header bg-light">
          <h2 className="h5 mb-0 text-center">Order Details</h2>
        </div>
        <form onSubmit={handleSubmit} className="card-body d-flex flex-column">
          <div className="flex-fill overflow-auto px-3">
            {/* Customer Email */}
            <div className="mb-2">
              <label className="form-label small mb-0">Customer Email</label>
              <input
                type="email"
                name="customer_email"
                value={order.customer_email}
                onChange={handleChange}
                className={`form-control form-control-sm ${
                  errors.customer_email ? "is-invalid" : ""
                }`}
                placeholder="Enter customer email"
                required
              />
              {errors.customer_email && (
                <div className="invalid-feedback small">
                  {errors.customer_email.join(", ")}
                </div>
              )}
            </div>

            {/* First Name */}
            <div className="mb-2">
              <label className="form-label small mb-0">First Name</label>
              <input
                type="text"
                name="first_name"
                value={order.first_name}
                onChange={handleChange}
                className={`form-control form-control-sm ${
                  errors.first_name ? "is-invalid" : ""
                }`}
                placeholder="First Name"
                required
              />
              {errors.first_name && (
                <div className="invalid-feedback small">
                  {errors.first_name.join(", ")}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div className="mb-3">
              <label className="form-label small mb-0">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={order.last_name}
                onChange={handleChange}
                className={`form-control form-control-sm ${
                  errors.last_name ? "is-invalid" : ""
                }`}
                placeholder="Last Name"
                required
              />
              {errors.last_name && (
                <div className="invalid-feedback small">
                  {errors.last_name.join(", ")}
                </div>
              )}
            </div>

            {/* Order List */}
            <h5 className="mt-4 mb-2 fs-6">Order List</h5>
            {orderItems.length === 0 ? (
              <p className="text-muted text-center small">No items selected</p>
            ) : (
              <div className="border rounded p-2 mb-2 bg-light">
                {" "}
                {/* Added border and padding for visual grouping */}
                {/* Header for the list items */}
                <div className="d-flex justify-content-between text-muted border-bottom pb-1 mb-1 small fw-bold">
                  <span className="col-5">Item Name</span>{" "}
                  {/* approximate column widths */}
                  <span className="col-1 text-center">Qty</span>
                  <span className="col-3 text-end">Unit Price</span>
                  <span className="col-3 text-end">Total</span>
                </div>
                {/* List of order items */}
                {orderItems.map((item) => (
                  <div
                    key={item.item_id}
                    className="d-flex justify-content-between small py-1"
                  >
                    <span className="col-5 text-truncate">
                      {item.item?.item_name || "Unnamed Item"}
                    </span>
                    <span className="col-1 text-center">{item.quantity}</span>
                    <span className="col-3 text-end">
                      ${Number(item.discounted_price).toFixed(2)}
                    </span>
                    <span className="col-3 text-end">
                      <strong>
                        $
                        {(
                          Number(item.discounted_price) * item.quantity
                        ).toFixed(2)}
                      </strong>
                    </span>
                  </div>
                ))}
                {/* Grand Total */}
                <div className="d-flex justify-content-end border-top pt-2 mt-2 fw-bold small">
                  <span className="me-2">Grand Total:</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-3">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSubmitting || orderItems.length === 0}
            >
              {isSubmitting ? "Submitting..." : "Submit Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
