import { useEffect, useRef, useState } from "react";
import type { Items } from "../../../interfaces/Item/Items";
import type { ItemCategories } from "../../../interfaces/itemcategory/ItemCategory";
import ItemCategoryServices from "../../../services/ItemCategoryService";
import ItemService from "../../../services/ItemService";
import ErrorHandler from "../../handler/ErrorHandler";
import Spinner from "../../Spinner";
import type { OrderItem } from "../../../interfaces/order_item/order_item";

interface ItemsTable {
  refreshItems: boolean;
  orderList: OrderItem[];
  onAdd: (item: Items) => void;
  onRemove: (item: Items) => void;
}

const ProductsTable = ({
  refreshItems,
  orderList,
  onAdd,
  onRemove,
}: ItemsTable) => {
  const [state, setState] = useState({
    loadingItems: true,
    items: [] as Items[],
    categories: [] as ItemCategories[],
    filteredItems: [] as Items[],
  });

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sort: "",
  });

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const selectedItemRef = useRef<HTMLDivElement | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const handleLoadItems = (currentPage = 1) => {
    setState((prev) => ({ ...prev, loadingItems: true }));

    Promise.all([
      ItemService.loadItems({ page: currentPage }),
      ItemCategoryServices.loadCategories(),
    ])
      .then(([itemsRes, categoriesRes]) => {
        if (itemsRes.status === 200 && categoriesRes.status === 200) {
          const newItems = itemsRes.data.data;
          const totalPages = itemsRes.data.last_page;

          setState((prev) => ({
            ...prev,
            items: currentPage === 1 ? newItems : [...prev.items, ...newItems],
            categories: categoriesRes.data.categories,
            filteredItems:
              currentPage === 1
                ? newItems
                : [...prev.filteredItems, ...newItems],
            loadingItems: false,
          }));

          setHasMore(currentPage < totalPages);
        } else {
          console.error("Failed to load items or categories");
          setState((prev) => ({ ...prev, loadingItems: false }));
        }
      })
      .catch((error) => {
        ErrorHandler(error, null);
        setState((prev) => ({ ...prev, loadingItems: false }));
      });
  };

  // Load more button
  const loadMoreItems = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    handleLoadItems(nextPage);
  };

  useEffect(() => {
    setPage(1);
    handleLoadItems(1);
  }, [refreshItems]);

  useEffect(() => {
    let filtered = [...state.items];

    if (filters.search.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.item_name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category !== "") {
      filtered = filtered.filter(
        (item) => item.category?.category_id?.toString() === filters.category
      );
    }

    if (filters.sort === "price_asc") {
      filtered.sort((a, b) => Number(a.item_price) - Number(b.item_price));
    } else if (filters.sort === "price_desc") {
      filtered.sort((a, b) => Number(b.item_price) - Number(a.item_price));
    }

    setState((prev) => ({ ...prev, filteredItems: filtered }));
  }, [filters, state.items]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "",
      sort: "",
    });

    setPage(1);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectedItemRef.current &&
        !selectedItemRef.current.contains(event.target as Node)
      ) {
        setSelectedItemId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div
        style={{
          width: 260,
          backgroundColor: "#007bff",
          color: "#fff",
          padding: 16,
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
        }}
      >
        <h5>Advanced Filter</h5>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search by name"
          className="form-control mb-2"
        />
        <select
          className="form-select mb-2"
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
        >
          <option value="">All Categories</option>
          {state.categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id.toString()}>
              {cat.category_name}
            </option>
          ))}
        </select>
        <select
          className="form-select mb-2"
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
        >
          <option value="">Sort by Price</option>
          <option value="price_asc">Low to High</option>
          <option value="price_desc">High to Low</option>
        </select>

        <button
          className="btn btn-light text-primary mt-2"
          onClick={resetFilters}
          style={{ border: "2px solid white" }}
          type="button"
        >
          Reset Filters
        </button>
      </div>

      <div
        style={{
          flex: 1,
          padding: 32,
          marginRight: 400,
          transition: "margin-right 0.3s",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px #e0e0e0",
            marginTop: 20,
            padding: 24,
          }}
        >
          {state.loadingItems && state.items.length === 0 ? (
            <div className="py-3 text-center">
              <Spinner />
            </div>
          ) : state.filteredItems.length > 0 ? (
            <>
              <div className="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-4 py-3">
                {state.filteredItems.map((item) => (
                  <div className="col" key={item.item_id}>
                    <div className="card h-100 shadow-sm product-card">
                      <div
                        className="product-image-wrapper"
                        onClick={() => {
                          const existingOrder = orderList.find(
                            (order) => order.item_id === item.item_id
                          );
                          if (existingOrder) {
                            onRemove(item);
                          } else {
                            onAdd(item);
                          }
                        }}
                        style={{ position: "relative", cursor: "pointer" }}
                      >
                        <img
                          src={`http://localhost:8000/storage/${
                            item.item_image || "Images/placeholder.png"
                          }`}
                          alt={item.item_name}
                          className="card-img-top product-image"
                        />
                        {selectedItemId === item.item_id && (
                          <div
                            ref={selectedItemRef}
                            className="position-absolute top-50 start-50 translate-middle bg-dark bg-opacity-75 p-2 rounded d-flex justify-content-center align-items-center z-2 text-white"
                          >
                            Selected
                          </div>
                        )}
                      </div>
                      <div className="card-body d-flex flex-column">
                        <h6
                          className="card-title product-title"
                          title={item.item_name}
                        >
                          {item.item_name}
                        </h6>
                        <p className="card-text product-description flex-grow-1">
                          {item.item_description}
                        </p>
                        <p className="card-text product-price">
                          <strong>
                            ₱{Number(item.item_price).toLocaleString()}
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More button */}
              {hasMore && (
                <div className="text-center my-3">
                  <button
                    className="btn btn-primary"
                    onClick={loadMoreItems}
                    disabled={state.loadingItems}
                  >
                    {state.loadingItems ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-3 text-center">No Items Found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsTable;
