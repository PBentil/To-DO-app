import axios from 'axios';

const BASE_URL = 'https://68148657225ff1af16291c5f.mockapi.io/todoapi';


export  const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

export const getTodos = async () => {
    try {
        const response = await axiosInstance.get('/todos');
        return response.data;
    } catch (err) {
        console.error("getTodos error:", err);
        return [];
    }
};

//function to create todos
export const createTodo = (data: {
    title: string;
    description: string;
    deadline: string;
    priority: string;
    completed: boolean;
}) => {
    return axiosInstance.post('/todos', data);
};
//function to delete todos
export const deleteTodo = async (id: string) => {
    try {
        const response = await axios.delete(`/todos/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting todo:", error);
        throw error;
    }
};

export const updateTodo = (id: string, data: Partial<any>) => {
    return axiosInstance.put(`/todos/${id}`, data);
};