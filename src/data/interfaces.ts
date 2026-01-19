// import type { Formdata } from "../pages/public/Signup";
import type { Formsignindata } from "../pages/public/Signin";
import type { ProductFormData } from "../pages/dashboard/Books";
export interface signupfields {
  id: string;
  label: string;
  name: string;
  type: string;
  placeholder: string;
}
export interface signinfields {
  id: string;
  label: string;
  name: keyof Formsignindata;
  type: string;
  placeholder: string;
}

export interface UserDetails {
  _id: string; 
  name: string;
  email: string;
  password?: string; 
  role: "admin" | "user"; 
  active: boolean;
  isVerified: boolean;
  createdAt: string; 
  updatedAt: string;
  __v?: number; 
}

export interface IauthContext {
  user: UserDetails | null;
  token: string | null;
  handleLogin: (
    userData: UserDetails,
    token: string,
    expiration: number,
  ) => void;
  handleLogout: () => void;
  isAuthenticated: boolean;
  isAdmin?: boolean | null;
  isLoading?: boolean;
  // entryDate?:number|null;
  // expirationDate?:number|null;
}
export type UserType = IauthContext["user"];
export type TokenType = IauthContext["token"];
// ....................................................
export interface Category {
  _id: string;
  name: string;
}
export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  category: Category;
  // subcategory: any []; // لو عندك شكلها قولي وأنا أضبطه
  imageCover: string;
  images: string[];
  pdfLink: string;
  price: number;
  priceAfterDiscount: number;
  quantity: number;
  ratingAverage?: number;
  ratingQuantity: number;
  createdAt: string;
  updatedAt: string;
}
// ..............
export interface Iinputsproduct {
  id: string;
  name: keyof ProductFormData;
  label: string;
  type: string;
  placeholder: string;
  registerOptions?: object;
}
// ..........................
//cart item
interface Iproductincart {
  productId: string;
  title: string;
  author: string;
  image: string;
  price: number;
  quantity: number;
  subTotal: number;
  itemEntries: Array<{
    productId: string;
    addedAt: string;
    expiresAt: string;
    _id: string;
  }>;
}

export interface IcartContext {
  cartItems: Iproductincart[] | undefined;
  totalPrice: number | undefined;
  totalQuantity: number | undefined;
  refetchCart: () => Promise<void>;
}
// .................................
//whislist item
export interface IWishlistItem {
  productId: string;
  title: string;
  author: string;
  image: string;
}

export interface IWishlistContext {
  wishlistItems: IWishlistItem[] | undefined;
  totalQuantity: number | undefined;
  refetchWishlist: () => Promise<void>;
}
export interface IcategoryContext {
  _id: string;
  name: string | undefined;
  slug: string | undefined;
}
// ...............................................................
// comments
// User info inside a comment
export interface CommentUser {
  _id: string;
  name: string;
  email: string;
}

// Book info inside a comment
export interface CommentBook {
  _id: string;
  title: string;
  author: string;
}

// Single comment object
export interface Comment {
  _id: string;
  userId: CommentUser;
  bookId: CommentBook;
  comment: string;
  rate: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Pagination info
export interface AdminCommentsPagination {
  page: number;
  totalPages: number;
  total: number;
}

// Full response from GET /admin/comments
export interface AdminCommentsResponse {
  success: boolean;
  data: Comment[];
  pagination: AdminCommentsPagination;
}

// ................................................................
export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string; // أو Date إذا تريد تحويله مباشرة
  __v: number;
}

// .................................................................
//orders

export interface Order {
  _id: string;
  orderNumber?: string;
  userId: OrderUser | string; 
  totalPrice: number;
  status: string;
  transactionRef?: string;
  paypalOrderId?: string;
  createdAt: string;
}

export interface OrderUser {
  _id: string;
  name: string;
  email?: string;
}

export interface Stats {
  categoryid?: string;
  _id?: string;
  categoryname: string;
  totalSold: number;
}
