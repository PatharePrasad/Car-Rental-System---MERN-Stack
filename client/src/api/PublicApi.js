// import { Axios } from "axios";

// if (!process.env.REACT_APP_SERVER_BASE_URL) throw new Error("Expected an error object to be thrown.");

// const apiManager = new Axios({ baseURL: `${process.env.REACT_APP_SERVER_BASE_URL}api` });
// apiManager.interceptors.request.use((config) => {});

// const healthCheck = async () => {
//     try {
//         const res = await apiManager.get("/");
//         return res.status === 200;
//     } catch (err) {
//         return false;
//     }
// };

// const registerUser = async (data) => {
//     console.log("C", data);
//     const response = await apiManager.post("/auth/register", data);
//     console.log("D", response);
// };

// const exportedMethods = { healthCheck, registerUser };
// export default exportedMethods;
