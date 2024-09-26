import axiosInstance from "@/services/axiosConfig";
class workerServices {
  // CREATE THE BLOG
  createWorker = async (bodyData: any) => {
    if (!bodyData) return null;
    return await axiosInstance.post(`/workers`, bodyData);
  };

  updateWorker = async (id: string, bodyData: any) => {
    if (!id || !bodyData) return null;
    return await axiosInstance.patch(`/workers/${id}`, bodyData);
  };

  // GET ALL BLOGS
  getAllWorkers = async ({ queryKey }: any) => {
    const [_key, page, rowsPerPage, debouncedSearchQuery] = queryKey;
    const params = {
      page: page || 1,
      limit: rowsPerPage || 10,
      search: debouncedSearchQuery || "",
    };
    const response = await axiosInstance.get(`/workers`, { params });

    return response;
  };

  deleteWorker = async (id: string) => {
    if (!id) return null;
    return await axiosInstance.delete(`/workers/${id}`);
  };
  // BLOG BY USER ID
  //   getWorkersByUserId = async ({ queryKey }: any) => {
  //     const [_key, { userId }] = queryKey;
  //     var response = await axiosInstance.get(`/api/${userId}/blogs`);
  //     return response;
  //   };

  // activateUser = async (organizationId, userId) => {
  //   if (!organizationId || !userId) return null;
  //   return await axiosInstance.post(
  //     `/organizations/${organizationId}/users/${userId}/activate`
  //   );
  // };

  // archiveUser = async (organizationId, userId) => {
  //   if (!organizationId || !userId) return null;
  //   return await axiosInstance.post(
  //     `/organizations/${organizationId}/users/${userId}/archive`
  //   );
  // };

  // deactivateUser = async (organizationId, userId) => {
  //   if (!organizationId || !userId) return null;
  //   return await axiosInstance.post(
  //     `/organizations/${organizationId}/users/${userId}/deactivate`
  //   );
  // };

  // restoreUser = async (organizationId, userId) => {
  //   if (!organizationId || !userId) return null;
  //   return await axiosInstance.post(
  //     `/organizations/${organizationId}/users/${userId}/restore`
  //   );
  // };

  // getPermission = async ({ queryKey }) => {
  //   const [_key, { take, skip, organizationId, permissionCode }] = queryKey;
  //   var response = await axiosInstance.get(
  //     `/organizations/${organizationId}/permissions/${permissionCode}/users`,
  //     {
  //       params: {
  //         organizationId,
  //         permissionCode,
  //         take,
  //         skip,
  //       },
  //     }
  //   );
  //   return response;
  // };

  // assignPermissions = async (organizationId, userId, permissions) => {
  //   if (!userId) return null;
  //   return await axiosInstance.post(
  //     `/organizations/${organizationId}/users/${userId}/assign-permissions`,
  //     permissions
  //   );
  // };

  //   getUserById = async ({ queryKey }: any) => {
  //     const [_key, { userId }] = queryKey;
  //     var response = await axiosInstance.get(`api/user/${userId}`);
  //     return response;
  //   };

  // updateUserById = async (organizationId, userId, data) => {
  //   var response = await axiosInstance.patch(
  //     `/organizations/${organizationId}/users/${userId}`,
  //     data
  //   );
  //   return response;
  // };
}

export default new workerServices();
