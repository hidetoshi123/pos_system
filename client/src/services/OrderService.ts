import AxiosInstance from "../AxiosInstance";

const OrderServices = {
    createOrders: async (formData: any) => {
        console.log("Creating order with data: ", formData);
        return AxiosInstance.post('/createOrder', formData)
        .then((response) => response)
        .catch((error) => {throw error;})
    },
};
    

export default OrderServices;