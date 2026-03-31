import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Car, Users, Calendar, DollarSign, TrendingUp, CheckCircle } from 'lucide-react'
import useFetch from '../lib/useFetch'
import { useEffect } from 'react'
import { showToast } from '../lib/showToasts'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const DashboardComponent = () => {
    const { data: stats, loading, error } = useFetch('/dashboard')

    useEffect(() => {
        if (error) {
            showToast('error', error)
        }
    }, [error])

    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <div className='text-xl'>Loading dashboard...</div>
            </div>
        )
    }

    // calculating percentage
    const availabilityPercentage = stats.totalVehicles 
        ? Math.round((stats.availableVehicles / stats.totalVehicles) * 100) 
        : 0

    // data for charts
    const vehicleData = [
        { name: 'Available', value: stats.availableVehicles, color: '#10b981' },
        { name: 'Rented', value: stats.totalVehicles - stats.availableVehicles, color: '#ef4444' }
    ]

    const overviewData = [
        { name: 'Vehicles', count: stats.totalVehicles },
        { name: 'Customers', count: stats.totalCustomers },
        { name: 'Bookings', count: stats.totalBookings }
    ]

    const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b']

    return (
        <div className='p-4 md:p-6 bg-gray-50 min-h-screen'>
            <div className='mb-8'>
                <h1 className='text-3xl md:text-4xl font-bold text-gray-800'>Dashboard</h1>
                <p className='text-gray-600 mt-1'>Welcome back! Here's what's happening with your rental business.</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8'>
                <Card className='bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow'>
                    <CardHeader className='flex flex-row items-center justify-between'>
                        <CardTitle className='text-sm font-medium text-green-50'>
                            Total Revenue
                        </CardTitle>
                        <DollarSign className='h-5 w-5 text-green-100' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-3xl font-bold'>Rs {stats.totalRevenue?.toLocaleString('en-PK')}</div>
                        <p className='text-xs text-green-100 mt-2 flex items-center gap-1'>
                            <TrendingUp className='h-3 w-3' />
                            Total earnings
                        </p>
                    </CardContent>
                </Card>

                <Card className='bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow'>
                    <CardHeader className='flex flex-row items-center justify-between'>
                        <CardTitle className='text-sm font-medium text-blue-50'>
                            Total Vehicles
                        </CardTitle>
                        <Car className='h-5 w-5 text-blue-100' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-3xl font-bold'>{stats.totalVehicles}</div>
                        <p className='text-xs text-blue-100 mt-2 flex items-center gap-1'>
                            <CheckCircle className='h-3 w-3' />
                            {stats.availableVehicles} available
                        </p>
                    </CardContent>
                </Card>

                <Card className='bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow'>
                    <CardHeader className='flex flex-row items-center justify-between'>
                        <CardTitle className='text-sm font-medium text-purple-50'>
                            Total Customers
                        </CardTitle>
                        <Users className='h-5 w-5 text-purple-100' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-3xl font-bold'>{stats.totalCustomers}</div>
                        <p className='text-xs text-purple-100 mt-2'>
                            Registered users
                        </p>
                    </CardContent>
                </Card>

                <Card className='bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow'>
                    <CardHeader className='flex flex-row items-center justify-between'>
                        <CardTitle className='text-sm font-medium text-orange-50'>
                            Total Bookings
                        </CardTitle>
                        <Calendar className='h-5 w-5 text-orange-100' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-3xl font-bold'>{stats.totalBookings}</div>
                        <p className='text-xs text-orange-100 mt-2'>
                            All-time bookings
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
                <Card className='shadow-lg'>
                    <CardHeader>
                        <CardTitle className='text-lg font-semibold text-gray-800'>Business Overview</CardTitle>
                        <p className='text-sm text-gray-600'>Summary of vehicles, customers, and bookings</p>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={overviewData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#fff', 
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                                    {overviewData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className='shadow-lg'>
                    <CardHeader>
                        <CardTitle className='text-lg font-semibold text-gray-800'>Vehicle Availability</CardTitle>
                        <p className='text-sm text-gray-600'>{availabilityPercentage}% of vehicles are available</p>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={vehicleData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {vehicleData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {/* Utilization Rate */}
                <Card className='shadow-lg border-l-4 border-l-blue-500'>
                    <CardHeader>
                        <CardTitle className='text-sm font-medium text-gray-600'>Fleet Utilization</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-gray-800'>
                            {100 - availabilityPercentage}%
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-2 mt-3'>
                            <div 
                                className='bg-blue-500 h-2 rounded-full transition-all duration-500' 
                                style={{ width: `${100 - availabilityPercentage}%` }}
                            />
                        </div>
                        <p className='text-xs text-gray-500 mt-2'>Vehicles currently rented</p>
                    </CardContent>
                </Card>

                <Card className='shadow-lg border-l-4 border-l-green-500'>
                    <CardHeader>
                        <CardTitle className='text-sm font-medium text-gray-600'>Avg. Revenue/Booking</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-gray-800'>
                            Rs {stats.totalBookings > 0 
                                ? Math.round(stats.totalRevenue / stats.totalBookings).toLocaleString('en-PK')
                                : 0
                            }
                        </div>
                        <p className='text-xs text-gray-500 mt-2'>Per booking revenue</p>
                    </CardContent>
                </Card>

                <Card className='shadow-lg border-l-4 border-l-purple-500'>
                    <CardHeader>
                        <CardTitle className='text-sm font-medium text-gray-600'>Customer/Vehicle Ratio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-gray-800'>
                            {stats.totalVehicles > 0 
                                ? (stats.totalCustomers / stats.totalVehicles).toFixed(1)
                                : 0
                            }:1
                        </div>
                        <p className='text-xs text-gray-500 mt-2'>Customers per vehicle</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default DashboardComponent