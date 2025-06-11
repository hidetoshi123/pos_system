import React, { useEffect, useState } from "react";
import ReportService from "../../services/ReportService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ReportData {
  item_name: string;
  quantity: number;
  discounted_price: number;
  total: number;
  ordered_at: string;
}

interface AggregatedItem {
  item_name: string;
  total_quantity: number;
  total_revenue: number;
}

const Report: React.FC = () => {
  const [aggregatedData, setAggregatedData] = useState<AggregatedItem[]>([]);

  useEffect(() => {
    ReportService.getReport()
      .then((res) => {
        const data: ReportData[] = res.data;

        const aggregation = data.reduce((acc, curr) => {
          const revenue = curr.quantity * curr.discounted_price;
          const existing = acc.find(
            (item) => item.item_name === curr.item_name
          );

          if (existing) {
            existing.total_quantity += curr.quantity;
            existing.total_revenue += revenue;
          } else {
            acc.push({
              item_name: curr.item_name,
              total_quantity: curr.quantity,
              total_revenue: revenue,
            });
          }

          return acc;
        }, [] as AggregatedItem[]);

        aggregation.sort((a, b) => a.item_name.localeCompare(b.item_name));
        setAggregatedData(aggregation);
      })
      .catch((err) => {
        console.error("Error fetching report:", err);
      });
  }, []);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        📊 Item Sales Summary
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Table Section */}
        <div className="flex-1">
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm text-left text-gray-700 border border-gray-300">
              <thead className="bg-indigo-50 text-indigo-700 uppercase text-xs tracking-wider">
                <tr>
                  <th className="border border-gray-300 px-4 py-3">Item</th>
                  <th className="border border-gray-300 px-4 py-3">
                    Total Sold
                  </th>
                  <th className="border border-gray-300 px-4 py-3">
                    Total Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {aggregatedData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">
                      {item.item_name}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {item.total_quantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-green-600 font-semibold">
                      ${item.total_revenue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart Section */}
        <div className="flex-1 flex flex-col max-w-md">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            💰 Revenue per Item
          </h2>
          <div className="w-1/4 flex flex-col">
            <div className="flex-grow bg-gray-50 p-2 rounded-lg border border-gray-200">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={aggregatedData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    dataKey="item_name"
                    type="category"
                    width={80}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value) =>
                      `$${Number(value).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}`
                    }
                  />
                  <Bar
                    dataKey="total_revenue"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
