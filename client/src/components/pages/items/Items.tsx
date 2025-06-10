// Tibor_pos_system\client\src\components\pages\items\Items.tsx
import { useState, useEffect } from "react";
import type { Items } from "../../../interfaces/Item/Items";
import ItemsTable from "../../table/item/ItemTable";
import MainLayout from "../../layout/MainLayout";
import AddItemModal from "../../modals/item/AddItemModal";
import EditItemModal from "../../modals/item/EditItemModal";
import DeleteItemModal from "../../modals/item/DeleteItemModal";
import ItemAlert from "../../forms/alert/ItemAlert";
import ItemService from "../../../services/ItemService";
import ErrorHandler from "../../handler/ErrorHandler";
import { Button } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";

const ItemsPage = () => {
  const [refreshItems, setRefreshItems] = useState(false);
  const [items, setItems] = useState<Items[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [selectedItem, setSelectedItem] = useState<Items | null>(null);
  const [openAddItemModal, setOpenAddItemModal] = useState(false);
  const [openEditItemModal, setOpenEditItemModal] = useState(false);
  const [openDeleteItemModal, setOpenDeleteItemModal] = useState(false);

  const loadItems = (currentPage: number = 1) => {
    setLoadingItems(true);
    ItemService.loadItems({ page: currentPage })
      .then((res) => {
        if (res.status === 200) {
          const newItems = res.data.data;

          setItems((prevItems) =>
            currentPage === 1 ? newItems : [...prevItems, ...newItems]
          );

          setHasMore(newItems.length >= 10);
        } else {
          console.error(
            "Unexpected status error while loading items:",
            res.status
          );
        }
      })
      .catch((error) => {
        ErrorHandler(error, null);
      })
      .finally(() => {
        setLoadingItems(false);
      });
  };

  useEffect(() => {
    setPage(1);
    loadItems(1);
  }, [refreshItems]);

  const loadMoreItems = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadItems(nextPage);
  };

  const handleOpenEditItemModal = (item: Items) => {
    setSelectedItem(item);
    setOpenEditItemModal(true);
  };

  const handleCloseEditItemModal = () => {
    setSelectedItem(null);
    setOpenEditItemModal(false);
  };

  const handleOpenDeleteItemModal = (item: Items) => {
    setSelectedItem(item);
    setOpenDeleteItemModal(true);
  };

  const handleCloseDeleteItemModal = () => {
    setSelectedItem(null);
    setOpenDeleteItemModal(false);
  };

  const toggleAlertVisibility = () => {
    setShowAlert(!showAlert);
  };

  const lowStockItems = items.filter((item) => item.item_quantity < 100);

  const content = (
    <>
      {openAddItemModal && (
        <AddItemModal
          showModal={true}
          onRefreshItems={() => setRefreshItems(!refreshItems)}
          onClose={() => setOpenAddItemModal(false)}
        />
      )}
      {openEditItemModal && (
        <EditItemModal
          showModal={true}
          item={selectedItem}
          onRefreshItems={() => setRefreshItems(!refreshItems)}
          onClose={handleCloseEditItemModal}
        />
      )}
      <DeleteItemModal
        showModal={openDeleteItemModal}
        item={selectedItem}
        onRefreshItems={() => setRefreshItems(!refreshItems)}
        onClose={handleCloseDeleteItemModal}
      />

      {/* Alert Toggle Button */}
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          type="text"
          icon={showAlert ? <UpOutlined /> : <DownOutlined />}
          onClick={toggleAlertVisibility}
          style={{ padding: "4px 0" }}
        >
          {showAlert ? "Hide Alerts" : "Show Alerts"}
        </Button>
      </div>

      {/* Alert Section */}
      {showAlert && (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e0e0e0",
            padding: "20px 24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            marginBottom: "2rem",
          }}
        >
          <h5 style={{ fontSize: "1.1rem", marginBottom: 16, fontWeight: 600 }}>
            🔔 Stock Alerts
          </h5>
          <ItemAlert lowStockItems={lowStockItems} loading={loadingItems} />
        </div>
      )}

      {/* Items Table */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 24 }}>
        <ItemsTable
          loadingItems={loadingItems}
          items={items}
          hasMore={hasMore}
          loadMoreItems={loadMoreItems}
          onEditItem={handleOpenEditItemModal}
          onDeleteItem={handleOpenDeleteItemModal}
          refreshTable={() => setRefreshItems(!refreshItems)}
        />
      </div>
    </>
  );

  return <MainLayout content={content} />;
};

export default ItemsPage;
