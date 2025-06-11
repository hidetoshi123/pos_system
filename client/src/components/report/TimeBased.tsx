import React, { useEffect, useState } from "react";
import ReportService from "../../services/ReportService";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(isoWeek);
dayjs.extend(weekday);

interface ReportData {
  ordered_at: string;
  total: number;
  quantity: number;
  item_name: string;
}

interface RevenueRow {
  date: string;
  total_revenue: number;
  total_quantity: number;
  most_popular_item: string;
}

const TimeBased: React.FC = () => {
  const [dailyRevenue, setDailyRevenue] = useState<RevenueRow[]>([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState<RevenueRow[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<RevenueRow[]>([]);

  useEffect(() => {
    ReportService.getReport()
      .then((res) => {
        const rawData: ReportData[] = res.data;

        const groupData = (
          keyFn: (d: ReportData) => string
        ): Record<
          string,
          {
            total_revenue: number;
            total_quantity: number;
            itemSales: Record<string, number>;
          }
        > => {
          const map: Record<
            string,
            {
              total_revenue: number;
              total_quantity: number;
              itemSales: Record<string, number>;
            }
          > = {};

          rawData.forEach((entry) => {
            const key = keyFn(entry);
            if (!map[key]) {
              map[key] = {
                total_revenue: 0,
                total_quantity: 0,
                itemSales: {},
              };
            }
            map[key].total_revenue += entry.total;
            map[key].total_quantity += entry.quantity;
            map[key].itemSales[entry.item_name] =
              (map[key].itemSales[entry.item_name] || 0) + entry.quantity;
          });

          return map;
        };

        const transformToRows = (
          map: Record<
            string,
            {
              total_revenue: number;
              total_quantity: number;
              itemSales: Record<string, number>;
            }
          >
        ): RevenueRow[] =>
          Object.entries(map)
            .map(([date, data]) => {
              const itemEntries = Object.entries(data.itemSales);
              const mostPopularItem =
                itemEntries.length > 0
                  ? itemEntries.sort((a, b) => b[1] - a[1])[0][0]
                  : "N/A";

              return {
                date,
                total_revenue: data.total_revenue,
                total_quantity: data.total_quantity,
                most_popular_item: mostPopularItem,
              };
            })
            .sort((a, b) => (a.date > b.date ? -1 : 1));

        setDailyRevenue(
          transformToRows(
            groupData((entry) => dayjs(entry.ordered_at).format("YYYY-MM-DD"))
          )
        );

        setWeeklyRevenue(
          transformToRows(
            groupData((entry) =>
              dayjs(entry.ordered_at).startOf("isoWeek").format("YYYY-[W]WW")
            )
          )
        );

        setMonthlyRevenue(
          transformToRows(
            groupData((entry) => dayjs(entry.ordered_at).format("YYYY-MM"))
          )
        );
      })
      .catch((err) => {
        console.error("Failed to fetch revenue:", err);
      });
  }, []);

  const renderRevenueTable = (title: string, rows: RevenueRow[]) => (
    <div className="mb-10">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">{title}</h2>
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-left text-gray-700 border border-gray-300">
          <thead className="bg-indigo-50 text-indigo-700 uppercase text-xs tracking-wider">
            <tr>
              <th className="border border-gray-300 px-4 py-3">Date</th>
              <th className="border border-gray-300 px-4 py-3">
                Total Revenue
              </th>
              <th className="border border-gray-300 px-4 py-3">Items Sold</th>
              <th className="border border-gray-300 px-4 py-3">
                Most Popular Item
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3">{row.date}</td>
                <td className="border border-gray-300 px-4 py-3 text-green-600 font-semibold">
                  ${row.total_revenue.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  {row.total_quantity}
                </td>
                <td className="border border-gray-300 px-4 py-3 font-medium text-indigo-700">
                  {row.most_popular_item}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full px-6 py-8 bg-white rounded-3xl shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">
        📊 Revenue Overview
      </h1>
      <div className="m-3">
        {renderRevenueTable("📅 Daily Revenue", dailyRevenue)}
      </div>
      <div className="m-3">
        {renderRevenueTable("🗓️ Weekly Revenue", weeklyRevenue)}
      </div>
      <div className="m3">
        {renderRevenueTable("📆 Monthly Revenue", monthlyRevenue)}
      </div>
    </div>
  );
};

export default TimeBased;
