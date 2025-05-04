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
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            setLoading(true);
            const data = await getTodos();
            console.log("fetched todos", data);
            setTodos(data);
        } catch (error) {
            console.error("Error fetching todos:", error);
            alert("Failed to load todos");
        } finally {
            setLoading(false);
        }
    };

    // if (loading) return <p>Loading...</p>;

    const handleDelete = async (id: string) => {
        console.log("Deleting todo with id:", id);
        try {
            await deleteTodo(id);
            // Update state after successful API call
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        } catch (err) {
            console.error("Delete error:", err);
            alert("Error deleting todo");
        }
    };

    const handleEdit = (todo: Todo) => {
        setEditingTodo(todo);
        setIsEditing(true);
        // Reset form and then set values to avoid stale data
        form.resetFields();
        form.setFieldsValue({
            title: todo.title,
            description: todo.description,
            deadline: todo.deadline,
            priority: todo.priority,
            completed: todo.completed
        });
    };

    const handleEditSubmit = async (values: any) => {
        if (!editingTodo) return;

        try {
            const updatedTodo = {
                ...editingTodo,
                ...values,
                // Ensure completed status is preserved if not included in the form
                completed: values.completed !== undefined ? values.completed : editingTodo.completed
            };

            await updateTodo(updatedTodo.id, updatedTodo);

            // Update state after successful API call
            setTodos(prevTodos =>
                prevTodos.map(todo =>
                    todo.id === updatedTodo.id ? updatedTodo : todo
                )
            );

            // Reset state and close modal
            setIsEditing(false);
            setEditingTodo(null);
        } catch (err) {
            console.error("Update error:", err);
            alert("Error updating todo");
        }
    };

    const columns = [
        {
            title: "#",
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
            render: (priority: string) => (
                <span className={`
                    ${priority === 'high' ? 'text-red-500' : ''}
                    ${priority === 'medium' ? 'text-yellow-500' : ''}
                    ${priority === 'low' ? 'text-green-500' : ''}
                `}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </span>
            )
        },
        {
            title: "Status",
            dataIndex: "completed",
            key: "completed",
            render: (completed: boolean) => (
                <span className={completed ? "text-green-500" : "text-red-500"}>
                    {completed ? "Completed" : "Pending"}
                </span>
            )
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (_: any, record: Todo) => (
                <div className="flex gap-2">
                    <Button
                        danger
                        onClick={() => handleDelete(record.id)}
                    >
                        Delete
                    </Button>
                    <button
                        className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-800"
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </button>
                </div>
            ),
        }
    ];

    return (
        <>
            <div className="w-full p-4 rounded-lg">
                <h1 className="text-center text-xl font-bold mb-4">To-Do List</h1>
                <div className="p-4">
                    {todos.length === 0 ? (
                       <Table columns={columns} loading={loading} />
                    ) : (

                        <Table
                            loading={loading}
                            columns={columns}
                            dataSource={todos}
                            rowKey="id"
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                onChange: (page, pageSize) => {
                                    setCurrentPage(page);
                                    setPageSize(pageSize);
                                },
                            }}
                            scroll={{ x: 170 }}
                        />
                    )}
                </div>
            </div>

            <Modal
                title="Edit To Do"
                open={isEditing}
                footer={null}
                onCancel={() => setIsEditing(false)}
                destroyOnClose={true}
            >
                <Form
                    layout="vertical"
                    onFinish={handleEditSubmit}
                    form={form}
                    className="grid grid-cols-2 gap-4"
                    preserve={false}
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: 'Please input a title' }]}
                    >
                        <Input placeholder="Title..." />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <Input placeholder="Description..." />
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
                    <Form.Item
                        label="Status"
                        name="completed"
                        valuePropName="checked"
                        className="col-span-2"
                    >
                        <Select>
                            <Option value={false}>Pending</Option>
                            <Option value={true}>Completed</Option>
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