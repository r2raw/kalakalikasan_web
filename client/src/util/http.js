import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const queryClient = new QueryClient();
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const fetchUserData = async ({ id, signal }) => {
    try {
        const response = await axios.get(`/user/${id}`, { signal });
        return response.data.user;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error fetching data'];
        throw err;
    }
};

export const fetchActiveUsers = async ({ signal }) => {
    try {
        const response = await axios.get(`/activeUsers`, { signal });

        return response.data.users;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error fetching data'];
        throw err;
    }
};


export const fetchInactiveUsers = async ({ signal }) => {
    try {
        const response = await axios.get(`/inactiveUsers`, { signal });
        return response.data.users;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error fetching data'];
        throw err;
    }
};

export const deactivateUser = async ({ data }) => {
    try {
        console.log(data)
        const response = await axios.patch(`/deactivate-user`, { id: data });

        return response.data.message;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error fetching data'];
        throw err;
    }
}

export const activateUser = async ({ data }) => {
    try {
        console.log(data)
        const response = await axios.patch(`/activate-user`, { id: data });

        return response.data.message;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error fetching data'];
        throw err;
    }
}
export const createUser = async ({ data }) => {
    try {
        const response = await axios.post(`/register`, data, {
            headers: {
                'Content-Type': 'multipart/form-data', // Specify multipart/form-data
            },
        });
        return response.data.user;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error saving data'];
        throw err;
    }
}

export const userLogin = async ({ data }) => {
    try {


        const response = await axios.post('/login', data)

        if (!response) {
            const error = new Error("An error occurred while fetching the data");
            error.code = response.status;
            error.info = await response.json();
            throw error;
        }

        const { id } = response.data
        return id;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error fetching data'];
        throw err;

    }


}

export const editUser = async ({ data }) => {
    try {
        const response = await axios.patch(`/edit-user`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.user;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error saving data'];
        throw err;
    }
}









//media content

export const createPost = async ({ data }) => {
    try {
        const response = await axios.post(`/create-post`, data, {
            headers: {
                'Content-Type': 'multipart/form-data', // Specify multipart/form-data
            },
        });
        return response.data;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error saving data'];
        throw err;
    }
}

export const fetchContent = async ({ signal }) => {
    try {
        const response = await axios.get('/fetch-contents', { signal });

        return response.data.contentData;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error saving data'];
        throw err;

    }
}

export const fetchDeactivatedContent = async ({ signal }) => {
    try {
        const response = await axios.get('/fetch-archived-contents', { signal });

        return response.data.contents;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error saving data'];
        throw err;

    }
}

export const deactivateContent = async ({ data }) => {
    try {
        const response = await axios.patch(`/deactivate-content`, { id: data });

        return response.data.message;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error fetching data'];
        throw err;
    }
}



// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> STORES REQUEST HERE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


export const fetchPendingStores = async ({ signal }) => {
    try {
        const response = await axios.get(`/application-request`, { signal });
        return response.data.stores;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error fetching data'];
        throw err;
    }
}

export const fetchApprovedStore = async ({ signal }) => {
    try {
        const response = await axios.get(`/approved-stores`, { signal });
        return response.data.stores;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error fetching data'];
        throw err;
    }
}

export const fetchStoreInfo = async ({ signal, id }) => {
    try {
        const response = await axios.get(`/store-info/${id}`, { signal });
        return response.data.store;
    } catch (error) {

        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error fetching data'];
        throw err;
    }
}


export const approveStore= async ({ data }) => {
    try {
        const response = await axios.patch(`/approve-store`, data);
        return response.data.user;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error saving data'];
        throw err;
    }
}