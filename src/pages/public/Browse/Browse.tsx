import Rating from "../../../components/ui/Rating";
import { useState } from "react";
import type { IProduct } from "../../../data/interfaces";
import { useQuery } from "@tanstack/react-query";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import axiosInstance from "../../../axios/axios.config";
import { useAuth } from "../../../hooks/UseAuth";
import { AxiosError } from "axios";
import { useCartAuth } from "../../../hooks/UseCartAuth";
import { useWhislistAuth } from "../../../hooks/UseAuthWhislist";
import BrowseComments from "./BrowseComments";
import toast, { Toaster } from "react-hot-toast";

interface IaddedProduct {
    productId: string;
    quantity: number;
}

function Browse() {
    const { token, isAdmin, isAuthenticated, user } = useAuth();
    const { cartItems, refetchCart } = useCartAuth();
    const { wishlistItems, refetchWishlist } = useWhislistAuth();

    const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
    const [addedProducts, setAddedProducts] = useState<{ [key: string]: number }>({});
    const [addComment, setAddComment] = useState<{ [key: string]: boolean }>({});
    const [ratingValue, setRatingValue] = useState<{ [key: string]: number }>({});
    const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
    const [commentCheck, setCommentCheck] = useState<{ [key: string]: { isBought: boolean, isReviewed: boolean } }>({});

    const { data } = useQuery({
        queryKey: ["products", token],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/products", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        },
    });

    const addtocart = async (product: IaddedProduct) => {
        try {
            await axiosInstance.post("/cart", product, { headers: { Authorization: `Bearer ${token}` } });
            refetchCart();
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            console.log(err);
        }
    };

    const whishlisticon = async (Id: string) => {
        const isWhislist = wishlistItems?.some(item => item.productId === Id);
        try {
            if (isWhislist) {
                await axiosInstance.delete("/wishlist", {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { productId: Id },
                });
            } else {
                await axiosInstance.post("/wishlist", { productId: Id }, { headers: { Authorization: `Bearer ${token}` } });
            }
            refetchWishlist();
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            console.log(err);
        }
    };

    const toggleAddComment = (productId: string) => {
        setAddComment(prev => ({ ...prev, [productId]: !prev[productId] }));
    };

    const handleCommentClick = async (bookId: string) => {
        if (!token || isAdmin) return;
        try {
            const { data } = await axiosInstance.get(`/comments/check/${bookId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCommentCheck(prev => ({ ...prev, [bookId]: data }));
            if (!data.isBought) return alert("You need to buy this book first to comment.");
            if (data.isReviewed) return alert("You have already reviewed this book.");
            toggleAddComment(bookId);
        } catch (error) {
            console.log(error);
        }
    };

    const sendComment = async (bookId: string) => {
        if (!token || !isAuthenticated || isAdmin) return;

        if (!commentText[bookId]?.trim()) return alert("من فضلك اكتب تعليقًا");
        if (!ratingValue[bookId] || ratingValue[bookId] < 1) return alert("من فضلك اختر تقييمًا");

        try {
            const { data } = await axiosInstance.post(
                "/comments/crea",
                { userId: user?._id, bookId, comment: commentText[bookId], rate: ratingValue[bookId] },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Reset UI
            setAddComment(prev => ({ ...prev, [bookId]: false }));
            setCommentText(prev => ({ ...prev, [bookId]: "" }));
            setRatingValue(prev => ({ ...prev, [bookId]: 0 }));
            setCommentCheck(prev => ({ ...prev, [bookId]: { isBought: true, isReviewed: true } }));

            toast.success(`${data?.message} ✅ your comment is pending approval`, {
                position: "top-center",
                duration: 3000,
                style: { backgroundColor: "black", color: "white", width: "fit-content" },
            });
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            toast.error(err?.message || "Failed to send comment", {
                position: "top-center",
                duration: 3000,
                style: { backgroundColor: "black", color: "white", width: "fit-content" },
            });
        }
    };

    const products: IProduct[] = data?.data ?? [];

    return (
        <div className="w-full px-2 md:px-6 py-4">
            <h1 className="text-2xl font-bold text-center mb-6">Books</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(({ _id: id, imageCover, title, description, price, ratingAverage, category, quantity }) => {
                    const isInCart = cartItems?.some(item => item.productId === id) ?? false;
                    const isAdded = addedProducts[id] !== undefined;
                    const isWhislist = wishlistItems?.some(item => item.productId === id);

                    return (
                        <div key={id} className="flex flex-col gap-3 border rounded-lg p-4 shadow hover:shadow-lg transition duration-300 bg-white">
                            {/* صورة الكتاب */}
                            <div className="w-full h-64 overflow-hidden rounded-md">
                                <img src={imageCover} alt={title} className="w-full h-full object-cover" />
                            </div>

                            {/* العنوان والفئة */}
                            <h2 className="text-lg font-semibold text-center truncate">{title}</h2>
                            <h3 className="text-sm text-gray-500 text-center">{category.name}</h3>

                            {/* الوصف */}
                            <p className="text-gray-700 text-sm line-clamp-3">{description}</p>

                            {/* السعر والتقييم */}
                            <div className="flex justify-between items-center mt-2">
                                <p className="font-bold">${price}</p>
                                {ratingAverage && (
                                    <div className="flex items-center gap-2">
                                        <Rating value={ratingAverage} />
                                        <span>{ratingAverage}</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-gray-500">Available: {quantity}</p>

                            {/* أزرار السلة والمفضلة */}
                            {!isInCart ? (
                                !isAdded ? (
                                    <div className="flex items-center gap-2 mt-2">
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded" onClick={() => setAddedProducts(prev => ({ ...prev, [id]: 1 }))}>
                                            Add to Cart
                                        </Button>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill={isWhislist ? "red" : "none"}
                                            viewBox="0 0 24 24"
                                            strokeWidth={3}
                                            stroke="currentColor"
                                            className="w-10 h-10 cursor-pointer"
                                            onClick={() => whishlisticon(id)}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2 items-center mt-2">
                                        <div className="flex items-center gap-2">
                                            <label htmlFor={`quantity-${id}`} className="font-medium">Quantity:</label>
                                            <Input
                                                id={`quantity-${id}`}
                                                type="number"
                                                min={1}
                                                value={addedProducts[id]}
                                                onChange={e => setAddedProducts(prev => ({ ...prev, [id]: Math.max(1, Number(e.target.value)) }))}
                                                className="w-16 text-center border rounded"
                                            />
                                        </div>
                                        <Button
                                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                                            onClick={() => {
                                                addtocart({ productId: id, quantity: addedProducts[id] });
                                                setAddedProducts(prev => { const copy = { ...prev }; delete copy[id]; return copy; });
                                            }}
                                        >
                                            Confirm
                                        </Button>
                                    </div>
                                )
                            ) : (
                                <p className="text-green-600 text-center font-medium mt-2">Added to cart</p>
                            )}

                            {/* التعليقات */}
                            <div className="mt-2 flex flex-col gap-2">
                                {!addComment[id] && (
                                    <>
                                        <Button
                                            className="bg-gray-500 text-white mb-2"
                                            onClick={() => handleCommentClick(id)}
                                            disabled={commentCheck[id]?.isReviewed || commentCheck[id]?.isBought === false}
                                        >
                                            Add Comment
                                        </Button>
                                        {commentCheck[id]?.isBought === false && <p className="text-red-600 text-sm">You need to buy this book to comment.</p>}
                                    </>
                                )}

                                {addComment[id] && (
                                    <>
                                        <textarea
                                            className="bg-white w-full border rounded min-h-20 p-2"
                                            placeholder="اكتب تعليقك هنا..."
                                            value={commentText[id] || ""}
                                            onChange={e => setCommentText(prev => ({ ...prev, [id]: e.target.value }))}
                                        />
                                        <select
                                            className="w-full border rounded p-2 mt-2"
                                            value={ratingValue[id] || 0}
                                            onChange={e => setRatingValue(prev => ({ ...prev, [id]: Number(e.target.value) }))}
                                        >
                                            <option value={0} disabled>اختر التقييم</option>
                                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{"⭐".repeat(n)} {n}</option>)}
                                        </select>
                                        <Button className="bg-blue-700 text-white" onClick={() => sendComment(id)}>Send Comment</Button>
                                        <Button className="bg-red-700 text-white" onClick={() => toggleAddComment(id)}>Cancel</Button>
                                    </>
                                )}
                            </div>

                            <Button className="bg-gray-200 w-full py-1 rounded mt-2" onClick={() => setShowComments(prev => ({ ...prev, [id]: !prev[id] }))}>
                                {showComments[id] ? "إخفاء التعليقات" : "عرض التعليقات"}
                            </Button>

                            {showComments[id] && <BrowseComments bookId={id} />}
                        </div>
                    );
                })}
            </div>
            <Toaster />
        </div>
    );
}

export default Browse;






// import Rating from "../../../components/ui/Rating";
// import { useState } from "react";
// import type { IProduct } from "../../../data/interfaces";
// import { useQuery } from "@tanstack/react-query";
// import Button from "../../../components/ui/Button";
// import Input from "../../../components/ui/Input";
// import axiosInstance from "../../../axios/axios.config";
// import { useAuth } from "../../../hooks/UseAuth";
// import { AxiosError } from "axios";
// import { useCartAuth } from "../../../hooks/UseCartAuth";
// import { useWhislistAuth } from "../../../hooks/UseAuthWhislist";
// import BrowseComments from "./BrowseComments";
// import toast, { Toaster } from "react-hot-toast";

// interface IaddedProduct {
//     productId: string;
//     quantity: number;
// }

// function Browse() {
//     const { token, isAdmin, isAuthenticated, user } = useAuth();
//     const { cartItems, refetchCart } = useCartAuth();
//     const { wishlistItems, refetchWishlist } = useWhislistAuth();

//     const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
//     const [addedProducts, setAddedProducts] = useState<{ [key: string]: number }>({});
//     const [addComment, setAddComment] = useState<{ [key: string]: boolean }>({});
//     const [ratingValue, setRatingValue] = useState<{ [key: string]: number }>({});
//     const [commentText, setCommentText] = useState<{ [key: string]: string }>({});


//     const [commentCheck, setCommentCheck] = useState<{ [key: string]: { isBought: boolean, isReviewed: boolean } }>({});

//     const { data } = useQuery({
//         queryKey: ["products", token],
//         queryFn: async () => {
//             const { data } = await axiosInstance.get("/products", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             return data;
//         },
//     });

//     const addtocart = async (product: IaddedProduct) => {
//         try {
//             await axiosInstance.post("/cart", product, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             refetchCart();
//         } catch (error) {
//             const err = error as AxiosError<{ message: string }>;
//             console.log(err);
//         }
//     };

//     const whishlisticon = async (Id: string) => {
//         const isWhislist = wishlistItems?.some(item => item.productId === Id);
//         if (isWhislist) {
//             try {
//                 await axiosInstance.delete("/wishlist", {
//                     headers: { Authorization: `Bearer ${token}` },
//                     data: { productId: Id },
//                 });
//                 refetchWishlist();
//             } catch (error) {
//                 const err = error as AxiosError<{ message: string }>;
//                 console.log(err);
//             }
//         } else {
//             try {
//                 await axiosInstance.post(
//                     "/wishlist",
//                     { productId: Id },
//                     { headers: { Authorization: `Bearer ${token}` } }
//                 );
//                 refetchWishlist();
//             } catch (error) {
//                 const err = error as AxiosError<{ message: string }>;
//                 console.log(err);
//             }
//         }
//     };

//     const toggleAddComment = (productId: string) => {
//         setAddComment(prev => ({
//             ...prev,
//             [productId]: !prev[productId],
//         }));
//     };

//     const handleCommentClick = async (bookId: string) => {
//         if (!token || isAdmin) return;

//         try {
//             const { data } = await axiosInstance.get(`/comments/check/${bookId}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             setCommentCheck(prev => ({ ...prev, [bookId]: data }));

//             if (!data.isBought) {
//                 alert("You need to buy this book first to comment.");
//                 return;
//             }
//             if (data.isBought && data.isReviewed) {
//                 alert("You have reviewed this book before.");
//                 return;
//             }

//             toggleAddComment(bookId);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const sendComment = async (bookId: string) => {
//         if (!token || !isAuthenticated || isAdmin) return;

//         // Validation
//         if (!commentText[bookId]?.trim()) {
//             alert("من فضلك اكتب تعليقًا");
//             return;
//         }

//         if (!ratingValue[bookId] || ratingValue[bookId] < 1) {
//             alert("من فضلك اختر تقييمًا");
//             return;
//         }

//         try {
//             const { data } = await axiosInstance.post(
//                 "/comments/crea",
//                 {
//                     userId: user?._id,
//                     bookId,
//                     comment: commentText[bookId],
//                     rate: ratingValue[bookId],
//                 },
//                 {
//                     headers: { Authorization: `Bearer ${token}` },
//                 }
//             );

//             // تحديث الواجهة
//             setAddComment(prev => ({ ...prev, [bookId]: false }));
//             setCommentText(prev => ({ ...prev, [bookId]: "" }));
//             setRatingValue(prev => ({ ...prev, [bookId]: 0 }));
//             setCommentCheck(prev => ({
//                 ...prev,
//                 [bookId]: { isBought: true, isReviewed: true },
//             }));

//             toast.success(`${data?.message} ✅ your comment is pending approval`, {
//                 position: "top-center",
//                 duration: 3000,
//                 style: {
//                     backgroundColor: "black",
//                     color: "white",
//                     width: "fit-content",
//                 }
//                 ,
//             });
//             console.log(data?.message);


//         } catch (error) {
//             const err = error as AxiosError<{ message: string }>;
//             console.log(err);
//             toast.error(err?.message || "Failed to send comment" , {
//                 position: "top-center",
//                 duration: 3000,
//                 style: {
//                     backgroundColor: "black",
//                     color: "white",
//                     width: "fit-content",
//                 }
//             });
//         }
//     };


//     const products: IProduct[] = data?.data ?? [];

//     return (
//         <div className="w-full">
//             <h1 className="text-center">books</h1>

//             <div className="grid grid-cols-3 gap-1">
//                 {products.map(
//                     ({ _id: id, imageCover, title, description, price, ratingAverage, category, quantity }) => {
//                         const isInCart = cartItems?.some(item => item.productId === id) ?? false;
//                         const isAdded = addedProducts[id] !== undefined;
//                         const isWhislist = wishlistItems?.some(item => item.productId === id);

//                         return (
//                             <div key={id} className="flex flex-col gap-3 border rounded">
//                                 <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition h-fit">
//                                     <img src={imageCover} alt={title} className="object-center" />
//                                 </div>
//                                 <h2 className="text-center capitalize">{title}</h2>
//                                 <h3 className="text-center capitalize">{category.name}</h3>
//                                 <p className="px-1">{description}</p>
//                                 <div className="flex justify-between px-1">
//                                     <p>Price</p>
//                                     <p>{price}</p>
//                                 </div>
//                                 {ratingAverage && (
//                                     <div className="flex justify-between items-center">
//                                         <p className="capitalize">Ratings</p>
//                                         <div className="flex flex-col items-center">
//                                             <Rating value={ratingAverage} />
//                                             <p>{ratingAverage}</p>
//                                         </div>
//                                     </div>
//                                 )}
//                                 <p>{quantity}</p>

//                                 {!isInCart ? (
//                                     !isAdded ? (
//                                         <div className="flex items-center gap-1">
//                                             <Button
//                                                 classname="bg-blue-700 w-full py-2 text-white rounded"
//                                                 onClick={() => setAddedProducts(prev => ({ ...prev, [id]: 1 }))}
//                                             >
//                                                 Add to Cart
//                                             </Button>
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 fill={isWhislist ? "red" : "none"}
//                                                 viewBox="0 0 24 24"
//                                                 strokeWidth={3}
//                                                 stroke="currentColor"
//                                                 className="w-10 h-10 cursor-pointer"
//                                                 onClick={() => whishlisticon(id)}
//                                             >
//                                                 <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
//                                                 />
//                                             </svg>
//                                         </div>
//                                     ) : (
//                                         <div className="flex flex-col gap-2 items-center">
//                                             <div className="flex items-center gap-2">
//                                                 <label htmlFor={`quantity-${id}`} className="font-medium">
//                                                     Quantity:
//                                                 </label>
//                                                 <Input
//                                                     id={`quantity-${id}`}
//                                                     type="number"
//                                                     name="quantity"
//                                                     min={1}
//                                                     value={addedProducts[id]}
//                                                     onChange={e =>
//                                                         setAddedProducts(prev => ({
//                                                             ...prev,
//                                                             [id]: Math.max(1, Number(e.target.value)),
//                                                         }))
//                                                     }
//                                                     className="w-16 text-center border rounded"
//                                                 />
//                                             </div>
//                                             <Button
//                                                 classname="bg-green-600 w-full py-2 text-white rounded"
//                                                 onClick={() => {
//                                                     addtocart({ productId: id, quantity: addedProducts[id] });
//                                                     setAddedProducts(prev => {
//                                                         const copy = { ...prev };
//                                                         delete copy[id];
//                                                         return copy;
//                                                     });
//                                                 }}
//                                             >
//                                                 Confirm
//                                             </Button>
//                                         </div>
//                                     )
//                                 ) : (
//                                     <p className="text-green-600 text-center font-medium">
//                                         the product added into cart
//                                     </p>
//                                 )}

//                                 <div className="mt-2 flex flex-col gap-2">
//                                     {!addComment[id] && (
//                                         <>
//                                             <Button
//                                                 classname="bg-gray-500 text-white mb-2"
//                                                 onClick={() => handleCommentClick(id)}
//                                                 disabled={commentCheck[id]?.isReviewed || commentCheck[id]?.isBought === false}
//                                             >
//                                                 Add Comment
//                                             </Button>
//                                             {commentCheck[id]?.isBought === false && (
//                                                 <p className="text-red-600 text-sm">
//                                                     You need to buy this book to comment.
//                                                 </p>
//                                             )}
//                                         </>
//                                     )}

//                                     {addComment[id] && (
//                                         <>
//                                             <textarea
//                                                 className="bg-white w-full border rounded min-h-20 p-2"
//                                                 placeholder="اكتب تعليقك هنا..."
//                                                 value={commentText[id] || ""}
//                                                 onChange={e =>
//                                                     setCommentText(prev => ({
//                                                         ...prev,
//                                                         [id]: e.target.value,
//                                                     }))
//                                                 }
//                                             />
//                                             <select
//                                                 className="w-full border rounded p-2 mt-2"
//                                                 value={ratingValue[id] || 0}
//                                                 onChange={e =>
//                                                     setRatingValue(prev => ({
//                                                         ...prev,
//                                                         [id]: Number(e.target.value),
//                                                     }))
//                                                 }
//                                             >
//                                                 <option value={0} disabled>اختر التقييم</option>
//                                                 <option value={1}>⭐ 1</option>
//                                                 <option value={2}>⭐⭐ 2</option>
//                                                 <option value={3}>⭐⭐⭐ 3</option>
//                                                 <option value={4}>⭐⭐⭐⭐ 4</option>
//                                                 <option value={5}>⭐⭐⭐⭐⭐ 5</option>
//                                             </select>

//                                             <Button
//                                                 classname="bg-blue-700 text-white"
//                                                 onClick={() => sendComment(id)}
//                                             >
//                                                 send Comment
//                                             </Button>
//                                             <Button
//                                                 classname="bg-red-700 text-white"
//                                                 onClick={() => toggleAddComment(id)}
//                                             >
//                                                 Cancel
//                                             </Button>
//                                         </>
//                                     )}
//                                 </div>

//                                 <Button
//                                     classname="bg-gray-200 w-full py-1 rounded mt-2"
//                                     onClick={() =>
//                                         setShowComments(prev => ({ ...prev, [id]: !prev[id] }))
//                                     }
//                                 >
//                                     {showComments[id] ? "إخفاء التعليقات" : "عرض التعليقات"}
//                                 </Button>

//                                 {showComments[id] && <BrowseComments bookId={id} />}
//                             </div>
//                         );
//                     }
//                 )}
//             </div>
//             <Toaster />
//         </div>
//     );
// }

// export default Browse;
