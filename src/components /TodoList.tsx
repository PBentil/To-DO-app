import {useState, useEffect} from "react";
import {getTodos,deleteTodo, updateTodo } from "../Api/mockApi.ts";
import {Form, Input, Modal, Select} from "antd";

const {Option} = Select;

interface Todo {
    id: string;
    title: string;
    description: string;
    deadline: string;
    priority: string;
    completed: boolean;
}

export const TodoList =() => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingTodo, setEditingTodo] = useState<any>(null);
    const [form] = Form.useForm();


    useEffect(() => {
        const fetchTodos = async () => {
            const data = await getTodos();
            console.log("fetched todos", data);
            setTodos(data);
            setLoading(false);
        };
        fetchTodos();

    }, []);

    if (loading) return <p>Loading...</p>;


    const handleDelete = async (id: string) => {
        console.log("Deleting todo with id:", id);  // Debugging log
        try {
            await deleteTodo(id);
            setTodos(todos.filter(todo => todo.id !== id)); // Remove from state
        } catch (err) {
            console.log("handle delete error", err);
            alert("Error deleting todo");
        }
    };

    const handleEdit = (todo: Todo) => {
        setEditingTodo(todo);
        setIsEditing(true);
        form.setFieldsValue(todo); // Pre-fill the form with the current todo data
    };


    const handleEditSubmit = async (values: any) => {
        if (editingTodo) {
            try {
                const updatedTodo = { ...editingTodo, ...values };
                await updateTodo(updatedTodo.id, updatedTodo); // Call the update API function
                setTodos(todos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo))); // Update todo list
                setIsEditing(false); // Close modal
                setEditingTodo(null); // Reset editingTodo
            } catch (err) {
                console.log("handleEditSubmit error", err);
                alert("Error updating todo");
            }
        }
    };
    return (

    <>
            <div className="bg-gray-700 text-white w-full p-4 rounded-lg">
                <h1 className="text-center text-2xl">To-Do List</h1>
                {todos.length === 0 ? ( <p>No todos to display</p>
                    ):(
                        <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                <h2>{todo.title}</h2>
                {todo.description && <p>{todo.description}</p>}
                <p>Deadline: {todo.deadline}</p>
                <p>Priority: {todo.priority}</p>
                <p>Status: {todo.completed ? "completed" : "pending"}</p>
                        <div className="flex justify-between">
                            <button onClick={() => handleEdit(todo)}>Edit</button>
                            <button onClick={()=>handleDelete(todo.id)}>Delete</button>
                        </div>
                    </li>
            ))}
                    </ul>
                    )}
            </div>

        <div>
            <Modal title="Edit To Do" visible={isEditing} footer={null} onCancel={()=> setIsEditing(false)}>
                <Form layout="vertical" onFinish={handleEditSubmit} form={form} className="grid grid-cols-2 gap-4">
                    <Form.Item label="Title" name="title" rules={[{required: true, message: 'Please input a title'}]}>
                        <Input type="text" name="title" placeholder="Title...." />
                    </Form.Item>
                    <Form.Item label="Description" name="description"  >
                        <Input type="text" name="description" placeholder="Description...." />
                    </Form.Item>
                    <Form.Item label="Deadline" name="deadline"  rules={[{required: true, message: 'Please input a deadline'}]}>
                        <input type="date" name="deadline" className="border rounded-md p-1 border-gray-300 w-full" />
                    </Form.Item>
                    <Form.Item label="Priority" name="priority"  rules={[{required: true, message: 'Please select a priority'}]}>
                        <Select  placeholder="Select a priority" >
                            <Option value="low">Low</Option>
                            <Option value="medium">Medium</Option>
                            <Option value="high">High</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item className="col-start-2 justify-self-end">
                        <button type="submit" className="bg-gray-700 text-white rounded-md p-2 w-full">Update</button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
        </>
    )
}