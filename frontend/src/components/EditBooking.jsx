import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form'
import ButtonLoading from '../components/ButtonLoading'
import { showToast } from '../lib/showToasts'
import { axiosInstance } from '../lib/useFetch'
import { Search, X, ArrowLeft } from 'lucide-react'
import { zSchema } from '../lib/zodSchema'

const bookingSchema = z.object({
    customerId: z.string().min(1, "Please select a customer"),
    vehicleId: z.string().min(1, "Please select a vehicle"),
    startDate: z.string().min(1, "Please select start date"),
    endDate: z.string().min(1, "Please select end date"),
})

const EditBooking = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    const [customerSearch, setCustomerSearch] = useState('')
    const [customers, setCustomers] = useState([])
    const [customerLoading, setCustomerLoading] = useState(false)
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
    const [vehicleSearch, setVehicleSearch] = useState('')
    const [vehicles, setVehicles] = useState([])
    const [vehicleLoading, setVehicleLoading] = useState(false)
    const [showVehicleDropdown, setShowVehicleDropdown] = useState(false)

    const customerRef = useRef(null)
    const vehicleRef = useRef(null)

    const bookingSchema = zSchema.pick({
        customerId: true,
        vehicleId: true,
        startDate: true,
        endDate: true
    }).refine((data) => {
        if (data.startDate && data.endDate) {
            return new Date(data.startDate) < new Date(data.endDate)
        }
        return true
    }, {
        message: "End date must be after start date",
        path: ["endDate"]
    })

    const form = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            customerId: "",
            vehicleId: "",
            startDate: "",
            endDate: "",
        },
    })

    const getTodayDate = () => {
        const today = new Date()
        return today.toISOString().split('T')[0]
    }

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await axiosInstance.get(`/bookings/${id}`)
                if (response.data.success) {
                    const booking = response.data.data

                    form.setValue('customerId', booking.customerId._id)
                    form.setValue('vehicleId', booking.vehicleId._id)
                    form.setValue('startDate', booking.startDate.split('T')[0])
                    form.setValue('endDate', booking.endDate.split('T')[0])

                    setCustomerSearch(`${booking.customerId.name} - ${booking.customerId.email}`)
                    setVehicleSearch(`${booking.vehicleId.name} - ${booking.vehicleId.brand} (₹${booking.vehicleId.rentPerDay}/day)`)
                }
            } catch (error) {
                console.error('Error fetching booking:', error)
                showToast('error', 'Failed to fetch booking details')
                navigate('/bookings')
            } finally {
                setFetching(false)
            }
        }

        fetchBooking()
    }, [id, form, navigate])

    const searchCustomers = async (searchTerm) => {
        if (!searchTerm.trim()) {
            setCustomers([])
            return
        }

        setCustomerLoading(true)
        try {
            const response = await axiosInstance.get(`/customers/search?q=${encodeURIComponent(searchTerm)}`)
            if (response.data.success) {
                setCustomers(response.data.data)
                setShowCustomerDropdown(true)
            }
        } catch (error) {
            console.error('Error searching customers:', error)
            setCustomers([])
        } finally {
            setCustomerLoading(false)
        }
    }

    const searchVehicles = async (searchTerm) => {
        if (!searchTerm.trim()) {
            setVehicles([])
            return
        }

        setVehicleLoading(true)
        try {
            const response = await axiosInstance.get(`/vehicles/search?q=${encodeURIComponent(searchTerm)}`)
            if (response.data.success) {
                setVehicles(response.data.data)
                setShowVehicleDropdown(true)
            }
        } catch (error) {
            console.error('Error searching vehicles:', error)
            setVehicles([])
        } finally {
            setVehicleLoading(false)
        }
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (customerSearch.trim() && !form.getValues('customerId')) {
                searchCustomers(customerSearch)
            } else if (!customerSearch.trim()) {
                setCustomers([])
                setShowCustomerDropdown(false)
            }
        }, 500)

        return () => clearTimeout(delayDebounce)
    }, [customerSearch])

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (vehicleSearch.trim() && !form.getValues('vehicleId')) {
                searchVehicles(vehicleSearch)
            } else if (!vehicleSearch.trim()) {
                setVehicles([])
                setShowVehicleDropdown(false)
            }
        }, 500)

        return () => clearTimeout(delayDebounce)
    }, [vehicleSearch])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (customerRef.current && !customerRef.current.contains(event.target)) {
                setShowCustomerDropdown(false)
            }
            if (vehicleRef.current && !vehicleRef.current.contains(event.target)) {
                setShowVehicleDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectCustomer = (customer) => {
        setCustomerSearch(`${customer.name} - ${customer.email}`)
        form.setValue('customerId', customer._id)
        setShowCustomerDropdown(false)
        form.trigger('customerId')
    }

    const selectVehicle = (vehicle) => {
        setVehicleSearch(`${vehicle.name} - ${vehicle.brand} (₹${vehicle.rentPerDay}/day)`)
        form.setValue('vehicleId', vehicle._id)
        setShowVehicleDropdown(false)
        form.trigger('vehicleId')
    }

    const clearCustomer = () => {
        setCustomerSearch('')
        form.setValue('customerId', '')
        setCustomers([])
        setShowCustomerDropdown(false)
        form.trigger('customerId')
    }

    const clearVehicle = () => {
        setVehicleSearch('')
        form.setValue('vehicleId', '')
        setVehicles([])
        setShowVehicleDropdown(false)
        form.trigger('vehicleId')
    }

    const onSubmit = async (values) => {
        setLoading(true)
        try {
            const response = await axios.put(`${BACKEND_URL}/bookings/${id}`, values, { withCredentials: true })

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            showToast('success', response.data.message || 'Booking updated successfully')
        } catch (error) {
            showToast('error', error.response?.data?.message || error.message || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className='flex justify-center items-center h-64'>
                <div className='text-lg'>Loading booking details...</div>
            </div>
        )
    }

    return (
        <div className='px-4'>
            <Card className='py-0 rounded shadow-sm'>
                <CardHeader className='pt-3 px-3 border-b pb-2'>
                    <div className='flex items-center gap-3'>
                        <button
                            type="button"
                            onClick={() => navigate('/bookings')}
                            className='p-1 hover:bg-gray-100 rounded-lg transition-colors'
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h4 className='text-xl font-semibold'>Edit Booking</h4>
                    </div>
                </CardHeader>
                <CardContent className="pb-5 pt-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='flex flex-wrap -mx-2'>
                                <div className='w-full md:w-1/2 px-2 mb-5' ref={customerRef}>
                                    <FormLabel>Select Customer</FormLabel>
                                    <div className='relative'>
                                        <div className='relative'>
                                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                                            <Input
                                                type='text'
                                                placeholder='Search by name, email or phone...'
                                                value={customerSearch}
                                                onChange={(e) => setCustomerSearch(e.target.value)}
                                                onFocus={() => customerSearch && customers.length > 0 && setShowCustomerDropdown(true)}
                                                className='pl-9 pr-8'
                                            />
                                            {customerSearch && (
                                                <button
                                                    type="button"
                                                    onClick={clearCustomer}
                                                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                                                >
                                                    <X className='h-4 w-4' />
                                                </button>
                                            )}
                                        </div>

                                        {showCustomerDropdown && (customers.length > 0 || customerLoading) && (
                                            <div className='absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                                                {customerLoading ? (
                                                    <div className='p-3 text-center text-gray-500'>Searching...</div>
                                                ) : customers.length > 0 ? (
                                                    customers.map((customer) => (
                                                        <div
                                                            key={customer._id}
                                                            className='p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0'
                                                            onClick={() => selectCustomer(customer)}
                                                        >
                                                            <div className='font-medium'>{customer.name}</div>
                                                            <div className='text-sm text-gray-600'>{customer.email}</div>
                                                            <div className='text-sm text-gray-500'>{customer.phone}</div>
                                                        </div>
                                                    ))
                                                ) : customerSearch && (
                                                    <div className='p-3 text-center text-gray-500'>No customers found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="customerId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <input type="hidden" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='w-full md:w-1/2 px-2 mb-5' ref={vehicleRef}>
                                    <FormLabel>Select Vehicle</FormLabel>
                                    <div className='relative'>
                                        <div className='relative'>
                                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                                            <Input
                                                type='text'
                                                placeholder='Search by name or brand...'
                                                value={vehicleSearch}
                                                onChange={(e) => setVehicleSearch(e.target.value)}
                                                onFocus={() => vehicleSearch && vehicles.length > 0 && setShowVehicleDropdown(true)}
                                                className='pl-9 pr-8'
                                            />
                                            {vehicleSearch && (
                                                <button
                                                    type="button"
                                                    onClick={clearVehicle}
                                                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                                                >
                                                    <X className='h-4 w-4' />
                                                </button>
                                            )}
                                        </div>

                                        {showVehicleDropdown && (vehicles.length > 0 || vehicleLoading) && (
                                            <div className='absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                                                {vehicleLoading ? (
                                                    <div className='p-3 text-center text-gray-500'>Searching...</div>
                                                ) : vehicles.length > 0 ? (
                                                    vehicles.map((vehicle) => (
                                                        <div
                                                            key={vehicle._id}
                                                            className='p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0'
                                                            onClick={() => selectVehicle(vehicle)}
                                                        >
                                                            <div className='font-medium'>{vehicle.name}</div>
                                                            <div className='text-sm text-gray-600'>{vehicle.brand}</div>
                                                            <div className='text-sm text-green-600 font-medium'>₹{vehicle.rentPerDay}/day</div>
                                                        </div>
                                                    ))
                                                ) : vehicleSearch && (
                                                    <div className='p-3 text-center text-gray-500'>No vehicles found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="vehicleId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <input type="hidden" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className='flex flex-wrap -mx-2'>
                                <div className='w-full md:w-1/2 px-2 mb-5'>
                                    <FormField
                                        control={form.control}
                                        name="startDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Start Date</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='date'
                                                        min={getTodayDate()}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='w-full md:w-1/2 px-2 mb-5'>
                                    <FormField
                                        control={form.control}
                                        name="endDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>End Date</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='date'
                                                        min={form.watch('startDate') || getTodayDate()}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className='flex gap-3 mb-3 px-2'>
                                <ButtonLoading loading={loading} type='submit' text="Update Booking" className="flex-1" />
                                
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default EditBooking