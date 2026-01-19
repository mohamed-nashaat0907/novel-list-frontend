import Button from "../../components/ui/Button";
import { useForm, type SubmitHandler } from "react-hook-form";
import Input from "../../components/ui/Input";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import InputErrorMessage from "../../components/ui/InputErrorMessage";
import { signupInputfields } from "../../data/data";
import type { AxiosError } from "axios";
import axiosInstance from "../../axios/axios.config";
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from "../../hooks/UseAuth";
// import { useNavigate } from "react-router-dom";

const passwordRegex = {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    number: /[0-9]/,
    specialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

const schema = z.object({
    name: z.string().nonempty('name is required')
        .min(3, "name should be at least 3").max(32, "name should be less than 32"),
    email: z.email('please include valid email'),
    password: z.string().min(8, 'password should be 8 at least')
        .max(32, "password should be less than 32").refine((val) => passwordRegex.lowercase.test(val), {
            message: 'password must contain at least one lowercase letter'
        }).refine((val) => passwordRegex.uppercase.test(val), {
            message: 'password must contain at least one uppercase letter'
        }).refine((val) => passwordRegex.number.test(val), {
            message: 'password must contain at least one number'
        }).refine((val) => passwordRegex.specialChar.test(val), {
            message: 'password must contain at least one special character'
        }),
    confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters long').max(32, "Confirm Password must be less than 32 characters long"),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ["confirmPassword"]
})
export type Formdata = z.infer<typeof schema>;

function SignUpForm() {
    // const navigate = useNavigate();
    const { isAuthenticated } = useAuth()
    const { register, handleSubmit, formState: { errors } } = useForm<Formdata>({
        resolver: zodResolver(schema)
    })
    const onSubmit: SubmitHandler<Formdata> = async (dataEntry) => {
        // console.log(dataEntry)
        try {
            // const res = await axiosInstance.post('/auth/signup', dataEntry);
            const { status, data } = await axiosInstance.post('/auth/signup', dataEntry);
            if (status === 200) {
                // console.log(res);
                toast.success(data.message || "You will navigate to the login page after 2 seconds to sign in.", {
                    position: "bottom-center",
                    duration: 1500,
                    style: {
                        backgroundColor: "black",
                        color: "white",
                        width: "fit-content",
                    }
                    ,
                });
                // setTimeout(() => {
                //     navigate("/sign-in");
                // }, 2000);
            }
        } catch (error) {
            const errobject = error as AxiosError
            toast.error((errobject.response?.data as { message?: string })?.message || 'Something went wrong', {
                position: "top-center",
                duration: 2000,
                style: {
                    backgroundColor: 'black',
                    color: 'white',
                    width: 'fit-content'
                }
            })
            console.log(errobject)
        }
    }

    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="flex items-center justify-center main-color">
            <div className=" shadow-2xl rounded-2xl p-8 w-md main-color">
                <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
                    Create an Account
                </h2>

                <form className="space-y-4 " onSubmit={handleSubmit(onSubmit)}>
                    {signupInputfields.map(({ id, name, label, type, placeholder }) => {
                        return (
                            <div key={id}>
                                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                                    {label}
                                </label>
                                <Input
                                    {...register(name as keyof Formdata)}
                                    type={type}
                                    name={name}
                                    placeholder={placeholder}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                                {errors[name as keyof Formdata] && <InputErrorMessage msg={errors[name as keyof Formdata]?.message} />}
                            </div>

                        )
                    })}
                    <Button
                        type="submit"
                        classname=" hover:bg-blue-700  transition duration-200"
                    >
                        Sign Up
                    </Button>
                </form>

                <p className="text-sm text-center text-gray-500 mt-4">
                    Already have an account?{" "}
                    <a href="sign-in" className="text-blue-600 hover:underline">
                        sign in
                    </a>
                </p>
            </div>
            <Toaster />
        </div>
    );
};
export default SignUpForm;