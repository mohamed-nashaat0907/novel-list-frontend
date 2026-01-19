import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosInstance from "../../axios/axios.config";
import { useAuth } from "../../hooks/UseAuth";
import { type AxiosError } from "axios";
import Button from "../../components/ui/Button";

// Zod Schema
const contactSchema = z.object({
    message: z
        .string()
        .min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل")
        .max(500, "الرسالة يجب ألا تتجاوز 500 حرف"),
});


type ContactFormData = z.infer<typeof contactSchema>;
const Contact = () => {
    const { token, isAdmin } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
        if (isAdmin) return;
        try {

            await axiosInstance.post("/contact", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            reset();
            alert("تم إرسال رسالتك بنجاح ✅");
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            alert(error.response?.data?.message || "حدث خطأ أثناء الإرسال");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 sm:p-10">
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
                    Contact Us
                </h2>

                <p className="text-center text-sm text-slate-500 mb-6">
                    The message will be sent using your account information
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-700">
                            Message
                        </label>

                        <textarea
                            {...register("message")}
                            placeholder="Write your message here..."
                            className={`w-full h-32 rounded-lg border px-4 py-2 resize-none focus:outline-none focus:ring-2 ${errors.message
                                ? "border-red-500 focus:ring-red-500"
                                : "border-slate-300 focus:ring-slate-800"
                                }`}
                        />

                        {errors.message && (
                            <p className="text-red-600 text-xs mt-1">
                                {errors.message.message}
                            </p>
                        )}

                        <p className="text-xs text-slate-500 mt-1">
                            Between 10 and 500 characters
                        </p>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        classname="bg-slate-800 text-white font-semibold hover:bg-slate-900 transition disabled:opacity-60"
                    >
                        {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                </form>
            </div>
        </div>
    );

};

export default Contact;
