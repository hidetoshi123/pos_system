import { useEffect, useState } from "react";
import type { Items } from "../../../interfaces/Item/Items";
import ItemService from "../../../services/ItemService";

interface ProductsTableProps {
  onItemSelect: (item: Items) => void;
  onIncrease: (item: Items) => void;
  onDecrease: (item: Items) => void;
}

const ProductsTable = ({
  onItemSelect,
  onIncrease,
  onDecrease,
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4" style={{ fontSize: "1.75rem" }}>
        Products
      </h2>

      {/* Taller container with scroll */}
      <div
        style={{
          height: "600px",
          overflowY: "auto",
        }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table
            className="table table-striped table-hover"
            style={{
              fontSize: "1.2rem",
              minWidth: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead className="table-dark" style={{ fontSize: "1.3rem" }}>
              <tr>
                <th style={{ padding: "25px" }}>Image</th>
                <th style={{ padding: "25px" }}>Name</th>
                <th style={{ padding: "25px" }}>Price</th>
                <th style={{ padding: "25px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.item_id}
                  style={{
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    height: "70px", // Make each row taller
                  }}
                >
                  <td style={{ padding: "25px", textAlign: "center" }}>
                    <img
                      src={`/storage/${item.item_image}`}
                      alt={item.item_name}
                      width="120"
                      height="120"
                      className="img-thumbnail"
                      style={{ objectFit: "cover" }}
                    />
                  </td>
                  <td style={{ padding: "25px" }}>{item.item_name}</td>
                  <td style={{ padding: "25px" }}>
                    {Number(item.item_discount) > 0 ? (
                      <>
                        <span className="text-danger me-2">
                          $
                          {(
                            Number(item.item_price) *
                            (1 - Number(item.item_discount) / 100)
                          ).toFixed(2)}
                        </span>
                        <small className="text-muted text-decoration-line-through">
                          ${Number(item.item_price).toFixed(2)}
                        </small>
                      </>
                    ) : (
                      `$${Number(item.item_price).toFixed(2)}`
                    )}
                  </td>
                  <td style={{ padding: "25px" }}>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => onIncrease(item)}
                    >
                      +
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onDecrease(item)}
                    >
                      -
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center mt-3">
          <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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
