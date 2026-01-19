import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Rating from "../../components/ui/Rating";
import { useState } from "react";
import Modal from "../../components/ui/BasicModal";
import CustomDialog from "../../components/ui/CustomDialog";
import toast, { Toaster } from 'react-hot-toast';

import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inputsproductData } from "../../data/data";
import type { IProduct } from "../../data/interfaces";
import { useAuth } from "../../hooks/UseAuth";
import { useCategory } from "../../hooks/UseCategory";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios/axios.config";
import { AxiosError } from "axios";
import InputErrorMessage from "../../components/ui/InputErrorMessage";




// ----------- ADD Schema -----------
const addSchema = z.object({
    title: z.string().nonempty("title is required"),
    author: z.string().nonempty("author name is required"),
    description: z.string().nonempty("description is required"),
    price: z.number().min(0, "price must be positive"),
    quantity: z.number().min(0, "quantity must be positive"),
    category: z.string().nonempty("category is required"),
    imageCover: z
        .instanceof(File, { message: "Image is required" })
        .refine((file) => file.type.startsWith("image/")),
    pdfLink: z
        .instanceof(File, { message: "PDF file is required" })
        .refine((file) => file.type === "application/pdf"),
});


// ----------- EDIT Schema (كل شيء اختياري) -----------
const editSchema = z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    quantity: z.number().optional(),
    category: z.string().optional(),
    imageCover: z
        .instanceof(File)
        .refine((file) => file.type.startsWith("image/"))
        .optional(),
    pdfLink: z
        .instanceof(File)
        .refine((file) => file.type === "application/pdf")
        .optional(),
});


export type ProductFormData = z.infer<typeof addSchema>;

const defaultValues: ProductFormData = {
    title: "",
    author: "",
    description: "",
    price: 1,
    quantity: 1,
    category: "",
    imageCover: undefined as unknown as File,
    pdfLink: undefined as unknown as File,
};


