import { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import OrderForm from "../../forms/orders/OrderForm";
import type { Items } from "../../../interfaces/Item/Items";
import type { OrderItem } from "../../../interfaces/order_item/order_item";
import ProductsTable from "./product";

const ProductsPage = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const handleItemSelect = (item: Items) => {
    setOrderItems((prevOrderItems) => {
      const existing = prevOrderItems.find((oi) => oi.item_id === item.item_id);
      if (existing) {
        return prevOrderItems.map((oi) =>
          oi.item_id === item.item_id
            ? { ...oi, quantity: oi.quantity + 1 }
            : oi
        );
      } else {
        const newOrderItem: OrderItem = {
          item_id: item.item_id,
          item,
          quantity: 1,
          discounted_price: item.item_price,
          // REMOVED: total_price: item.item_price * 1, // This is no longer part of OrderItem
        };
        return [...prevOrderItems, newOrderItem];
      }
    });
  };

  const handleAddItem = (item: Items) => {
    const discountedPrice =
      Number(item.item_discount) > 0
        ? Number(item.item_price) * (1 - Number(item.item_discount) / 100)
        : Number(item.item_price);

    setOrderItems((prev) => {
      const existing = prev.find((oi) => oi.item_id === item.item_id);
      if (existing) {
        return prev.map((oi) =>
          oi.item_id === item.item_id
            ? {
                ...oi,
                quantity: oi.quantity + 1,
                // REMOVED: total_price: discountedPrice * (oi.quantity + 1), // This is no longer part of OrderItem
              }
            : oi
        );
      } else {
        const newOrderItem: OrderItem = {
          item_id: item.item_id,
          item,
          quantity: 1,
          discounted_price: discountedPrice,
        };
        return [...prev, newOrderItem];
      }
    });
  };

  const handleRemoveItem = (item: Items) => {
    setOrderItems((prev) =>
      prev
        .map((oi) =>
          oi.item_id === item.item_id
            ? {
                ...oi,
                quantity: oi.quantity - 1,
              }
            : oi
        )
        .filter((oi) => oi.quantity > 0)
    );
  };

  const content = (
    <div
      style={{
        display: "flex",
        gap: "20px",
        alignItems: "flex-start",
        padding: "30px",
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: "1000px",
        }}
      >
        <ProductsTable
          onItemSelect={handleItemSelect}
          onIncrease={handleAddItem}
          onDecrease={handleRemoveItem}
        />
      </div>
      <div
        style={{
          flex: "0 0 600px",
        }}
      >
        <OrderForm orderItems={orderItems} />
      </div>
    </div>
  );

  return <MainLayout content={content} />;
};

export default ProductsPage;
