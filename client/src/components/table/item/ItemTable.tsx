// Tibor_pos_system\client\src\components\table\item\ItemTable.tsx
import type { Items } from "../../../interfaces/Item/Items";
import { Link } from "react-router-dom";
import Spinner from "../../Spinner";
import AddItemModal from "../../modals/item/AddItemModal";
import { useState, useEffect } from "react";
import AddItemCategory from "../../modals/itemCategory/ItemCategoryModal";
import InfiniteScroll from "react-infinite-scroll-component";

interface ItemsTableProps {
  items: Items[];
  loadingItems: boolean;
  hasMore: boolean;
  loadMoreItems: () => void;
  onEditItem: (item: Items) => void;
  onDeleteItem: (item: Items) => void;
  refreshTable: () => void; // Added new prop for refreshing the table
}

const ItemsTable = ({
  items,
  loadingItems,
  hasMore,
  loadMoreItems,
  onEditItem,
  onDeleteItem,
  refreshTable, // Added to props
}: ItemsTableProps) => {
  const [openAddItemModal, setOpenAddItemModal] = useState(false);
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [refreshItems, setRefreshItems] = useState(false);

  useEffect(() => {
    if (refreshItems) {
      refreshTable();
      setRefreshItems(false);
    }
  }, [refreshItems, refreshTable]);

  const handleEdit = (item: Items) => {
    onEditItem(item);
  };

  const handleDelete = (item: Items) => {
    onDeleteItem(item);
  };

  return (
    <div style={{ flex: 1, padding: 32, backgroundColor: "#f8f9fa" }}>
      {/* Top Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 20,
          gap: 12,
        }}
      >
        <button
          className="btn btn-success btn-lg"
          style={{
            padding: "12px 24px",
            fontWeight: "600",
            borderRadius: 20,
            fontSize: "1.2rem",
          }}
          onClick={() => setOpenAddItemModal(true)}
        >
          + Add Item
        </button>
        <button
          className="btn btn-primary btn-lg"
          style={{
            padding: "12px 24px",
            fontWeight: "600",
            borderRadius: 20,
            fontSize: "1.2rem",
          }}
          onClick={() => setOpenAddCategoryModal(true)}
        >
          + Add Category
        </button>
      </div>

      {/* Table Wrapper */}
      <div
        id="scrollableDiv"
        style={{
          height: "80vh",
          overflowY: "auto",
          overflowX: "auto",
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e0e0e0",
          padding: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div className="table-responsive">
          <table
            className="table"
            style={{
              width: "100%",
              borderSpacing: "0 12px",
              fontSize: "1.4rem",
            }}
          >
            <thead>
              <tr style={{ color: "#555" }}>
                <th style={{ fontSize: "1.4rem" }}>No.</th>
                <th style={{ fontSize: "1.4rem" }}>Image</th>
                <th style={{ fontSize: "1.4rem" }}>Item</th>
                <th style={{ fontSize: "1.4rem" }}>Description</th>
                <th style={{ fontSize: "1.4rem" }}>Price</th>
                <th style={{ fontSize: "1.4rem" }}>Discount</th>
                <th style={{ fontSize: "1.4rem" }}>Stocks</th>
                <th style={{ fontSize: "1.4rem" }}>Status</th>
                <th style={{ fontSize: "1.4rem" }}>Category</th>
                <th style={{ fontSize: "1.4rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr
                    className="align-middle"
                    key={item.item_id}
                    style={{
                      background: "#fff",
                      borderBottom: "1px solid #eee",
                      verticalAlign: "middle",
                    }}
                  >
                    <td style={{ fontSize: "1.4rem" }}>{index + 1}</td>
                    <td>
                      {item.item_image ? (
                        <Link to={`/items/${item.item_id}`}>
                          <img
                            src={`http://localhost:8000/storage/${item.item_image}`}
                            alt={item.item_name}
                            className="rounded"
                            style={{
                              width: 100,
                              height: 100,
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "2px solid #6c757d",
                              cursor: "pointer",
                            }}
                          />
                        </Link>
                      ) : (
                        <div
                          style={{
                            width: 100,
                            height: 100,
                            borderRadius: "8px",
                            backgroundColor: "#ccc",
                            display: "inline-block",
                          }}
                        />
                      )}
                    </td>
                    <td style={{ fontSize: "1.4rem" }}>{item.item_name}</td>
                    <td style={{ fontSize: "1.4rem" }}>
                      {item.item_description}
                    </td>
                    <td style={{ fontSize: "1.4rem" }}>
                      ₱{Number(item.item_price).toFixed(2)}
                    </td>
                    <td style={{ fontSize: "1.4rem" }}>
                      {item.item_discount}%
                    </td>
                    <td style={{ fontSize: "1.4rem" }}>{item.item_quantity}</td>
                    <td>
                      <span
                        className={`badge ${
                          item.stock_level === "In Stock"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                        style={{
                          fontSize: "1.2rem",
                          padding: "8px 16px",
                          borderRadius: 20,
                          textTransform: "uppercase",
                        }}
                      >
                        {item.stock_level}
                      </span>
                    </td>
                    <td style={{ fontSize: "1.4rem" }}>
                      {item.category?.category_name ?? "N/A"}
                    </td>
                    <td>
                      <div className="btn-group" style={{ gap: 8 }}>
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-lg"
                          style={{
                            borderRadius: 20,
                            fontSize: "1.3rem",
                            padding: "8px 16px",
                          }}
                          onClick={() => handleEdit(item)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-lg"
                          style={{
                            borderRadius: 20,
                            fontSize: "1.3rem",
                            padding: "8px 16px",
                          }}
                          onClick={() => handleDelete(item)}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="align-middle">
                  <td
                    colSpan={10}
                    className="text-center text-muted"
                    style={{ fontSize: "1.4rem" }}
                  >
                    No Items Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddItemModal
        showModal={openAddItemModal}
        onRefreshItems={() => {
          setRefreshItems(true);
        }}
        onClose={() => setOpenAddItemModal(false)}
      />

      <AddItemCategory
        showModal={openAddCategoryModal}
        onRefreshItems={() => {
          setRefreshItems(true);
        }}
        onClose={() => setOpenAddCategoryModal(false)}
      />
    </div>
  );
};

export default ItemsTable;
