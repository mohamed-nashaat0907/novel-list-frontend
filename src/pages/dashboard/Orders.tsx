import { useAuth } from "../../hooks/UseAuth";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios/axios.config";
import type{  UserDetails , Order, Stats  } from "../../data/interfaces";

// تعديل الواجهة لتعكس البيانات الصحيحة


function Orders() {
    const { token, isAdmin } = useAuth();

    const fetchOrders = async (): Promise<Order[]> => {
        if (!isAdmin) return [];
        const res = await axiosInstance.get("/orders/all-orders", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data?.data ?? [];
    };

    const fetchStats = async (): Promise<Stats[]> => {
        if (!isAdmin) return [];
        const res = await axiosInstance.get("/orders/noofordersincategory", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data?.data ?? [];
    };

    const { data: orders = [], isLoading: ordersLoading, isError: ordersError, error: ordersFetchError, refetch: refetchOrders } = useQuery<Order[], Error>({
        queryKey: ["adminOrders", token],
        queryFn: fetchOrders,
        enabled: !!token && !!isAdmin,
    });

    const { data: stats = [], isLoading: statsLoading, isError: statsError, error: statsFetchError, refetch: refetchStats } = useQuery<Stats[], Error>({
        queryKey: ["ordersByCategory", token],
        queryFn: fetchStats,
        enabled: !!token && !!isAdmin,
    });

    const { data: usersData } = useQuery({
        queryKey: ['allUsers', token],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data;
        },
        enabled: !!token && !!isAdmin
    });

    const usersArray: UserDetails[] = usersData ?? [];

    if (!token) return <div className="p-6">Please sign in to view orders.</div>;

    const loading = ordersLoading || statsLoading;
    const error = ordersError ? ordersFetchError?.message : statsError ? statsFetchError?.message : null;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold mb-4">Admin — Orders</h1>
                <div className="space-x-2">
                    <button
                        className="px-3 py-1 bg-gray-200 rounded"
                        onClick={() => {
                            refetchOrders();
                            refetchStats();
                        }}
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <h2 className="font-semibold mb-2">All Orders ({orders.length})</h2>
                        <div className="overflow-x-auto border rounded">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-100 text-left">
                                    <tr>
                                        <th className="px-3 py-2">Order#</th>
                                        <th className="px-3 py-2">User</th>
                                        <th className="px-3 py-2">Total</th>
                                        <th className="px-3 py-2">Status</th>
                                        <th className="px-3 py-2">Transaction</th>
                                        <th className="px-3 py-2">Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(({ _id: id, orderNumber, userId, totalPrice, status, transactionRef, paypalOrderId, createdAt }) => (
                                        <tr key={id} className="border-t">
                                            <td className="px-3 py-2">{orderNumber ?? id}</td>
                                            <td className="px-3 py-2">
                                                {typeof userId === "string"
                                                    ? usersArray.find(u => u._id === userId)?.name ?? 'Unknown User'
                                                    : userId.name ?? 'Unknown User'}
                                            </td>
                                            <td className="px-3 py-2">${totalPrice}</td>
                                            <td className="px-3 py-2 capitalize">{status}</td>
                                            <td className="px-3 py-2">{transactionRef ?? paypalOrderId}</td>
                                            <td className="px-3 py-2">{new Date(createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <h2 className="font-semibold mb-2">Sold Books per Category</h2>
                        <div className="space-y-2">
                            {stats.length === 0 && <p className="text-sm text-gray-500">No data</p>}
                            {stats.map((s) => (
                                <div key={s.categoryid ?? s._id} className="p-3 border rounded">
                                    <div className="font-medium">{s.categoryname}</div>
                                    <div className="text-sm text-gray-600">Total sold: {s.totalSold}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Orders;
