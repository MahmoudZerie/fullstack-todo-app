const TodoSkeleton=()=>{
	return(
	<div className="flex items-center justify-between">
    <div>
        <div className="h-2.5 bg-gray-300 rounded-md dark:bg-gray-600 w-24 mb-2.5"></div>
    </div>
    <div className="flex items-center space-x-2">
      <div className="h-9 w-20 bg-gray-300 rounded-md dark:bg-gray-400 "></div>
      <div className="h-9 w-20 bg-gray-300 rounded-md dark:bg-gray-400 "></div>
    </div>
</div>
	)
}
export default TodoSkeleton;