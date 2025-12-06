import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAddCategoryMutation, useDeleteCategoryMutation, useFetchCategoriesQuery } from '../../../redux/features/category/categoryApi'

const AddCategory = () => {
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation()
    const { data: categories, isLoading: isFetching } = useFetchCategoriesQuery()
    const [deleteCategory] = useDeleteCategoryMutation()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!name) {
            setMessage('Please enter a category name')
            return
        }

        try {
            await addCategory({ name }).unwrap()
            setMessage('Category added successfully')
            setName('')
        } catch (error) {
            setMessage('Failed to add category')
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteCategory(id).unwrap();
            setMessage("Category deleted successfully!");
        } catch (error) {
           setMessage("Failed to delete category"); 
        }
    }

  return (
    <div className='max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg'>
      <h2 className='text-3xl font-bold mb-8 text-gray-800 border-b pb-4'>Manage Categories</h2>
      
      <div className='flex flex-col md:flex-row gap-10'>
          {/* Left Side: Form */}
          <div className='w-full md:w-1/3'>
            <div className='bg-gray-50 p-6 rounded-lg border border-gray-100'>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New Category</h3>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label className='block text-sm font-medium text-gray-600 mb-1'>Category Name</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='e.g., Technology'
                        className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
                    />
                </div>

                {message && <p className={`text-sm font-medium ${message.includes('Faile') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}

                <button 
                    type='submit'
                    disabled={isAdding}
                    className='w-full bg-[#1E73BE] hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2'
                >
                    {isAdding ? (
                        <span>Adding...</span>
                    ) : (
                        <>
                            <span>Add Category</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                        </>
                    )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Side: List */}
          <div className='w-full md:w-2/3'>
            <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
                All Categories
                <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border">
                    {categories ? categories.length : 0}
                </span>
            </h3>
            
            {isFetching ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-white border rounded-lg overflow-hidden">
                    {categories && categories.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {categories.map((cat) => (
                                <div key={cat._id} className="flex justify-between items-center p-4 hover:bg-gray-50 transition duration-150">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-800 font-medium text-lg">{cat.name}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(cat._id)}
                                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition duration-200"
                                        title="Delete Category"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500 bg-gray-50">
                            <p className="italic">No categories found. Add your first one!</p>
                        </div>
                    )}
                </div>
            )}
          </div>
      </div>
    </div>
  )
}

export default AddCategory
