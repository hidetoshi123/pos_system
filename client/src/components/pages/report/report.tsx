import ItemSalesChart from "../../report/report";
import MainLayout from "../../layout/MainLayout";
import TimeBased from "../../report/TimeBased";

const Report = () => {
  const content = (
    <div className="p-6 w-full space-y-10">
      <section className="bg-white p-6 rounded-3xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📈 Sales Chart</h2>
        <ItemSalesChart />
      </section>

      <section className="bg-white p-6 rounded-3xl shadow-md pt-5 ">
        <TimeBased />
      </section>
    </div>
  );

  return <MainLayout content={content} />;
};

export default Report;
