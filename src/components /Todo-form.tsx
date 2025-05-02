import {Form, Input, Select} from "antd";

const {Option} = Select;
import {createTodo} from "../Api/mockApi";


export function TodoForm() {
    //to get the info on the forms
    const [form] = Form.useForm()

const handleSubmit =async (values: any) => {
    try {
        const newTodo ={
            title: values.title,
            description: values.description,
            deadline: values.deadline,
            priority: values.priority,
            completed: false,
        };
        await createTodo(newTodo);
        alert("To-do added successfully");
        form.resetFields();
    }catch (error){
        console.log(error);
        alert("Error adding to-do");
    }
}


    return (
        <div className="bg-white rounded-lg p-8 w-fit ">
            <h1 className="text-2xl text-center p-4">New To-Do</h1>
                <Form layout="vertical" onFinish={handleSubmit} form={form} className="grid grid-cols-2 gap-4">
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
                        <button type="submit" className="bg-gray-700 text-white rounded-md p-2 w-full">Add</button>
                    </Form.Item>
                </Form>
        </div>
    )
}