import { Edit, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import useFetch from '../lib/useFetch'
import { showToast } from '../lib/showToasts'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AllVehicles = () => {
    const navigate = useNavigate()
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [pagination, setPagination] = useState(null)

    const { data: vehiclesData, loading, error, refetch } = useFetch(`/vehicles?page=${page}&limit=${limit}`)

    useEffect(() => {
        if (error) {
            showToast('error', error)
        }
    }, [error])

    useEffect(() => {
        if (vehiclesData?.pagination) {
            setPagination(vehiclesData.pagination)
        }
    }, [vehiclesData])

    const vehicles = vehiclesData?.vehicles || []

    if (loading) {
        return (
            <div className='flex justify-center items-center h-64'>
                <div className='text-lg'>Loading Vehicles...</div>
            </div>
        )
    }

    const handleDelete = async (id) => {
        const confirm = window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')
        if (!confirm) return;
        
        try {
            const response = await axios.delete(`${BACKEND_URL}/vehicles/${id}`, { withCredentials: true })
            
            if (response.data.success) {
                showToast('success', response.data.message || 'Vehicle deleted successfully.')
                refetch()
            } else {
                showToast('error', response.data.message || 'Failed to delete vehicle.')
            }
        } catch (error) {
            console.error('Delete error:', error)
            showToast('error', error.response?.data?.message || 'Failed to delete vehicle. Please try again.')
        }
    }

    const handlePageChange = (newPage) => {
        setPage(newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className='my-6 px-4'>
            <div className='mb-6 flex justify-between items-center flex-wrap gap-4'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-800'>Vehicles Table</h1>
                    <p className='text-gray-600 mt-1'>Manage and view all your vehicles</p>
                </div>
                {pagination && (
                    <div className='text-sm text-gray-500'>
                        Total: {pagination.total} vehicles
                    </div>
                )}
            </div>

            <div className='block md:hidden space-y-4'>
                {vehicles?.length === 0 ? (
                    <div className='text-center p-8 text-gray-500 bg-white rounded-lg shadow'>
                        No vehicles found
                    </div>
                ) : (
                    vehicles?.map((vehicle) => (
                        <div key={vehicle._id} className='bg-white rounded-lg shadow-md p-4 border border-gray-200'>
                            <div className='flex justify-between items-start mb-3'>
                                <div>
                                    <h3 className='text-lg font-semibold text-gray-900'>{vehicle.name}</h3>
                                    <p className='text-sm text-gray-600'>{vehicle.brand}</p>
                                </div>
                                <div className='flex gap-2'>
                                    <button
                                        type="button"
                                        className='cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                                        title="Edit"
                                        onClick={() => navigate(`/vehicles/edit/${vehicle._id}`)}
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        type="button"
                                        className='cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                                        title="Delete"
                                        onClick={() => handleDelete(vehicle._id)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className='border-t border-gray-100 pt-3'>
                                <div className='flex justify-between items-center'>
                                    <span className='text-sm text-gray-600'>Rent Per Day:</span>
                                    <span className='text-lg font-semibold text-green-600'>₹{vehicle.rentPerDay}</span>
                                </div>
                                <div className='flex justify-between items-center mt-2'>
                                    <span className='text-sm text-gray-600'>Status:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${vehicle.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {vehicle.available ? 'Available' : 'Not Available'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className='hidden md:block bg-white rounded-lg shadow-md overflow-hidden border border-gray-200'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50 border-b border-gray-200'>
                            <tr>
                                <th className='text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider'>Name</th>
                                <th className='text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider'>Brand</th>
                                <th className='text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider'>Rent Per Day</th>
                                <th className='text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider'>Status</th>
                                <th className='text-center p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200'>
                            {vehicles?.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className='text-center p-8 text-gray-500'>No vehicles found</td>
                                </tr>
                            ) : (
                                vehicles?.map((vehicle) => (
                                    <tr key={vehicle._id} className='hover:bg-gray-50 transition-colors'>
                                        <td className='p-4'>
                                            <div className='font-medium text-gray-900'>{vehicle.name}</div>
                                        </td>
                                        <td className='p-4'>
                                            <div className='text-gray-600'>{vehicle.brand}</div>
                                        </td>
                                        <td className='p-4'>
                                            <div className='text-gray-600'>₹{vehicle.rentPerDay}</div>
                                        </td>
                                        <td className='p-4'>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${vehicle.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {vehicle.available ? 'Available' : 'Not Available'}
                                            </span>
                                        </td>
                                        <td className='p-4'>
                                            <div className='flex items-center justify-center gap-2'>
                                                <button
                                                    type="button"
                                                    className='cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                                                    title="Edit"
                                                    onClick={() => navigate(`/vehicles/edit/${vehicle._id}`)}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className='cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                                                    title="Delete"
                                                    onClick={() => handleDelete(vehicle._id)}
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

export default AllVehicles