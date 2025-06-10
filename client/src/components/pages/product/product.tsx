import { useEffect, useState } from "react";
import type { Items } from "../../../interfaces/Item/Items";
import ItemService from "../../../services/ItemService";
import type { OrderItem } from "../../../interfaces/order_item/order_item";

interface ProductsTableProps {
  onItemSelect: (item: Items) => void;
  onIncrease: (item: Items) => void;
  onDecrease: (item: Items) => void;
  orderItems: OrderItem[];
}

const ProductsTable = ({
  onItemSelect,
  onIncrease,
  onDecrease,
  orderItems,
}: ProductsTableProps) => {
  const [items, setItems] = useState<Items[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadItems();
  }, [page]);

  const PER_PAGE = 5;

  const loadItems = async () => {
    setLoading(true);
    try {
      const response = await ItemService.loadItems({
        page,
        per_page: PER_PAGE,
      });
      setItems(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error("Error loading items", error);
      // Optionally show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  // Helper to get the quantity of an item currently in the order
  const getItemQuantityInOrder = (itemId: number): number => {
    const orderItem = orderItems.find((oi) => oi.item_id === itemId);
    return orderItem ? orderItem.quantity : 0;
  };

  return (
    <div className="d-flex flex-column h-100">
      <h2 className="mb-4 text-center">Products</h2>
      {loading ? (
        <p className="text-center flex-grow-1 d-flex align-items-center justify-content-center">
          Loading products...
        </p>
      ) : items.length === 0 ? (
        <p className="text-center text-muted flex-grow-1 d-flex align-items-center justify-content-center">
          No products found.
        </p>
      ) : (
        <div className="table-responsive flex-grow-1">
          <table className="table table-striped table-hover align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th scope="col" className="py-3">
                  Image
                </th>
                <th scope="col" className="py-3">
                  Name
                </th>
                <th scope="col" className="py-3">
                  Price
                </th>
                <th scope="col" className="py-3">
                  Quantity in Order
                </th>
                <th scope="col" className="py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const quantityInOrder = getItemQuantityInOrder(item.item_id);
                return (
                  <tr key={item.item_id}>
                    <td>
                      <div className="py-4 d-flex justify-content-center align-items-center">
                        <img
                          src={`/storage/${item.item_image}`}
                          alt={item.item_name}
                          width="80"
                          height="80"
                          style={{ objectFit: "cover" }}
                          className="img-thumbnail rounded"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="py-4">
                        <strong className="d-block">{item.item_name}</strong>
                      </div>
                    </td>
                    <td>
                      <div className="py-4">
                        {item.item_discount > 0 ? (
                          <>
                            <span className="text-danger fw-bold me-2 d-block">
                              $
                              {(
                                item.item_price *
                                (1 - item.item_discount / 100)
                              ).toFixed(2)}
                            </span>
                            <small className="text-muted text-decoration-line-through d-block">
                              ${Number(item.item_price).toFixed(2)}
                            </small>
                          </>
                        ) : (
                          <span className="d-block">
                            ${Number(item.item_price).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="py-4">
                        <span className="badge bg-secondary fs-6">
                          {quantityInOrder}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="py-4 d-flex justify-content-center align-items-center gap-2">
                        <button
                          className="btn btn-primary btn-lg" // Changed from btn-sm to btn-lg
                          onClick={() => onIncrease(item)}
                          aria-label={`Add one ${item.item_name}`}
                        >
                          +
                        </button>
                        <button
                          className="btn btn-danger btn-lg" // Changed from btn-sm to btn-lg
                          onClick={() => onDecrease(item)}
                          disabled={quantityInOrder === 0}
                          aria-label={`Remove one ${item.item_name}`}
                        >
                          -
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <nav className="mt-auto">
        <ul className="pagination justify-content-center mt-3">
          <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={loading || page <= 1}
            >
              Prev
            </button>
          </li>
          <li className="page-item disabled">
            <span className="page-link">
              Page {page} of {totalPages}
            </span>
          </li>
          <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={loading || page >= totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ProductsTable;
