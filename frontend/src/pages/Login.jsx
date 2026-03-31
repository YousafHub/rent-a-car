import { Card, CardContent } from "../components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form"
import { Input } from "../components/ui/input"
import ButtonLoading from '../components/ButtonLoading'
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { zSchema } from '../lib/zodSchema'
import { useForm } from 'react-hook-form'
import z from "zod";
import axios from "axios";
import { showToast } from "../lib/showToasts";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false);
    const [isTypePassword, setIsTypePassword] = useState(true)

    const formSchema = zSchema.pick({
        email: true,
    }).extend({
        password: z.string().min(3, "Password must be 3 characters or more"),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const handleLoginSubmit = async (values) => {
        try {
            setLoading(true)
            const { data: loginResponse } = await axios.post(`${BACKEND_URL}/auth/login`, values, { withCredentials: true })
            if (!loginResponse.success) {
                throw new Error(loginResponse.message)
            }

            form.reset()
            showToast('success', loginResponse.message)
            localStorage.setItem("user", JSON.stringify(loginResponse.data));
            navigate("/dashboard")
        } catch (error) {
            const errorMessage = error.response?.data?.message|| 'Login failed';
            showToast('error', errorMessage)
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className='h-screen w-screen flex justify-center items-center'>
            <Card className='w-[400px]'>
                <CardContent>
                    <div className='flex justify-center'>
                        <img src='/download-2.png' alt='logo' className='max-w-[150px] ' />
                    </div>
                    <div className='text-center'>
                        <h1 className='text-3xl font-bold'>Login Into Account</h1>
                        <p>Login into your account by filling out the form below.</p>
                    </div>
                    <div className='mt-5'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleLoginSubmit)}>
                                <div className='mb-5'>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type='email' placeholder='example@gmail.com' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className='mb-5'>
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="relative">
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type={isTypePassword ?
                                                        "password" : "text"
                                                    } placeholder='**********' {...field} />
                                                </FormControl>
                                                <button className='cursor-pointer absolute top-1/2 right-2' type='button'
                                                    onClick={() => setIsTypePassword(!isTypePassword)}
                                                >
                                                    {isTypePassword ?
                                                        <FaRegEyeSlash /> : <FaRegEye />}
                                                </button>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className='mb-3'>
                                    <ButtonLoading loading={loading} type='submit' text="Login" className="w-full" />
                                </div>
                                <div className='text-center'>
                                    <div className='flex justify-center items-center gap-1'>
                                        <p>Don't have an account?</p>
                                        <a href="/register" className='text-primary underline'>Create account!</a>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login