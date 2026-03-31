import { Edit, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import useFetch from '../lib/useFetch'
import { showToast } from '../lib/showToasts'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AllCustomers = () => {
    const navigate = useNavigate()
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [pagination, setPagination] = useState(null)

    const { data: customersData, loading, error, refetch } = useFetch(`/customers?page=${page}&limit=${limit}`)

    useEffect(() => {
        if (error) {
            showToast('error', error)
        }
    }, [error])

    useEffect(() => {
        if (customersData?.pagination) {
            setPagination(customersData.pagination)
        }
    }, [customersData])

    const customers = customersData?.customers || []

    if (loading) {
        return (
            <div className='flex justify-center items-center h-64'>
                <div className='text-lg'>Loading customers...</div>
            </div>
        )
    }

    const handleDelete = async (id) => {
        const confirm = window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')
        if (!confirm) return;
        
        try {
            const response = await axios.delete(`${BACKEND_URL}/customers/${id}`, { withCredentials: true })
            
            if (response.data.success) {
                showToast('success', response.data.message || 'Customer deleted successfully.')
                refetch()
            } else {
                showToast('error', response.data.message || 'Failed to delete customer.')
            }
        } catch (error) {
            console.error('Delete error:', error)
            showToast('error', error.response?.data?.message || 'Failed to delete customer. Please try again.')
        }
    }

    const handlePageChange = (newPage) => {
        setPage(newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className='my-6 px-4'>
            {/* Header */}
            <div className='mb-6 flex justify-between items-center flex-wrap gap-4'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-800'>Customers Table</h1>
                    <p className='text-gray-600 mt-1'>Manage and view all your customers</p>
                </div>
                {pagination && (
                    <div className='text-sm text-gray-500'>
                        Total: {pagination.total} customers
                    </div>
                )}
            </div>

            {/* Table Container */}
            <div className='bg-white rounded-lg shadow-md overflow-hidden border border-gray-200'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50 border-b border-gray-200'>
                            <tr>
                                <th className='text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider'>Name</th>
                                <th className='text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider hidden md:table-cell'>Email</th>
                                <th className='text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider hidden sm:table-cell'>Phone</th>
                                <th className='text-center p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200'>
                            {customers?.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className='text-center p-8 text-gray-500'>No customers found</td>
                                </tr>
                            ) : (
                                customers?.map((customer) => (
                                    <tr key={customer._id} className='hover:bg-gray-50 transition-colors'>
                                        <td className='p-4'>
                                            <div className='font-medium text-gray-900'>{customer.name}</div>
                                            <div className='text-sm text-gray-600 md:hidden mt-1'>{customer.email}</div>
                                            <div className='text-sm text-gray-600 sm:hidden mt-0.5'>{customer.phone}</div>
                                        </td>
                                        <td className='p-4 hidden md:table-cell'>
                                            <div className='text-gray-600'>{customer.email}</div>
                                        </td>
                                        <td className='p-4 hidden sm:table-cell'>
                                            <div className='text-gray-600'>{customer.phone}</div>
                                        </td>
                                        <td className='p-4'>
                                            <div className='flex items-center justify-center gap-2'>
                                                <button
                                                    type="button"
                                                    className='cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                                                    title="Edit"
                                                    onClick={() => navigate(`/customers/edit/${customer._id}`)}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className='cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                                                    title="Delete"
                                                    onClick={() => handleDelete(customer._id)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className='flex justify-center items-center gap-2 mt-6'>
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={!pagination.hasPrevPage}
                        className={`cursor-pointer px-4 py-2 rounded-lg border transition-colors ${
                            pagination.hasPrevPage
                                ? 'hover:bg-gray-100 text-gray-700'
                                : 'text-gray-400 cursor-not-allowed bg-gray-50'
                        }`}
                    >
                        Previous
                    </button>
                    
                    <div className='flex gap-1'>
                        {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                            let pageNum;
                            if (pagination.totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (pagination.page <= 3) {
                                pageNum = i + 1;
                            } else if (pagination.page >= pagination.totalPages - 2) {
                                pageNum = pagination.totalPages - 4 + i;
                            } else {
                                pageNum = pagination.page - 2 + i;
                            }
                            
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`cursor-pointer w-10 h-10 rounded-lg border transition-colors ${
                                        pagination.page === pageNum
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>
                    
                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={!pagination.hasNextPage}
                        className={`cursor-pointer px-4 py-2 rounded-lg border transition-colors ${
                            pagination.hasNextPage
                                ? 'hover:bg-gray-100 text-gray-700'
                                : 'text-gray-400 cursor-not-allowed bg-gray-50'
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

export default AllCustomers