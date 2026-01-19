import { useState } from "react";
import axiosInstance from "../../axios/axios.config";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../hooks/UseAuth";

import IsLoading from "../loading/IsLoading";
import ErrorHandler from "../errors/ErrorHandler";
import { type Comment } from "../../data/interfaces";

import Rating from "../../components/ui/Rating";
import Button from "../../components/ui/Button";

import toast, { Toaster } from "react-hot-toast";

const CommentsPage = () => {
  const { token, isAdmin, isAuthenticated } = useAuth();
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const getAllComments = async () => {
    if (!isAdmin || !isAuthenticated) return;

    const { data } = await axiosInstance.get("/comments/admin/comments", {
      headers: { Authorization: `Bearer ${token}` },
      params: { status: status || undefined, page, limit },
    });

    return data;
  };

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["admin-comments", status, page],
    queryFn: getAllComments,
    enabled: !!isAdmin && !!isAuthenticated && !!token,
  });

  const comments: Comment[] = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, totalPages: 1, total: 0 };

  const setCommentStatus = async (action: string, id: string) => {
    try {
      const { data } = await axiosInstance.patch(
        `/comments/admin/comments/${id}`,
        { status: action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(data?.message || "تم تحديث حالة التعليق");
      refetch();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error?.response?.data?.message || "فشل تحديث الحالة");
    }
  };

  const deleteComment = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف التعليق؟")) return;
    try {
      await axiosInstance.delete(`/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("تم حذف التعليق بنجاح");
      refetch();
    } catch (err) {
      toast.error("فشل حذف التعليق");
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (isLoading) return <IsLoading message="جاري تحميل التعليقات..." />;
  if (error) {
    const err = error as AxiosError<{ message: string }>;
    return <ErrorHandler statusCode={err.status || 500} title={err.message || "خطأ غير متوقع"} />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-5 mb-6 flex flex-col md:flex-row justify-between gap-4 items-center">
        <h1 className="text-2xl font-bold text-gray-800">إدارة التعليقات</h1>
        <select
          value={status}
          onChange={(e) => { setPage(1); setStatus(e.target.value); }}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">كل الحالات</option>
          <option value="pending">قيد المراجعة</option>
          <option value="approved">مقبول</option>
          <option value="rejected">مرفوض</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto flex-1">
        <table className="min-w-full w-full table-fixed divide-y divide-gray-300 text-sm text-right bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">المستخدم</th>
              <th className="px-4 py-3 font-medium text-gray-600">التعليق</th>
              <th className="px-4 py-3 font-medium text-gray-600">المنتج</th>
              <th className="px-4 py-3 font-medium text-gray-600">التقييم</th>
              <th className="px-4 py-3 font-medium text-gray-600">الحالة</th>
              <th className="px-4 py-3 font-medium text-gray-600">التاريخ</th>
              <th className="px-4 py-3 font-medium text-gray-600">الإجراءات</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300">
            {comments.length > 0 ? (
              comments.map(({ _id, userId, bookId, comment, rate, status, createdAt }) => (
                <tr key={_id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{userId?.name}</td>
                  <td className="px-4 py-3 truncate max-w-xs">{comment}</td>
                  <td className="px-4 py-3">{bookId?.title}</td>
                  <td className="px-4 py-3 text-center"><Rating value={rate} /></td>
                  <td className="px-4 py-3 text-center capitalize">{status}</td>
                  <td className="px-4 py-3 text-center">{formatDate(createdAt)}</td>
                  <td className="px-4 py-3 flex gap-2 justify-center flex-wrap">
                    {status !== "approved" && <Button onClick={() => setCommentStatus("approved", _id)} classname="bg-green-500 px-3 py-1 rounded-lg text-white">قبول</Button>}
                    {status !== "rejected" && <Button onClick={() => setCommentStatus("rejected", _id)} classname="bg-red-500 px-3 py-1 rounded-lg text-white">رفض</Button>}
                    <Button onClick={() => deleteComment(_id)} classname="bg-gray-300 px-3 py-1 rounded-lg text-gray-800">حذف</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="w-full">
                <td colSpan={7} className="text-center py-10 w-full">
                  لا توجد تعليقات
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition"
        >
          السابق
        </button>
        <span className="text-gray-700">صفحة {pagination.page} من {pagination.totalPages}</span>
        <button
          disabled={page === pagination.totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition"
        >
          التالي
        </button>
      </div>

      <Toaster />
    </div>
  );
};

export default CommentsPage;
