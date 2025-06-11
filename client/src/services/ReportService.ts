import AxiosInstance from "../AxiosInstance";

const ReportService = {
  getReport: (params?: { start_date?: string; end_date?: string; group_by?: string }) => {
    return AxiosInstance.get('/report/itemSaleReport', { params });
  },
};

export default ReportService;
