import {Form, Input, Select, Modal, Button} from "antd";
import {useState} from "react";

const {Option} = Select;
import {createTodo} from "../Api/mockApi";


export function TodoForm() {
    //to get the info on the forms
    const [form] = Form.useForm()
    const [isModalOpen, setIsModalOpen] = useState(false)

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

const showModal = () => {
        setIsModalOpen(true);
}

const hideModal = () => {
        setIsModalOpen(false);
}

    return (
         <>
             <div className="flex justify-around bg-gray-200 rounded-lg p-3 w-full ">
                 <h1 className="text-xl">Manage your todos below. Click the button to add a new one</h1>
                 <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800" onClick={showModal} >Add Todo</button>
             </div>
             <Modal title="Add To do" open={isModalOpen} footer={null} onClose={hideModal} onCancel={hideModal}>
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
                     <div className="col-span-2 flex justify-end gap-3 mt-4">
                         <button onClick={handleSubmit} className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-800">Add</button>
                         <Button danger  onClick={hideModal} type="primary">Close</Button>
                     </div>
                 </Form>
             </Modal>

         </>



    )
}