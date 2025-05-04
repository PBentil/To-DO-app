import { useState, useEffect } from "react";
import { getTodos, deleteTodo, updateTodo } from "../Api/mockApi.ts";
import { Button, Form, Input, Modal, Select, Table } from "antd";

const { Option } = Select;

interface Todo {
    id: string;
    title: string;
    description: string;
    deadline: string;
    priority: string;
    completed: boolean;
}

export const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [form] = Form.useForm();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

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

    const columns = [
        {
            title: "ID",
            key: "index",
            render: (_text, _record, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Deadline",
            dataIndex: "deadline",
            key: "deadline",
        },
        {
            title: "Priority",
            dataIndex: "priority",
            key: "priority",
        },
        {
            title: "Status",
            dataIndex: "completed",
            key: "completed",
            render: (completed: boolean) => (completed ? "Completed" : "Pending")
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (_: any, record: Todo) => (
                <div className="flex gap-2">
                    <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
                    <Button type="primary" onClick={() => handleEdit(record)}>Edit</Button>
                </div>
            ),
        }
    ];

    return (
        <>
            <div className="w-full p-4 rounded-lg">
                <h1 className="text-center text-2xl">To-Do List</h1>
                {todos.length === 0 ? (
                    <p>No todos to display</p>
                ) : (
                    <Table columns={columns} dataSource={todos} rowKey="id"   pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        onChange: (page, pageSize) => {
                            setCurrentPage(page);
                            setPageSize(pageSize);
                        },
                    }} />
                )}
            </div>

            <Modal
                title="Edit To Do"
                open={isEditing}
                footer={null}
                onCancel={() => setIsEditing(false)}
            >
                <Form
                    layout="vertical"
                    onFinish={handleEditSubmit}
                    form={form}
                    className="grid grid-cols-2 gap-4"
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: 'Please input a title' }]}
                    >
                        <Input placeholder="Title...." />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <Input placeholder="Description...." />
                    </Form.Item>
                    <Form.Item
                        label="Deadline"
                        name="deadline"
                        rules={[{ required: true, message: 'Please input a deadline' }]}
                    >
                        <Input type="date" className="w-full" />
                    </Form.Item>
                    <Form.Item
                        label="Priority"
                        name="priority"
                        rules={[{ required: true, message: 'Please select a priority' }]}
                    >
                        <Select placeholder="Select a priority">
                            <Option value="low">Low</Option>
                            <Option value="medium">Medium</Option>
                            <Option value="high">High</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item className="col-start-2 justify-self-end">
                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}