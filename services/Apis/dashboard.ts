import axiosInstance from "@/services/axiosConfig";
class dashboardServices {
  getAllDashboardCount = async ({ queryKey }: any) => {
    const [_key] = queryKey;
    const response = await axiosInstance.get(`/dashboard/counts`);
    return response;
  };
}

export default new dashboardServices();
