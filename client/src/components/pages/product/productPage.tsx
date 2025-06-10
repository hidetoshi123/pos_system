import { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import OrderForm from "../../forms/orders/OrderForm";
import type { Items } from "../../../interfaces/Item/Items";
import type { OrderItem } from "../../../interfaces/order_item/order_item";
import ProductsTable from "./product";

const ProductsPage = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Function to calculate discounted price
  const calculateDiscountedPrice = (item: Items): number => {
    return item.item_price * (1 - item.item_discount / 100);
  };

  const handleIncreaseItem = (item: Items) => {
    const discountedPrice = calculateDiscountedPrice(item);

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
          discounted_price: discountedPrice,
        };
        return [...prevOrderItems, newOrderItem];
      }
    });
  };

  const handleDecreaseItem = (item: Items) => {
    setOrderItems((prevOrderItems) => {
      const existing = prevOrderItems.find((oi) => oi.item_id === item.item_id);
      if (existing) {
        if (existing.quantity === 1) {
          // Remove item if quantity reaches 1 (not 0, as you typically don't show quantity 0)
          return prevOrderItems.filter((oi) => oi.item_id !== item.item_id);
        } else {
          return prevOrderItems.map((oi) =>
            oi.item_id === item.item_id
              ? { ...oi, quantity: oi.quantity - 1 }
              : oi
          );
        }
      }
      return prevOrderItems; // Return prevOrderItems if item not found
    });
  };

  const content = (
    // To make a sticky element work correctly within a flex container
    // that might have scrolling, you often need to ensure the flex
    // container's height is defined and that scrolling happens on a parent
    // or the flex container itself.
    // In this case, we'll let the MainLayout's <main> element handle the
    // primary scroll, and make the direct parent of the sticky element
    // tall enough.
    <div
      style={{
        display: "flex",
        gap: "20px",
        // alignItems: "flex-start", // Keep this if you want items aligned to the top
        width: "100%",
        // We might need to ensure this container fills available height
        // so that scrolling can happen within the `MainLayout`'s `main` area.
        // minHeight: "calc(100vh - 80px)", // Example: adjust based on navbar/header height
      }}
    >
      <div
        style={{
          flex: 3, // give more room to table
        }}
      >
        <ProductsTable
          onItemSelect={handleIncreaseItem}
          onIncrease={handleIncreaseItem}
          onDecrease={handleDecreaseItem}
          orderItems={orderItems}
        />
      </div>
      <div
        style={{
          flex: 1, // smaller sidebar
          minWidth: "300px",
          // The key to sticky:
          position: "sticky",
          top: "40px", // Stick 40px from the top of its scrolling container (MainLayout's main)
          alignSelf: "flex-start", // Ensures it stays at the top of its flex line
          maxHeight: "calc(100vh - 80px)", // Adjust based on your layout to prevent overflow
          overflowY: "auto", // Add scrollbar if content exceeds max height
        }}
      >
        <OrderForm orderItems={orderItems} />
      </div>
    </div>
  );

  return <MainLayout content={content} />;
};

export default ProductsPage;