function Books() {
    const { token, isAdmin } = useAuth();
    const categoryList = useCategory();

    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState<string>("");

    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [deletedProductId, setDeletedProductId] = useState<string>();

    function openConfirmationDialog(id: string) {
        setDeletedProductId(id);
        setIsOpenDeleteModal(true);
    }

    const schema = isEdit ? editSchema : addSchema;

    const { data,  refetch } = useQuery({
        queryKey: ["products", token],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/products", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        },
    });

    const { register, handleSubmit, formState: { errors }, setValue, reset } =
        useForm({
            resolver: zodResolver(schema),
            defaultValues,
        });

    const handleOpenAdd = () => {
        setIsEdit(false);
        reset(defaultValues);
        setIsOpen(true);
    };

    const handleOpenEdit = (product: IProduct) => {
        setIsEdit(true);
        setEditId(product._id);

        // ملء القيم العادية فقط
        reset({
            title: product.title,
            author: product.author,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            category: product.category._id,
            imageCover: undefined as unknown as File,
            pdfLink: undefined as unknown as File,
        });

        setIsOpen(true);
    };

    const handleCloseModal = () => {
        reset(defaultValues);
        setIsOpen(false);
    };

    const deleteproduct = async () => {
        if (!deletedProductId || !isAdmin) return;

        try {
            const { data } = await axiosInstance.delete(`/products/${deletedProductId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // console.log(data.message);

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
            setIsOpenDeleteModal(false);
            refetch();
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            console.log(err);

            toast.error(err?.message || 'Operation Fail', {
                position: 'top-center',
                style: { backgroundColor: 'black', color: 'white', width: 'fit-content' }
            });

            // alert(err?.message || "Operation failed");

        }
    }


    // ------------------ SUBMIT ------------------
    const onSubmit: SubmitHandler<any> = async (entryData) => {
        if (!isAdmin) return;
        try {
            setIsLoading(true);

            const formData = new FormData();

            // إرسال الحقول الموجودة فقط
            Object.keys(entryData).forEach((key) => {
                const value = entryData[key];
                if (value !== undefined && value !== "") {
                    formData.append(key, value);
                }
            });

            if (!isEdit) {
                // -------- ADD --------
                await axiosInstance.post("/products", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                    timeout: 60000,
                });
                alert("Book added successfully");

            } else {
                // -------- EDIT --------
                await axiosInstance.put(`/products/${editId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                    timeout: 60000,


                });
                alert("Book updated successfully");
            }

            refetch();
            handleCloseModal();

        } catch (error) {
            const err = error as AxiosError<{ errors: { msg: string }[] }>;
            alert(err.response?.data?.errors?.[0]?.msg || "Operation failed");

        } finally {
            setIsLoading(false);
        }
    };


    const products: IProduct[] = data?.data ?? [];


    // if (isLoading) return <IsLoading message="جاري تحميل التعليقات..." />;
    // if (error) {
    //     const err = error as AxiosError<{ message: string }>;
    //     return <ErrorHandler statusCode={err.status || 500} title={err.message || "خطأ غير متوقع"} />;
    // }


    return (
        <div className="w-full">
            <h1 className="text-center">Books</h1>

            <Button classname="bg-blue-700" onClick={handleOpenAdd}>
                Add new Book
            </Button>

            <div className="grid grid-cols-3 gap-1 mt-4">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product._id} className="flex flex-col gap-3 border p-2 rounded">
                            <img src={product.imageCover} alt="" className="rounded" />

                            <h2 className="text-center capitalize">{product.title}</h2>
                            <h3 className="text-center capitalize">{product.category.name}</h3>

                            <p>{product.description}</p>

                            <div className="flex justify-between">
                                <p>Price</p>
                                <p>{product.price}</p>
                            </div>

                            <div className="flex flex-col items-center">
                                {product.ratingAverage ? (
                                    <Rating value={product.ratingAverage} />
                                ) : (
                                    <p>No rating yet</p>
                                )}
                            </div>

                            <p>Quantity: {product.quantity}</p>

                            <Button
                                classname="bg-blue-700"
                                onClick={() => handleOpenEdit(product)}
                            >
                                Edit
                            </Button>
                            <Button
                                classname="bg-red-700"
                                onClick={() => openConfirmationDialog(product._id)}
                            >
                                delete
                            </Button>
                        </div>
                    ))
                ) : (
                    <p>No products</p>
                )}
            </div>


            {/* ------------ Add / Edit Modal ------------- */}
            <Modal isOpen={isOpen} closeModal={handleCloseModal} title={isEdit ? "Edit Book" : "Add Book"}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-2">

                    {inputsproductData.map(({ id, label, name, type, placeholder, registerOptions }) => {
                        const isCategory = name === "category";
                        const isFile = type === "file";

                        if (isFile) {
                            return (
                                <div key={id} className="flex flex-col gap-1">
                                    <label>{label}</label>
                                    <input
                                        type="file"
                                        accept={name === "imageCover" ? "image/*" : "application/pdf"}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setValue(name, file, { shouldValidate: true });
                                            }
                                        }}
                                        className="border p-2 rounded"
                                    />
                                    {errors[name] && (
                                        <InputErrorMessage msg={errors[name]?.message} />
                                    )}
                                </div>
                            );
                        }

                        if (isCategory) {
                            return (
                                <div key={id} className="flex flex-col gap-1">
                                    <label>Category</label>
                                    <select {...register("category")} className="border p-2 rounded">
                                        <option value="">Choose category</option>
                                        {categoryList.map((c) => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <InputErrorMessage msg={errors.category.message} />
                                    )}
                                </div>
                            );
                        }

                        return (
                            <div key={id} className="flex flex-col gap-1">
                                <label>{label}</label>
                                <Input
                                    type={type}
                                    placeholder={placeholder}
                                    {...register(name, registerOptions)}
                                />
                                {errors[name] && (
                                    <InputErrorMessage msg={errors[name]?.message} />
                                )}
                            </div>
                        );
                    })}

                    <Button classname="bg-blue-800 text-white" type="submit" disabled={isLoading}>
                        {isLoading ? "Processing..." : isEdit ? "Save Changes" : "Add Book"}
                    </Button>
                </form>
            </Modal>
            {/* delete modal  */}
            <CustomDialog
                isOpen={isOpenDeleteModal}
                closeDialog={() => setIsOpenDeleteModal(false)}
                title="delete the product"
                description="This will reactivate the user account"
            >
                <p className="text-center">Are you sure you want to delete this product? All of your data will be restored.</p>
                <div className="flex gap-4 mt-2">
                    <Button classname="bg-red-600 hover:text-white" onClick={deleteproduct}>delete</Button>
                    <Button classname="bg-gray-600 hover:bg-gray-700 text-white" onClick={() => setIsOpenDeleteModal(false)}>Cancel</Button>
                </div>
            </CustomDialog>
            <Toaster />
        </div>
    );
}

export default Books;



