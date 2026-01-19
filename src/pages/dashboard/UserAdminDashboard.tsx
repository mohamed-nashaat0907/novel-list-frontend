import axiosInstance from "../../axios/axios.config";
import type { AxiosError } from "axios";
import { useAuth } from "../../hooks/UseAuth";
import { useQuery } from "@tanstack/react-query";
import Button from "../../components/ui/Button";
import type { UserDetails } from "../../data/interfaces";
import CustomDialog from "../../components/ui/CustomDialog";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const UserAdminDashboard = () => {
  const { token, isAdmin } = useAuth();

  const [deactivateIsOpen, setDeactivateIsOpen] = useState(false);
  const [reactivateIsOpen, setReactivateIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [roleDialogIsOpen, setRoleDialogIsOpen] = useState(false);

  const fetchUsers = async () => {
    const { data } = await axiosInstance.get('/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data?.data || data; // التأكد من أن data array
  }

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['fetchusers', token],
    queryFn: fetchUsers,
    enabled: !!token && !!isAdmin,
  });

  // Handlers
  const deactivateHandler = (userId: string) => {
    setSelectedUserId(userId);
    setDeactivateIsOpen(true);
  }

  const reactivateHandler = (userId: string) => {
    setSelectedUserId(userId);
    setReactivateIsOpen(true);
  }

  const changeRoleHandler = (userId: string) => {
    setSelectedUserId(userId);
    setRoleDialogIsOpen(true);
  }

  // API actions
  const deactivateUser = async (userId: string) => {
    try {
      await axiosInstance.patch(`/users/deactivate/${userId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("تم تعطيل المستخدم");
      refetch();
      setDeactivateIsOpen(false);
    } catch (err) {
      toast.error("فشل تعطيل المستخدم");
      console.error(err);
    }
  }

  const reactivateUser = async (userId: string) => {
    try {
      await axiosInstance.patch(`/users/reactivate/${userId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("تم إعادة تفعيل المستخدم");
      refetch();
      setReactivateIsOpen(false);
    } catch (err) {
      toast.error("فشل إعادة التفعيل");
      console.error(err);
    }
  }

  const changeRole = async (userId: string) => {
    try {
      await axiosInstance.post(`/users/changerole/${userId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("تم تغيير الدور بنجاح");
      refetch();
      setRoleDialogIsOpen(false);
    } catch (err) {
      toast.error("فشل تغيير الدور");
      console.error(err);
    }
  }

  if (isLoading) return <h1 className="text-xl font-semibold text-blue-600 animate-pulse">Loading users...</h1>;

  if (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    const errorMessage = `❌ ${axiosError.response?.data.message || "هناك خطأ"}`;
    return <h1 className="text-xl font-semibold text-red-600">{errorMessage}</h1>;
  }

  return (
    <div className="w-full border border-black p-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-6 text-center">User Admin Dashboard</h1>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-center">#</th>
            <th className="py-2 px-4 border-b text-center">Name</th>
            <th className="py-2 px-4 border-b text-center">Email</th>
            <th className="py-2 px-4 border-b text-center">Role</th>
            <th className="py-2 px-4 border-b text-center">Active</th>
            <th className="py-2 px-4 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-400">لا يوجد مستخدمين</td>
            </tr>
          )}

          {data?.map(({ _id: id, name, email, role, active }: UserDetails, index: number) => (
            <tr key={id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b text-center">{index + 1}</td>
              <td className="py-2 px-4 border-b text-center">{name}</td>
              <td className="py-2 px-4 border-b text-center">{email}</td>
              <td className="py-2 px-4 border-b text-center">{role}</td>
              <td className={`py-2 px-4 border-b text-center font-semibold ${active ? 'text-green-600' : 'text-red-600'}`}>{active ? 'Yes' : 'No'}</td>
              <td className="py-2 px-4 border-b text-center flex flex-col gap-2">
                {active ? (
                  <Button classname="bg-red-600 hover:bg-red-700" onClick={() => deactivateHandler(id)}>Deactivate</Button>
                ) : (
                  <Button classname="bg-green-600 hover:bg-green-700" onClick={() => reactivateHandler(id)}>Activate</Button>
                )}
                {/* زر تغيير الدور */}
                {isAdmin && (
                  <Button classname="bg-blue-600 hover:bg-blue-700" onClick={() => changeRoleHandler(id)}>
                    Change Role
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Deactivate Dialog */}
      <CustomDialog
        isOpen={deactivateIsOpen}
        closeDialog={() => setDeactivateIsOpen(false)}
        title="Deactivate Account"
        description="This will change the state of activation"
      >
        <p>Are you sure you want to deactivate the user?</p>
        <div className="flex gap-4 mt-4">
          <Button classname="bg-red-600 hover:bg-red-700" onClick={() => deactivateUser(selectedUserId)}>Deactivate</Button>
          <Button classname="bg-gray-600 hover:bg-gray-700" onClick={() => setDeactivateIsOpen(false)}>Cancel</Button>
        </div>
      </CustomDialog>

      {/* Reactivate Dialog */}
      <CustomDialog
        isOpen={reactivateIsOpen}
        closeDialog={() => setReactivateIsOpen(false)}
        title="Reactivate Account"
        description="This will reactivate the user account"

      >
        <p>Are you sure you want to reactivate the user?</p>
        <div className="flex gap-4 mt-4">
          <Button classname="bg-green-600 hover:bg-green-700" onClick={() => reactivateUser(selectedUserId)}>Reactivate</Button>
          <Button classname="bg-gray-600 hover:bg-gray-700" onClick={() => setReactivateIsOpen(false)}>Cancel</Button>
        </div>
      </CustomDialog>

      {/* Change Role Dialog */}
      <CustomDialog
        isOpen={roleDialogIsOpen}
        closeDialog={() => setRoleDialogIsOpen(false)}
        title="Change User Role"
        description="This will change the role "

      >
        <p>Are you sure you want to change the role of this user?</p>
        <div className="flex gap-4 mt-4">
          <Button
            classname="bg-blue-600 hover:bg-blue-700"
            onClick={() => changeRole(selectedUserId)}
          >
            Change Role to {data?.find((u : UserDetails )=> u._id === selectedUserId)?.role === 'admin' ? 'user' : 'admin'}
          </Button>
          <Button classname="bg-gray-600 hover:bg-gray-700" onClick={() => setRoleDialogIsOpen(false)}>Cancel</Button>
        </div>
      </CustomDialog>
    </div>
  );
};

export default UserAdminDashboard;



