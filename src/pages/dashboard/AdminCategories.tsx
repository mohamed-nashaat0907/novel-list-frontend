import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios/axios.config";
import { useForm, type SubmitHandler } from "react-hook-form";
import Modal from "../../components/ui/BasicModal";
import CustomDialog from "../../components/ui/CustomDialog";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import InputErrorMessage from "../../components/ui/InputErrorMessage";
import { useAuth } from "../../hooks/UseAuth";
import type { Category } from "../../data/interfaces";
import { AxiosError } from "axios";

import toast, { Toaster } from 'react-hot-toast';

interface CategoryFormData {
    name: string;
}

const defaultValues: CategoryFormData = { name: "" };

function AdminCategories() {
    const { token, isAdmin } = useAuth();
    // const queryClient = useQueryClient();

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // --------------------- Fetch Categories ---------------------
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/categories", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data.data as Category[];
        },
    });

    // --------------------- React Hook Form ---------------------
    const { register, handleSubmit, formState: { errors }, reset } =
        useForm<CategoryFormData>({ defaultValues });

    // --------------------- Handlers ---------------------
    const handleOpenAdd = () => {
        setIsEdit(false);
        reset(defaultValues);
        setIsOpenModal(true);
    };

    const handleOpenEdit = (category: Category) => {
        setIsEdit(true);
        setEditId(category._id);
        reset({ name: category.name });
        setIsOpenModal(true);
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
        setIsOpenDeleteModal(true);
    };

    const onSubmit: SubmitHandler<CategoryFormData> = async (data) => {
        if (!isAdmin) return;
        try {
            if (isEdit && editId) {
                await axiosInstance.put(`/categories/${editId}`, data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Category updated successfully"); // ← نجاح التعديل
            } else {
                await axiosInstance.post("/categories", data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Category added successfully"); // ← نجاح الإضافة
            }
            setIsOpenModal(false);
            reset(defaultValues);
            await refetch();
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Something went wrong"); // ← خطأ
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await axiosInstance.delete(`/categories/${deleteId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Category deleted successfully"); // ← نجاح الحذف
            setIsOpenDeleteModal(false);
            await refetch();
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.error(error);
            toast.error(error?.message || "Something went wrong"); // ← خطأ
        }
    };

    if (!isAdmin) return <p>Access Denied</p>;

    return (
        <div className="w-full p-4">
            <h1 className="text-center text-2xl font-bold mb-4">Categories</h1>

            <Button classname="bg-blue-700 mb-4" onClick={handleOpenAdd}>
                Add Category
            </Button>

            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error fetching categories</p>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {data?.map((category) => (
                        <div key={category._id} className="border rounded p-4 flex flex-col gap-2">
                            <h2 className="font-semibold">{category.name}</h2>
                            <div className="flex gap-2 mt-2">
                                <Button classname="bg-yellow-500" onClick={() => handleOpenEdit(category)}>
                                    Edit
                                </Button>
                                <Button classname="bg-red-600" onClick={() => handleDelete(category._id)}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --------------------- Add / Edit Modal --------------------- */}
            <Modal
                isOpen={isOpenModal}
                closeModal={() => setIsOpenModal(false)}
                title={isEdit ? "Edit Category" : "Add Category"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-2">
                    <div className="flex flex-col gap-1">
                        <label>Name</label>
                        <Input type="text" {...register("name", { required: true })} />
                        {errors.name && <InputErrorMessage msg="Category name is required" />}
                    </div>

                    <Button classname="bg-blue-800 text-white" type="submit">
                        {isEdit ? "Save Changes" : "Add Category"}
                    </Button>
                </form>
            </Modal>

            {/* --------------------- Delete Confirmation --------------------- */}
            <CustomDialog
                isOpen={isOpenDeleteModal}
                closeDialog={() => setIsOpenDeleteModal(false)}
                title="Delete Category"
                description="Are you sure you want to delete this category? This action cannot be undone."
            >
                <div className="flex gap-4 mt-2 justify-center">
                    <Button classname="bg-red-600 hover:text-white" onClick={confirmDelete}>
                        Delete
                    </Button>
                    <Button classname="bg-gray-600 hover:bg-gray-700 text-white" onClick={() => setIsOpenDeleteModal(false)}>
                        Cancel
                    </Button>
                </div>
            </CustomDialog>
            <Toaster/>
        </div>
    );
}

export default AdminCategories;
