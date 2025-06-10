import AxiosInstance from "../AxiosInstance";

const ReportService = {
  itemSaleReport: (params?: { start_date?: string; end_date?: string }) => {
    return AxiosInstance.get('/report/item-sales', { params });
  },
};

export default ReportService;
