import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { zSchema } from '../lib/zodSchema'
import { Card, CardContent, CardHeader } from './ui/card'
import { Input } from './ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import ButtonLoading from './ButtonLoading'
import { showToast } from '../lib/showToasts'

const AddCustomer = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const [loading, setLoading] = useState(false)

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

    const onSubmit = async (values) => {
        setLoading(true)
        try {
            const { data: response } = await axios.post(`${BACKEND_URL}/customers`, values, { withCredentials: true })

            if(!response.success) {
                throw new Error(response.message)
            }

            showToast('success', response.message)
            form.reset()
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
                    <h4 className='text-xl font-semibold'>Add Customer</h4>
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
                                <ButtonLoading loading={loading} type='submit' text="Add Customer" className="w-full" />
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddCustomer