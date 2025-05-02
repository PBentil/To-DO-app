
import './App.css'
import {TodoForm} from "./components /Todo-form.tsx";
import {TodoList} from "./components /TodoList.tsx";

function App() {

  return (
    <>
        <header className="bg-gray-700 p-4 text-white">
            <h1 className="text-center text-2xl">To-Do App</h1>
        </header>
        <div className="flex flex-col items-center bg-gray-200 rounded-lg p-2 w-full h-screen">
            <TodoForm />
            <TodoList />
        </div>
    </>
  )
}

export default App
