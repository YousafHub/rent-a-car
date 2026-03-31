import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { zSchema } from '../lib/zodSchema'
import { Card, CardContent, CardHeader } from './ui/card'
import { Input } from './ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import ButtonLoading from './ButtonLoading'
import { showToast } from '../lib/showToasts'
import { useParams } from 'react-router-dom'
import useFetch from '../lib/useFetch'

const EditVehicle = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const [loading, setLoading] = useState(false)
    const { id } = useParams()

    const { data: vehicle, error } = useFetch(`/vehicles/${id}`)

    useEffect(() => {
        if (error) {
            showToast('error', error)
        }
    }, [error])

    const formSchema = zSchema.pick({
        name: true,
        brand: true,
        rentPerDay: true
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            brand: "",
            rentPerDay: "",
        },
    })

    useEffect(() => {
        if (vehicle) {
            form.reset({
                name: vehicle?.name,
                brand: vehicle?.brand,
                rentPerDay: vehicle?.rentPerDay
            })
        }
    }, [vehicle])

    const onSubmit = async (values) => {
        setLoading(true)
        try {
            const { data: response } = await axios.put(`${BACKEND_URL}/vehicles/${id}`, values, { withCredentials: true })

            if (!response.success) {
                throw new Error(response.message)
            }

            showToast('success', response.message)
        } catch (error) {
            showToast('error', error.message || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }


    return (
        <div>
            <Card className='py-0 rounded shadow-sm'>
                <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
                    <h4 className='text-xl font-semibold'>Edit Vehicle</h4>
                </CardHeader>
                <CardContent className="pb-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='mb-5'>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder='Enter vehicle name' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-5'>
                                <FormField
                                    control={form.control}
                                    name="brand"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Brand</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder='Enter vehicle brand' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-5'>
                                <FormField
                                    control={form.control}
                                    name="rentPerDay"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Rent Per Day</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder='Enter rent per day' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-3'>
                                <ButtonLoading loading={loading} type='submit' text="Update Vehicle" className="w-full" />
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default EditVehicle