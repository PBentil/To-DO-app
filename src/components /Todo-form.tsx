import {Form, Input, Select} from "antd";
import {useState} from "react";
const {Option} = Select;


export function TodoForm() {
    //to save the values in the objects
    const [todos , setTodos] = useState({
        title: '',
        description: '',
        deadline: '',
        priority: '',
    });

    const handleChange = (e: any) => {
        setTodos({
            ...todos,
            [e.target.name]: e.target.value
        })
    };
const handleSelectChange = (e: any) => {
    setTodos({
        ...todos,
        priority: e,
    });
}


    //to get the info on the forms
    const [form] = Form.useForm()

        //handles submit forms
    const handleSubmit = (values: any) => {
        console.log(values);
        //backend code is supposed to be here
        alert('Success!!');
        form.resetFields();
    }


    return (
        <div className="bg-white rounded-lg p-8 w-fit ">
            <h1 className="text-2xl text-center p-4">New To-Do</h1>
                <Form layout="vertical" onFinish={handleSubmit} form={form} className="grid grid-cols-2 gap-4">
                    <Form.Item label="Title"  rules={[{required: true, message: 'Please input a title'}]}>
                        <Input type="text" name="title" placeholder="Title...." value={todos.title} onChange={handleChange}/>
                    </Form.Item>
                    <Form.Item label="Description"  >
                        <Input type="text" name="description" placeholder="Description...." value={todos.description} onChange={handleChange}/>
                    </Form.Item>
                    <Form.Item label="Deadline" name="deadline"  rules={[{required: true, message: 'Please input a deadline'}]}>
                        <input type="date" name="deadline" className="border rounded-md p-1 border-gray-300 w-full" value={todos.deadline} onChange={handleChange}/>
                    </Form.Item>
                        <Form.Item label="Priority" name="priority"  rules={[{required: true, message: 'Please select a priority'}]}>
                        <Select  placeholder="Select a priority" value={todos.priority} onChange={handleSelectChange} >
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