import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../axios/axios.config';
import { useAuth } from '../../hooks/UseAuth';
import { useState } from 'react';
import type { AxiosError } from 'axios';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import InputErrorMessage from '../../components/ui/InputErrorMessage';
import toast, { Toaster } from 'react-hot-toast';

const passwordRegex = {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    number: /[0-9]/,
    specialChar: /[!@#$%^&*(),.?":{}|<>]/,
};
const schema = z.object({
    currentPassword: z.string().nonempty('please include your password'),
    newPassword: z.string().min(8, 'password should be more than 8 ').max(20, "password should be20 maximum")
        .refine((val) => passwordRegex.lowercase.test(val), {
            message: 'password should contain lowercase characters'
        }).refine((val) => passwordRegex.uppercase.test(val), {
            message: 'password should contain uppercase characters'
        }).refine((val) => passwordRegex.number.test(val), {
            message: 'password should contain number characters'
        }).refine((val) => passwordRegex.specialChar.test(val), {
            message: 'password should contain special characters'
        }),
    confirmPassword: z.string()
}).refine((val) => val.newPassword === val.confirmPassword, {
    message: 'Passwords do not match',
    path: ["confirmPassword"]
})
export type Formdata = z.infer<typeof schema>;
//...................................................

// ............................................................
function Profile() {
    const { token, isAuthenticated, handleLogout, user } = useAuth();
    const [newName, setNewName] = useState('');
    const [namestate, setNameState] = useState<boolean>(false)
    const [passwordstate, setPasswordState] = useState<boolean>(false)

    const fetchUser = async () => {
        const { data } = await axiosInstance.get('/users/me/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    };

    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ['fetchuserme', token],
        queryFn: fetchUser,
        enabled: !!token && isAuthenticated,
    });

    const { register, handleSubmit, formState: { errors } } = useForm<Formdata>({
        resolver: zodResolver(schema)
    })
    const onSubmit: SubmitHandler<Formdata> = async (dataEntry) => {
        // console.log(dataEntry);
        try {
            // const res = await axiosInstance.post('/auth/signup', dataEntry);
            const { status, data } = await axiosInstance.patch(`/users/changePassword/${user?._id}`,
                dataEntry,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            if (status === 200) {
                // console.log(data);
                toast.success(data.message || "password changed sucsessfully.", {
                    position: "bottom-center",
                    duration: 1500,
                    style: {
                        backgroundColor: "black",
                        color: "white",
                        width: "fit-content",
                    }
                    ,
                });
                setPasswordState(false)
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
    // console.log(errors);

    // .......................
    const handleChangeName = async () => {
        if (!newName.trim()) {
            toast.error('الاسم لا يمكن أن يكون فارغاً', {
                position: 'top-center',
                style: { backgroundColor: 'black', color: 'white', width: 'fit-content' }
            });
            return;
        }
        if (newName.trim().length < 6) {
            toast.error("الاسم يجب أن يكون 6 أحرف على الأقل");
            return;
        }

        try {
            const { data } = await axiosInstance.patch(
                `/users/${user?._id}`,
                { name: newName },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(data.message || 'تم تغيير الاسم بنجاح', {
                position: 'bottom-center',
                style: { backgroundColor: 'black', color: 'white', width: 'fit-content' }
            });
            refetch()
            setNameState(false)
            setNewName('');
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            toast.error(axiosError?.response?.data?.message || 'حدث خطأ ما', {
                position: 'top-center',
                style: { backgroundColor: 'black', color: 'white', width: 'fit-content' }
            });
        }
    };

    // ..........................................

    // ...................
    if (isLoading) {
        return <h1 className="text-xl font-semibold text-blue-600 animate-pulse">
            user data is loading...
        </h1>;
    }

    if (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage = `❌ ${axiosError.response?.data.message || "there is error"}`;
        return <h1 className="text-xl font-semibold text-red-600">{errorMessage}</h1>;
    }

    if (data) {
        const { user } = data.data;
        const { name, email, role } = user;

        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-10  py-10">

                {/* Profile Card */}
                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
                    <div className="flex justify-center mb-4">
                        <img
                            src={"https://images.unsplash.com/photo-1511367461989-f85a21fda167"}
                            alt="User Avatar"
                            className="w-24 h-24 rounded-full border-2 border-gray-200"
                        />
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800 mb-1">{name}</h2>
                    <p className="text-gray-600 mb-4">{email || "لا يوجد بريد"}</p>

                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mb-4">
                        {role}
                    </span>


                </div>

                {/* Settings Card – UI ONLY */}
                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md ">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 text-center capitalize">settings</h2>

                    {/* Change Name */}
                    <div className="mb-5">
                        {!namestate ? (
                            <div>
                                <label className="font-bold block mb-1">Name</label>
                                <div className="flex justify-between items-center bg-gray-200 p-2 rounded">
                                    <p>{user.name}</p>
                                    <button
                                        className="text-center capitalize cursor-pointer border px-2 py-1 rounded bg-white hover:bg-gray-100"
                                        onClick={() => setNameState(true)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    placeholder="Enter new name"
                                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                                <Button
                                    classname="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-all"
                                    onClick={handleChangeName}
                                >
                                    Change Name
                                </Button>
                                <Button
                                    classname="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-all"
                                    onClick={() => setNameState(false)}
                                >
                                    cancel
                                </Button>
                            </div>
                        )}


                    </div>

                    {/* Change Password */}
                    <div>
                        {!passwordstate ? (
                            <div>
                                <label className="font-bold block mb-1 capitalize">password</label>
                                <div className="flex justify-between items-center bg-gray-200 p-2 rounded">
                                    <p>************</p>
                                    <button
                                        className="text-center capitalize cursor-pointer border px-2 py-1 rounded bg-white hover:bg-gray-100"
                                        onClick={() => setPasswordState(true)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        )
                            : (
                                <form className="mb-5" onSubmit={handleSubmit(onSubmit)}>
                                    <label className="block text-gray-700 font-medium mb-2 text-center capitalize">change your password</label>
                                    <Input
                                        type="password"
                                        placeholder="كلمة المرور الحالية"
                                        className="w-full border border-gray-300 px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring focus:ring-blue-200"
                                        {...register("currentPassword")}
                                    />
                                    {errors.currentPassword && <InputErrorMessage msg={errors.currentPassword?.message} />}

                                    <Input
                                        type="password"
                                        placeholder="كلمة المرور الجديدة"
                                        className="w-full border border-gray-300 px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring focus:ring-blue-200"
                                        {...register("newPassword")}
                                    />
                                    {errors.newPassword && <InputErrorMessage msg={errors.newPassword?.message} />}

                                    <Input
                                        type="password"
                                        placeholder="تأكيد كلمة المرور"
                                        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                        {...register("confirmPassword")}
                                    />
                                    {errors.confirmPassword && <InputErrorMessage msg={errors.confirmPassword?.message} />}

                                    <Button type='submit' classname="w-full mt-3 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-all">
                                        change password
                                    </Button>
                                    <Button
                                        classname="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-all"
                                        onClick={() => setPasswordState(false)}
                                    >
                                        cancel
                                    </Button>
                                </form>
                            )}
                        <div className='my-5'>
                            <label className="block text-gray-700 font-bold mb-2 capitalize">logout</label>
                            <Button
                                onClick={handleLogout}
                                classname="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md transition-all"
                            >
                                logout
                            </Button>
                        </div>

                    </div>

                </div>
                <Toaster />
            </div>
        );
    }
}

export default Profile;
