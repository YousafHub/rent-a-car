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

const EditCustomer = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const [loading, setLoading] = useState(false)
    const { id } = useParams()

       const { data: customer, error } = useFetch(`/customers/${id}`)

    useEffect(() => {
        if (error) {
            showToast('error', error)
        }
    }, [error])

    const formSchema = zSchema.pick({
        name: true,
        email: true,
        phone: true
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    })

     useEffect(() => {
        if (customer) {
            form.reset({
                name: customer?.name,
                email: customer?.email,
                phone: customer?.phone
            })
        }
    }, [customer])

    const onSubmit = async (values) => {
        setLoading(true)
        try {
            const { data: response } = await axios.put(`${BACKEND_URL}/customers/${id}`, values, { withCredentials: true })

            if(!response.success) {
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
                    <h4 className='text-xl font-semibold'>Edit Customer</h4>
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
                                                <Input type='text' placeholder='Enter customer name' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-5'>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder='Enter customer email address' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-5'>
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone No.</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder='Enter customer phone number' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-3'>
                                <ButtonLoading loading={loading} type='submit' text="Update Customer" className="w-full" />
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default EditCustomer