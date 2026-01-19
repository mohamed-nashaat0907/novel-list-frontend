import { useForm, type SubmitHandler } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinInputfields } from "../../data/data";
import { Toaster } from "react-hot-toast";
import axiosInstance from "../../axios/axios.config";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/UseAuth";
import { jwtDecode } from "jwt-decode";
// import ErrorHandler from "./ErrorHandler";
// import InputErrorMessage from "../components/ui/InputErrorMessage";

const schema = z.object({
    email: z.string().email(),
    password: z.string(),
});
export type Formsignindata = z.infer<typeof schema>;
function Signin(){
    const location = useLocation();
    const {isAuthenticated}=useAuth()
    const path = location.state?.from || '/';
    // console.log("تم التوجيه من:", path);

    // .............
    const navigate = useNavigate();
    // .............
    const { handleLogin } = useAuth();
    const { register, handleSubmit } = useForm({
        resolver: zodResolver(schema)
    })
    const onSubmit: SubmitHandler<Formsignindata> = async (dataEntry) => {
        try {
            const response = await axiosInstance.post('/auth/login', dataEntry)
            const { data, token } = response.data;
            const { user } = data
            const { exp } = jwtDecode(token) as { exp: number };
                // console.log("تم التوجيه من:", path);


            // try the code after 15 sec
            // const date = Date.now()/1000;
            // const finishinTime = date +15 ;

            //what the time of expiration
            // console.log(new Date(exp * 1000));

            //what the current time
            // console.log(new Date(Date.now())); 

            //token
            // const ex = jwtDecode(token);
            // console.log();

            toast.success('Login successful', {
                position: "top-center",
                duration: 1000,
                style: {
                    backgroundColor: 'black',
                    color: 'white',
                    width: 'fit-content'
                }
            })
            setTimeout(() => {
                handleLogin(user, token, exp);
                navigate(path, { replace: true });
            }, 1500);
            // console.log(iat);

            // console.log(response);
            // console.log(user,token);
            // console.log(typeof(user));


        }
        catch (error) {
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
        return  null;
    }

    return (
        <div className="flex items-center justify-center main-color min-h-screen">
            <div className=" shadow-2xl rounded-2xl p-8 w-md main-color">
                <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
                    login to your account
                </h2>

                <form className="space-y-4 " onSubmit={handleSubmit(onSubmit)}>
                    {signinInputfields.map(({ id, name, label, type, placeholder }) => {
                        return (
                            <div key={id}>
                                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                                    {label}
                                </label>
                                <Input
                                    {...register(name)}
                                    type={type}
                                    name={name}
                                    placeholder={placeholder}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                                {/* {errors[name] && <InputErrorMessage msg={errors[name]?.message} />} */}
                            </div>

                        )
                    })}
                    <Button
                        type="submit"
                        classname=" hover:bg-blue-700  transition duration-200"
                    >
                        Sign in
                    </Button>
                </form>

                <p className="text-sm text-center text-gray-500 mt-4">
                    you dont have account?{" "}
                    <a href="/sign-up" className="text-blue-600 hover:underline">
                        sign up
                    </a>
                </p>
            </div>
            <Toaster />
        </div>
    );
}
export default Signin