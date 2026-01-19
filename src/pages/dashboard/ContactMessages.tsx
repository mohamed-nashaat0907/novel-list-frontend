import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios/axios.config";
import { useAuth } from "../../hooks/UseAuth";
import IsLoading from "../loading/IsLoading";
import type { AxiosError } from "axios";
import ErrorHandler from "../errors/ErrorHandler";
import { type ContactMessage } from "../../data/interfaces";

const ContactMessages = () => {
    const { token, isAdmin } = useAuth();

    const fetchMessages = async () => {
        const {data} = await axiosInstance.get("/contact", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data ?.data;
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ["contactMessages", token],
        queryFn: fetchMessages,
        enabled: !!token && !!isAdmin,
    });

    const messages = data as ContactMessage[] | undefined;
    console.log(messages);
    
    if (isLoading)
        return <IsLoading message="page is loading" />;
    if (error) {
        const err = error as AxiosError<{ message: string }>;
        return <ErrorHandler statusCode={err.status || 500} title={err.message || "خطأ غير متوقع"} />;
    }

    return (
        <div className="p-6 bg-slate-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Contact Messages
            </h2>

            {!messages || messages.length === 0 ? (
                <p className="text-slate-600">No messages found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                        <thead className="bg-slate-800 text-white">
                            <tr>
                                <th className="px-4 py-2 text-left">#</th>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">Message</th>
                                <th className="px-4 py-2 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map((msg, index) => (
                                <tr
                                    key={msg._id}
                                    className={index % 2 === 0 ? "bg-slate-50" : "bg-white"}
                                >
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{msg.name}</td>
                                    <td className="px-4 py-2">{msg.email}</td>
                                    <td className="px-4 py-2">{msg.message}</td>
                                    <td className="px-4 py-2">
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ContactMessages;
