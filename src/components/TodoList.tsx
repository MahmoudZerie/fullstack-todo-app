import { ChangeEvent, FormEvent, useState } from "react";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { ITodo } from "../interfaces";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import Textarea from "./ui/Textarea";
import axiosInstance from "../config/axios.config";
import { EditValidation } from "../validation";
import InputErrorMessage from "./InputErrorMessage";
import TodoSkeleton from "./TodoSkeleton";
import { onGenerateTodos } from "../utils/functions";
const TodoList = () => {
  const storageKey="loggedInUser"
  const userDataString=localStorage.getItem(storageKey);
  const userData=userDataString?JSON.parse(userDataString):null;
  const [isUpdating,setIsUpdating]=useState(false);
  const [isEidtModalOpen,setIsEidtModalOpen]=useState(false);
  const [queryVersion,setQueryVersion]=useState(1);
  const [isOpenConfirmModal,setIsOpenConfirmModal]=useState(false);
  const [isOpenAddModal,setIsOpenAddModal]=useState(false);
  const [errorsEdit,setErrorsEdit]=useState({
    title:"",
    description:""
  })
  const [todoToEdit,setTodoToEdit]=useState<ITodo>({
    id:0,
    title:"",
    description:""
  })
  const [todoToAdd,setTodoToAdd]=useState({
    title:"",
    description:""
  })

  const {isLoading,data}=useAuthenticatedQuery({
    queryKey:["todos",`${queryVersion}`], 
    url:"/users/me?populate=todos",
    config:{
      headers:{
        Authorization:`Bearer ${userData.jwt}`
      }
    }
      
  })
  // ** Handlers
  const onCloseEditModal=()=>{
    setTodoToEdit({
      id:0,
      title:"",
      description:""
    })
    setIsEidtModalOpen(false)
  }
  
  const onCloseAddModal=()=>{
    setTodoToAdd({
      title:"",
      description:""
    })
    setIsOpenAddModal(false)
  }

  const onOpenAddModal=()=>{  
    setIsOpenAddModal(true)
  }

  const closeConfirmModal=()=>{
    setTodoToEdit({
      id:0,
      title:"",
      description:""
    })
    setIsOpenConfirmModal(false)
  }
  const openConfirmModal=(todo:ITodo)=>{  
    setTodoToEdit(todo);
    setIsOpenConfirmModal(true)
  }
    const onsubmitEditHandler=async(event:FormEvent<HTMLFormElement>)=>{
      event.preventDefault();
      const {title,description}=todoToEdit;
      const validationEditErrors=EditValidation({title,description});
      const Error = Object.values(validationEditErrors).some(error => error !== "");
      if(Error){
        setErrorsEdit(validationEditErrors);
         return;
       }
      setIsUpdating(true);
      try {
       const {status}= await axiosInstance.put(`/todos/${todoToEdit.id}`,{
          data:{
            title,description
          }
        },{
          headers:{
            Authorization:`Bearer ${userData.jwt}`
          }
        })
        if(status==200){
          onCloseEditModal();
          setQueryVersion(pre=>pre+1);
        }
      } catch (error) {
        console.log(error)
      }finally{
        setIsUpdating(false);
      }
    }
    const onsubmitAddTodo=async(event:FormEvent<HTMLFormElement>)=>{
      event.preventDefault();
      const {title,description}=todoToAdd;
      const validationEditErrors=EditValidation({title,description});
      const Error = Object.values(validationEditErrors).some(error => error !== "");
      if(Error){
        setErrorsEdit(validationEditErrors);
         return;
       }
      setIsUpdating(true);
      try {
       const {status}= await axiosInstance.post(`/todos`,{
          data:{
            title,description,user:[userData.user.id]
          }
        },{
          headers:{
            Authorization:`Bearer ${userData.jwt}`
          }
        })
        if(status==200){
          onCloseAddModal();
          setQueryVersion(pre=>pre+1);
        }
      } catch (error) {
        console.log(error)
      }finally{
        setIsUpdating(false);
      }
    }


    const onChangeHandler=(event:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
      const {value,name}=event.target;
      setTodoToEdit({
        ...todoToEdit,
        [name]:value
      })
      setErrorsEdit({
        ...errorsEdit,
        [name]:""
      })
    }

    const onChangeAddTodoHandler=(event:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
      const {value,name}=event.target;
      setTodoToAdd({
        ...todoToAdd,
        [name]:value
      })
      setErrorsEdit({ 
        ...errorsEdit,
        [name]:""
      })
    }


    const onRemove=async()=>{
      try {
        const {status}= await axiosInstance.delete(`/todos/${todoToEdit.id}`,{
          headers:{
            Authorization:`Bearer ${userData.jwt}`
          }
        })
        if(status==200){
          setQueryVersion(pre=>pre+1);
          closeConfirmModal();
        } 
      } catch (error) {
        console.log(error)
      }
     
    }


  const onOpenEditModal=(todo:ITodo)=>{
    setTodoToEdit(todo);
    setIsEidtModalOpen(true)
  }
  
  if(isLoading)return(
      <div className="space-y-1">
        {Array.from({length:3},(_,idx)=>(<TodoSkeleton key={idx}/>))}
      </div>
  )
  return (
    <div className="space-y-1 ">

      <div className="w-fit mx-auto my-10">
      {isLoading?(
        <div className="flex items-center space-x-2">
        <div className="w-32 h-9 bg-gray-300 rounded-md dark:bg-gray-400"></div>
        <div className="w-32 h-9 bg-gray-300 rounded-md dark:bg-gray-400"></div>
        </div>
        ):(
        <div className="flex items-center space-x-2">
          <Button size={"sm"} onClick={onOpenAddModal}>Post new todo</Button>
          <Button size={"sm"} onClick={onGenerateTodos}>Generate todos</Button>
        </div>)
    
    
    }


      
      </div>

      {data.todos.length?data.todos.map((todo:ITodo)=>(
        <div key={todo.id} className="flex items-center justify-between hover:bg-[#6D5D6E] bg-[#393646] even:bg-[#4F4557]  duration-300 p-3 rounded-md">
        <p className="w-full font-semibold">{todo.id} - {todo.title}</p>
        <div className="flex items-center justify-end w-full space-x-3">
          <Button size={"sm"} onClick={()=>onOpenEditModal(todo)}>Edit</Button>
          <Button variant={"danger"} size={"sm"} onClick={()=>openConfirmModal(todo)}>
            Remove
          </Button>
        </div>
      </div>

      )):<h3>No todos yet!!</h3>}
      {/* Edit todo modal */}
      <Modal isOpen={isEidtModalOpen} closeModal={onCloseEditModal} title="Edit this todo">
        <form onSubmit={onsubmitEditHandler} className="space-y-3">
        <Input name="title" value={todoToEdit.title} onChange={onChangeHandler}/>
        <InputErrorMessage msg={errorsEdit.title}/>
        <Textarea name="description" value={todoToEdit.description} onChange={onChangeHandler}/>
        <InputErrorMessage msg={errorsEdit.description}/>
        <div className="flex items-center justify-between space-x-40 mt-4">
        <Button isLoading={isUpdating} className="bg-indigo-700 hover:bg-indigo-800">Update</Button>
        <Button type="button" variant={"cancel"} onClick={onCloseEditModal}>Cancel</Button>
        </div>
        </form>
      </Modal>

       {/* Add todo modal */}
       <Modal isOpen={isOpenAddModal} closeModal={onCloseAddModal} title="Add this todo">
        <form onSubmit={onsubmitAddTodo} className="space-y-3">
        <Input name="title" value={todoToAdd.title} onChange={onChangeAddTodoHandler}/>
        <InputErrorMessage msg={errorsEdit.title}/>
        <Textarea name="description" value={todoToAdd.description} onChange={onChangeAddTodoHandler}/>
        <InputErrorMessage msg={errorsEdit.description}/>
        <div className="flex items-center justify-between space-x-40 mt-4">
        <Button isLoading={isUpdating} className="bg-indigo-700 hover:bg-indigo-800">Done</Button>
        <Button type="button" variant={"cancel"} onClick={onCloseAddModal}>Cancel</Button>
        </div>
        </form>
      </Modal>

      {/* Delet Todo Confirm Modal */}
      <Modal title="Are you sure you want to remove this Product from your Store ?" 
            description="Deleting this product will remove it permanently from your inventory. Any associated data,
                      sales history, and other related information will also be deleted. Please make sure this is the intended
                      action." isOpen={isOpenConfirmModal} closeModal={closeConfirmModal}>
          <div className="flex items-center justify-between space-x-2 mt-3">
          <Button variant={"danger"} onClick={onRemove}>Yes, remove</Button>
          <Button variant={"cancel"}  onClick={closeConfirmModal}>Cancel</Button>
          </div>
       </Modal>

    </div>
  );
};

export default TodoList;
// S.O.L.D
