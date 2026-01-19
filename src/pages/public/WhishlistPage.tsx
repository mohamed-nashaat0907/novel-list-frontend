import Button from "../../components/ui/Button";
import { useWhislistAuth } from "../../hooks/UseAuthWhislist";
import { useAuth } from "../../hooks/UseAuth";
import CustomDialog from "../../components/ui/CustomDialog";
import { useState } from "react";
import axiosInstance from "../../axios/axios.config";
import { AxiosError } from "axios";
import Input from "../../components/ui/Input";
import { useCartAuth } from "../../hooks/UseCartAuth";

function WhishlistPage() {
    const { token } = useAuth();
    const { wishlistItems, refetchWishlist, totalQuantity } = useWhislistAuth();
    const { cartItems } = useCartAuth();
    const { refetchCart } = useCartAuth();


    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [deletedProductId, setDeletedProductId] = useState<string>();

    const [addedProduct, setAddedProduct] = useState<{ productId: string; quantity: number }>({
        productId: "",
        quantity: 1
    });

    function openConfirmationDialog(id: string) {
        setDeletedProductId(id);
        setIsOpenDeleteModal(true);
    }

    async function deleteProduct() {
        try {
            await axiosInstance.delete('/wishlist/', {
                headers: { Authorization: `Bearer ${token}` },
                data: { productId: deletedProductId }
            });
            setIsOpenDeleteModal(false);
            refetchWishlist();
        } catch (error) {
            const err = error as AxiosError;
            console.log(err);
        }
    }

    // ⭐ الدالة التي تضيف المنتج للكارت
    async function confirmAddToCart() {
        try {
            await axiosInstance.post(
                "/cart",
                addedProduct,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            refetchCart();


            // رجوع للوضع الطبيعي
            setAddedProduct({ productId: "", quantity: 1 });

        } catch (error) {
            const err = error as AxiosError;
            console.log(err);
        }
    }

    return (
        <div className="w-full p-4">
            <h1 className="text-center text-2xl font-bold mb-4">Your Wishlist</h1>

            <div className="flex flex-col gap-4">
                {wishlistItems && wishlistItems.length > 0 ? (
                    wishlistItems.map(({ productId: id, title, author, image }) => {
                        const isAdded = addedProduct.productId === id;
                        const isInCartItem = cartItems?.some(item => item.productId === id)
                        return (
                            <div key={id} className="flex items-center justify-between p-2 border rounded">
                                <div className="flex-2 flex items-center gap-4">
                                    <img
                                        src={image}
                                        alt={title}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div>
                                        <h2 className="font-medium">{title}</h2>
                                        <p className="text-sm text-gray-500">{author}</p>
                                    </div>
                                </div>

                                {!isAdded ?
                                    <div className="flex flex-1">
                                        {isInCartItem ? (
                                        <p className="text-green-700 text-center capitalize font-bold">you added this product to cart shopping</p>
                                        ) :(
                                        <Button
                                            classname="bg-blue-600 text-white"
                                            onClick={() => {
                                                setAddedProduct(prev => ({ ...prev, productId: id }))
                                            }}
                                        >
                                            add to cart
                                        </Button>
                                        )}


                                        <Button
                                            classname="bg-red-600 text-white"
                                            onClick={() => openConfirmationDialog(id)}
                                        >
                                            Remove
                                        </Button>
                                    </div> :
                                    <div className="flex flex-col gap-2 items-center">
                                        <div className="flex items-center gap-2">
                                            <label htmlFor={`quantity-${id}`} className="font-medium">
                                                Quantity:
                                            </label>
                                            <Input
                                                id={`quantity-${id}`}
                                                type="number"
                                                name="quantity"
                                                className="w-16 text-center border rounded"
                                                value={addedProduct.quantity}
                                                onChange={(e) =>
                                                    setAddedProduct(prev => ({
                                                        ...prev,
                                                        quantity: Math.max(1, Number(e.target.value))
                                                    }))
                                                }
                                            />
                                        </div>
                                        <Button
                                            classname="bg-green-600 w-full py-2 text-white rounded"
                                            onClick={confirmAddToCart}
                                        >
                                            Confirm
                                        </Button>
                                        <Button
                                            classname="bg-red-600 w-full py-2 text-white rounded"
                                            onClick={() =>
                                                setAddedProduct({ productId: "", quantity: 1 })
                                            }
                                        >
                                            cancel
                                        </Button>
                                    </div>}
                            </div>
                        )
                    })
                ) : (
                    <p className="text-center text-gray-500 text-4xl capitalize">No items in wishlist</p>
                )}
            </div>

            {wishlistItems && wishlistItems.length > 0 && (
                <div className="flex justify-center gap-4 mt-4 font-bold">
                    <p>Total Items: {totalQuantity}</p>
                </div>
            )}

            <CustomDialog
                isOpen={isOpenDeleteModal}
                closeDialog={() => setIsOpenDeleteModal(false)}
                title="Delete the product"
                description="This will remove the product from your wishlist"
            >
                <p className="text-center">Are you sure you want to delete this product?</p>
                <div className="flex gap-4 mt-2">
                    <Button classname="bg-red-600 hover:text-white" onClick={deleteProduct}>Delete</Button>
                    <Button classname="bg-gray-600 hover:bg-gray-700 text-white" onClick={() => setIsOpenDeleteModal(false)}>Cancel</Button>
                </div>
            </CustomDialog>
        </div>
    );
}

export default WhishlistPage;
