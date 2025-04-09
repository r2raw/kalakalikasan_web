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
export const changeImage = async ({ data }) => {
    try {
        const response = await axios.post(`/change-image`, data, {
            headers: {
                'Content-Type': 'multipart/form-data', // Specify multipart/form-data
            },
        });
        return response.data;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || 'Error saving data';
        throw err;
    }
}
export const addImage = async ({ data }) => {
    try {
        const response = await axios.post(`/add-content-image`, data, {
            headers: {
                'Content-Type': 'multipart/form-data', // Specify multipart/form-data
            },
        });
        return response.data;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || 'Error saving data';
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

export const confirmPassword = async (data) => {
    try {

        const response = await axios.post(`/confirm-password`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || 'Error saving data';
        throw err;
    }
}




export const changePassword = async (data) => {
    try {

        const response = await axios.post(`/change-password`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || 'Error saving data';
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
export const editPost = async ({ data }) => {
    try {
        const response = await axios.post(`/edit-content`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || 'Error saving data';
        throw err;
    }
}

export const deleteImage = async (data) => {
    try {
        const response = await axios.patch(`/delete-content-image`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || 'Error saving data';
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
export const fetchReactCount = async ({ signal, id }) => {
    try {
        const response = await axios.get(`/reacts-count/${id}`, { signal });

        return response.data;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error saving data'];
        throw err;

    }
}

export const fetchCommentCount = async ({ signal, id }) => {
    try {
        const response = await axios.get(`/commentCounts-count/${id}`, { signal });

        return response.data;
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
        const response = await axios.patch(`/deactivate-content`, data);

        return response.data.message;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error fetching data'];
        throw err;
    }
}
export const restoreContent = async (data) => {
    try {
        const response = await axios.patch(`/restore-content`, data);

        return response.data.message;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || 'Error fetching data';
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


export const approveStore = async ({ data }) => {
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


export const fetchNewUsers = async ({ signal }) => {
    try {
        const response = await axios.get(`/new-users`, { signal });
        return response.data.users;
    } catch (error) {

        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || 'Error fetching data';
        throw err;
    }
}
export const fetchNewStores = async ({ signal }) => {
    try {
        const response = await axios.get(`/new-stores`, { signal });
        return response.data.stores;
    } catch (error) {

        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || 'Error fetching data';
        throw err;
    }
}
export const fetchTotalWasteToday = async ({ signal }) => {
    try {
        const response = await axios.get(`/total-collected-today`, { signal });
        return response.data.total_grams;
    } catch (error) {

        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || 'Error fetching data';
        throw err;
    }
}
export const fetchMaterialsToday = async ({ signal }) => {
    try {
        const response = await axios.get(`/materials-collected-today`, { signal });
        return response.data;
    } catch (error) {

        const err = new Error(error.response?.data?.error || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || 'Error fetching data';
        throw err;
    }
}
export const fetchExpenseForecast = async ({ signal }) => {
    try {
        const response = await axios.get(`/monthly-expense-forecast`, { signal });
        return response.data;
    } catch (error) {

        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || 'Error fetching data';
        throw err;
    }
}

export const fetchTotalUsers = async ({ signal }) => {
    try {
        const response = await axios.get(`/total-users`, { signal });
        return response.data;
    } catch (error) {

        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || 'Error fetching data';
        throw err;
    }
}
export const fetchMostReactedContents = async ({ signal }) => {
    try {
        const response = await axios.get(`/top-reacted-contents`, { signal });
        return response.data.top_contents;
    } catch (error) {

        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || 'Error fetching data';
        throw err;
    }
}


export const fetchMostCommentedContents = async ({ signal }) => {
    try {
        const response = await axios.get(`/top-commented-contents`, { signal });
        return response.data.top_contents;
    } catch (error) {

        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || 'Error fetching data';
        throw err;
    }
}
export const fetchContentId = async ({ signal, id }) => {
    try {
        const response = await axios.get(`/fetch-content/${id}`, { signal });
        return response.data;
    } catch (error) {

        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || 'Error fetching data';
        throw err;
    }
}
export const fetchContentComment = async ({ signal, id }) => {
    try {
        const response = await axios.get(`/fetch-content-comments/${id}`, { signal });
        return response.data;
    } catch (error) {

        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || 'Error fetching data';
        throw err;
    }
}
export const fetchRecentReactor = async ({ signal }) => {
    try {
        const response = await axios.get(`/recent-reactors`, { signal });
        return response.data;
    } catch (error) {

        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || 'Error fetching data';
        throw err;
    }
}
export const fetchRecentCommentor = async ({ signal }) => {
    try {
        const response = await axios.get(`/recent-commentors`, { signal });
        return response.data;
    } catch (error) {

        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || 'Error fetching data';
        throw err;
    }
}




// Fetch total collected materials
export const fetchTotalMaterialsCollected = async ({ queryKey, signal }) => {
    const [, { year, filter, collectionType }] = queryKey;

    try {
        const response = await axios.get('/total-materials-collected', {
            params: { year, filter, collectionType },
            signal
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error fetching materials");
    }
};

// Fetch available years
export const fetchAvailableYears = async () => {
    try {
        const response = await axios.get('/available-years');
        return response.data;
    } catch (error) {
        throw new Error("Error fetching available years");
    }
};



export const addFeedback = async (data) => {
    try {

        console.log(data)
        const response = await axios.post(`/feedback`, data, {
            headers: {
                'Content-Type': 'application/json', // Specify multipart/form-data
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

export const fetchFeedback = async ({ signal }) => {
    try {

        const response = await axios.get(`/feedback`, { signal });
        return response.data.feedbacks;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error saving data'];
        throw err;
    }
}


export const rejectStore = async ({ data }) => {
    try {
        console.log(data)
        const response = await axios.patch(`/reject-store`, data, {
            headers: {
                'Content-Type': 'application/json', // Specify multipart/form-data
            },
        });

        return response.data.message;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error fetching data'];
        throw err;
    }
}


export const fetchPendingPayments = async ({ signal }) => {
    try {
        const response = await axios.get('/pending-payments', { signal });

        return response.data.payments;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error saving data'];
        throw err;

    }
}




export const fetchStoreData = async ({ signal, id }) => {
    try {
        const response = await axios.get(`/fetch-store/${id}`, { signal });

        return response.data;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error saving data'];
        throw err;

    }
}
export const fetchTopPurchase = async ({ signal, id }) => {
    try {
        const response = await axios.get(`/fetch-store-top-purchases/${id}`, { signal });

        return response.data.products;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error saving data'];
        throw err;

    }
}



export const fetchAccumulatedPoints = async ({ signal, id }) => {
    try {
        const response = await axios.get(`/fetch-store-total-points/${id}`, { signal });

        return response.data.total_points;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error saving data'];
        throw err;

    }
}


export const fetchSalesTrend = async ({ signal, id }) => {
    try {
        const response = await axios.get(`/fetch-store-sales-trend/${id}`, { signal });
        return response.data.salesTrend; // Returns an array of sales trends
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error fetching data'];
        throw err;
    }
};

export const fetchAvailableSalesYears = async ({ signal, id }) => {
    try {
        const response = await axios.get(`/fetch-available-sales-years/${id}`, { signal });
        return response.data.availableYears; // Returns array of available years
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error fetching available years'];
        throw err;
    }
};


export const resentContentActivties = async ({ signal, id }) => {
    try {
        const response = await axios.get(`/content-admin-activity/${id}`, { signal });
        return response.data; // Returns array of available years
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error fetching available years'];
        throw err;
    }
};
export const resentStoreActivties = async ({ signal, id }) => {
    try {
        const response = await axios.get(`/store-admin-activity/${id}`, { signal });
        return response.data; // Returns array of available years
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error fetching available years'];
        throw err;
    }
};
export const fetchPaymentReq = async ({ signal, id }) => {
    try {
        const response = await axios.get(`/view-payment/${id}`, { signal });
        return response.data; // Returns array of available years
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error fetching available years'];
        throw err;
    }
};



export const activateAccount = async ({ data }) => {
    try {
        console.log(data)
        const response = await axios.post(`/activate-account`, data, {
            headers: {
                'Content-Type': 'application/json', // Specify multipart/form-data
            },
        });

        return response.data.message;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error fetching data'];
        throw err;
    }
}


export const fetchActivationLink = async ({ signal, id }) => {
    try {
        const response = await axios.get(`/get-activation-link/${id}`, { signal });
        return response.data; // Returns array of available years
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['Error fetching data'];
        throw err;
    }
};

export const rejectPayment = async ({ data }) => {
    try {

        const response = await axios.post(`/reject-payment`, data, {
            headers: {
                'Content-Type': 'application/json', // Specify multipart/form-data
            },
        });


        return response.data.message;

    } catch (error) {

        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || ['An error occurred'];
        throw err;
    }
}


export const approvePayment = async ({ data }) => {
    try {
        const response = await axios.post(`/approve-payment`, data, {
            headers: {
                'Content-Type': 'multipart/form-data', 
            },
        });
        return response.data.user;
    } catch (error) {
        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || 'Error saving data';
        throw err;
    }
}



export const fetchListOfExpense = async ({ signal }) => {
    try {
        const response = await axios.get(`/expenses-list`, { signal });
        return response.data;
    } catch (error) {

        const err = new Error(error.response?.data?.message || "An error occurred");
        err.code = error.response?.status || 500;
        err.info = error.response?.data || 'Error fetching data';
        throw err;
    }
}