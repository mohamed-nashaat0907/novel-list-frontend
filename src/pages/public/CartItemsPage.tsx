import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useCartAuth } from "../../hooks/UseCartAuth";
import { useAuth } from "../../hooks/UseAuth";
import CustomDialog from "../../components/ui/CustomDialog";
import { useState } from "react";
import axiosInstance from "../../axios/axios.config";
import { AxiosError } from "axios";

function CartItemsPage() {
    const { token } = useAuth();
    const { cartItems, refetchCart, totalQuantity, totalPrice } = useCartAuth();
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [deletedProductId, setDeletedProductId] = useState<string>();
    const [editedProductId, setEditedProductId] = useState<string>();
    const [editedProduct, setEditedProduct] = useState<{ quantity: number }>({ quantity: 0 });

    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [orderSuccess, setOrderSuccess] = useState<boolean>(false);


    function openConfirmationDialog(id: string) {
        setDeletedProductId(id);
        setIsOpenDeleteModal(true);
    }

    async function deleteProduct() {
        try {
            await axiosInstance.delete(`/cart/${deletedProductId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsOpenDeleteModal(false);
            refetchCart();
        } catch (error) {
            const err = error as AxiosError;
            console.log(err);
        }
    }

    async function editProduct() {
        try {
            await axiosInstance.patch(`/cart/${editedProductId}`, editedProduct, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditedProductId(undefined);
            refetchCart();
        } catch (error) {
            const err = error as AxiosError;
            console.log(err);
        }
    }

    async function createOrder() {
        if (!cartItems || cartItems.length === 0) return;

        setIsCreatingOrder(true);
        setOrderError(null);

        try {
            const orderData = {
                books: cartItems.map(item => ({
                    book: item.productId,
                    quantity: item.quantity,
                    price: item.price ?? (item.subTotal ? item.subTotal / item.quantity : 0)
                })),
                totalPrice,
                paymentMethod: 'paypal'
            };

            const { data } = await axiosInstance.post(
                'http://localhost:5000/buy/create-test-order',
                orderData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Order created:', data);
            // If backend returned an approval URL (mock or real PayPal), open it
            const approvalUrl = data?.data?.approvalUrl || data?.approvalUrl;
            if (approvalUrl) {
                // open in same tab to follow OAuth/payment redirect flow
                window.location.href = approvalUrl;
                return;
            }

            setOrderSuccess(true);
            refetchCart();
        } catch (error) {
            const err = error as AxiosError<{message:string}>;
            console.error(err);
            // try to show server message when available
            setOrderError(err?.response?.data?.message ?? 'Failed to create order');
        } finally {
            setIsCreatingOrder(false);
        }
    }


    return (
        <div className="w-full p-4">
            <h1 className="text-center text-2xl font-bold mb-4">Your Cart</h1>

            <div className="flex flex-col gap-4">
                {cartItems && cartItems.length > 0 ? (
                    cartItems.map(({ productId, quantity, subTotal }) => (
                        <div key={productId} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-4">
                                <img
                                    src="https://bit.ly/3X5J2TP"
                                    alt="Product"
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div>
                                    <h2 className="font-medium">Product Title</h2>
                                    <p className="text-sm text-gray-500">$Price</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                {editedProductId === productId ? (
                                    <form onSubmit={(e) => e.preventDefault()}>
                                        <div className="flex gap-2">
                                            <label htmlFor={`input-${productId}`}>quantity</label>
                                            <Input
                                                id={`input-${productId}`}
                                                type="number"
                                                value={editedProduct.quantity}
                                                onChange={(e) =>
                                                    setEditedProduct({ quantity: Math.max(1, Number(e.target.value)) })
                                                }
                                            />
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <Button
                                                classname="bg-blue-600 text-white"
                                                onClick={editProduct}
                                            >
                                                confirm
                                            </Button>
                                            <Button
                                                classname="bg-red-600 text-white"
                                                onClick={() => setEditedProductId(undefined)}
                                            >
                                                cancel
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button
                                            classname="bg-blue-600 text-white px-3 py-1 rounded"
                                            onClick={() => {
                                                setEditedProduct({ quantity });
                                                setEditedProductId(productId);
                                            }}
                                        >
                                            edit
                                        </Button>
                                        <Button
                                            classname="bg-red-600 text-white"
                                            onClick={() => openConfirmationDialog(productId)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div>quantity: {quantity}</div>
                            <p className="font-medium">{subTotal}$</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 text-6xl capitalize">no items in card</p>
                )}
            </div>

            {cartItems && cartItems.length > 0 && (
                <div className="flex flex-col items-center gap-4 mt-4">
                    <div className="flex justify-center gap-4 font-bold">
                        <p>Total Items: {totalQuantity}</p>
                        <p>Total Price: {totalPrice}$</p>
                    </div>

                    <Button
                        classname="bg-green-600 text-white px-4 py-2 rounded"
                        onClick={createOrder}
                        disabled={isCreatingOrder}
                    >
                        {isCreatingOrder ? "Processing..." : "Checkout / Create Order"}
                    </Button>

                    {orderError && <p className="text-red-600 mt-2">{orderError}</p>}
                    {orderSuccess && <p className="text-green-600 mt-2">Order created successfully!</p>}
                </div>
            )}

            <CustomDialog
                isOpen={isOpenDeleteModal}
                closeDialog={() => setIsOpenDeleteModal(false)}
                title="delete the product"
                description="This will reactivate the user account"
            >
                <p className="text-center">Are you sure you want to delete this product? All of your data will be restored.</p>
                <div className="flex gap-4 mt-2">
                    <Button classname="bg-red-600 hover:text-white" onClick={deleteProduct}>delete</Button>
                    <Button classname="bg-gray-600 hover:bg-gray-700 text-white" onClick={() => setIsOpenDeleteModal(false)}>Cancel</Button>
                </div>
            </CustomDialog>
        </div>
    );
}

export default CartItemsPage;
// import Button from "../../components/ui/Button";
// import Input from "../../components/ui/Input";
// import { useCartAuth } from "../../hooks/UseCartAuth";
// import { useAuth } from "../../hooks/UseAuth";
// import CustomDialog from "../../components/ui/CustomDialog";
// import { useState } from "react";
// import axiosInstance from "../../axios/axios.config";
// import { AxiosError } from "axios";

// function CartItemsPage() {
//     const { token } = useAuth();
//     const { cartItems, refetchCart ,totalQuantity,totalPrice } = useCartAuth();
//     const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
//     const [deletedProductId, setDeletedProductId] = useState<string>();
//     const [editedProductId, setEditedProductId] = useState<string>();
//     const [editedProduct, setEditedProduct] = useState<{ quantity: number }>({ quantity: 0 });

//     function openConfirmationDialog(id: string) {
//         setDeletedProductId(id);
//         setIsOpenDeleteModal(true);
//     }

//     async function deleteProduct() {
//         try {
//             await axiosInstance.delete(`/cart/${deletedProductId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setIsOpenDeleteModal(false);
//             refetchCart();
//         } catch (error) {
//             const err = error as AxiosError;
//             console.log(err);
//         }
//     }

//     async function editProduct() {
//         try {
//             await axiosInstance.patch(`/cart/${editedProductId}`, editedProduct, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setEditedProductId(undefined);
//             refetchCart();
//         } catch (error) {
//             const err = error as AxiosError;
//             console.log(err);
//         }
//     }

//     return (
//         <div className="w-full p-4">
//             <h1 className="text-center text-2xl font-bold mb-4">Your Cart</h1>

//             <div className="flex flex-col gap-4">
//                 {cartItems && cartItems.length > 0 ? (
//                     cartItems.map(({ productId, quantity ,subTotal }) => (
//                         <div key={productId} className="flex items-center justify-between p-2 border rounded">
//                             <div className="flex items-center gap-4">
//                                 <img
//                                     src="https://bit.ly/3X5J2TP"
//                                     alt="Product"
//                                     className="w-16 h-16 object-cover rounded"
//                                 />
//                                 <div>
//                                     <h2 className="font-medium">Product Title</h2>
//                                     <p className="text-sm text-gray-500">$Price</p>
//                                 </div>
//                             </div>

//                             <div className="flex flex-col items-center gap-2">
//                                 {editedProductId === productId ? (
//                                     <form onSubmit={(e) => e.preventDefault()}>
//                                         <div className="flex gap-2">
//                                             <label htmlFor={`input-${productId}`}>quantity</label>
//                                             <Input
//                                                 id={`input-${productId}`}
//                                                 type="number"
//                                                 value={editedProduct.quantity}
//                                                 onChange={(e) =>
//                                                     setEditedProduct({ quantity: Math.max(1, Number(e.target.value)) })
//                                                 }
//                                             />
//                                         </div>
//                                         <div className="flex gap-2 mt-2">
//                                             <Button
//                                                 classname="bg-blue-600 text-white"
//                                                 onClick={editProduct}
//                                             >
//                                                 confirm
//                                             </Button>
//                                             <Button
//                                                 classname="bg-red-600 text-white"
//                                                 onClick={() => setEditedProductId(undefined)}
//                                             >
//                                                 cancel
//                                             </Button>
//                                         </div>
//                                     </form>
//                                 ) : (
//                                     <div className="flex gap-2">
//                                         <Button
//                                             classname="bg-blue-600 text-white px-3 py-1 rounded"
//                                             onClick={() => {
//                                                 setEditedProduct({ quantity });
//                                                 setEditedProductId(productId);
//                                             }}
//                                         >
//                                             edit
//                                         </Button>
//                                         <Button
//                                             classname="bg-red-600 text-white"
//                                             onClick={() => openConfirmationDialog(productId)}
//                                         >
//                                             Remove
//                                         </Button>
//                                     </div>
//                                 )}
//                             </div>

//                             <div>quantity: {quantity}</div>
//                             <p className="font-medium">{subTotal}$</p>
//                         </div>
//                     ))
//                 ) : (
//                     <p className="text-center text-gray-500 text-6xl capitalize">no items in card</p>
//                 )}
//             </div>

//             {cartItems && cartItems.length > 0 && (
//                 <div className="flex justify-center gap-4 mt-4 font-bold">
//                     <p>Total Items: {totalQuantity}</p>
//                     <p>Total Price: {totalPrice}$</p>
//                 </div>
//             )}

//             <CustomDialog
//                 isOpen={isOpenDeleteModal}
//                 closeDialog={() => setIsOpenDeleteModal(false)}
//                 title="delete the product"
//                 description="This will reactivate the user account"
//             >
//                 <p className="text-center">Are you sure you want to delete this product? All of your data will be restored.</p>
//                 <div className="flex gap-4 mt-2">
//                     <Button classname="bg-red-600 hover:text-white" onClick={deleteProduct}>delete</Button>
//                     <Button classname="bg-gray-600 hover:bg-gray-700 text-white" onClick={() => setIsOpenDeleteModal(false)}>Cancel</Button>
//                 </div>
//             </CustomDialog>
//         </div>
//     );
// }

// export default CartItemsPage;
