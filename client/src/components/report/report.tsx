import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import ReportService from "../../services/ReportService";

const ItemSalesReportPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(() =>
    format(
      new Date(new Date().setMonth(new Date().getMonth() - 1)),
      "yyyy-MM-dd"
    )
  );
  const [endDate, setEndDate] = useState(() =>
    format(new Date(), "yyyy-MM-dd")
  );

  useEffect(() => {
    fetchSalesReport();
  }, [startDate, endDate]);

  const fetchSalesReport = async () => {
    setLoading(true);
    try {
      const response = await ReportService.itemSaleReport({
        start_date: startDate,
        end_date: endDate,
      });
      setSalesData(response.data);
    } catch (error) {
      console.error("Error fetching sales report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Item Sales Report</h1>

      {/* Date Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      </div>

      {/* Sales Table */}
      {loading ? (
        <p>Loading...</p>
      ) : salesData.length === 0 ? (
        <p>No sales data available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Item Name</th>
                <th className="p-3 border">Total Quantity Sold</th>
                <th className="p-3 border">Total Sales (₱)</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((item: any, index: number) => (
                <tr key={index} className="border-t">
                  <td className="p-3 border">{item.item_name}</td>
                  <td className="p-3 border">{item.total_quantity}</td>
                  <td className="p-3 border">
                    ₱ {Number(item.total_sales).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ItemSalesReportPage;
