import { v4 as uuidv4 } from "uuid";
import type {
  signupfields,
  signinfields,
  Iinputsproduct,
} from "./interfaces";

// ثم تستخدمها في الكود

export const signupInputfields: signupfields[] = [
  {
    id: uuidv4(),
    name: "name",
    label: "name",
    type: "text",
    placeholder: "enter your name",
  },
  {
    id: uuidv4(),
    name: "email",
    label: "email",
    type: "email",
    placeholder: "example@mail.com",
  },
  {
    id: uuidv4(),
    name: "password",
    label: "password",
    type: "password",
    placeholder: "••••••••",
  },
  {
    id: uuidv4(),
    name: "confirmPassword",
    label: "confirm password",
    type: "password",
    placeholder: "••••••••",
  },
];
export const signinInputfields: signinfields[] = [
  {
    id: uuidv4(),
    name: "email",
    label: "email",
    type: "email",
    placeholder: "example@mail.com",
  },
  {
    id: uuidv4(),
    name: "password",
    label: "password",
    type: "password",
    placeholder: "••••••••",
  },
];
// .....................
// const image = "https://bit.ly/3X5J2TP";
// export const products: IProduct[] = [
//   {
//     id: "6906f380fae8b9e3e212559c",
//     title: "Galactic Horizons: A Sci-Fi Odyssey",
//     // slug: "galactic-horizons-a-sci-fi-odyssey",
//     description: "An epic science fiction adventure...",
//     author: "Omar Khaled",
//     quantity: 40,
//     price: 120,
//     priceAfterDiscount: 95,
//     ratings: 3.5,
//     imageCover: "https://bit.ly/3X5J2TP",
//     image: "https://bit.ly/3X5J2TP",
//     pdfLink:
//       "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//     category: "Science",
//     subcategory: "6906f352fae8b9e3e2125598",
//     createdAt: "2023-10-25",
//     updatedAt: "2023-10-25",
//   },
//   {
//     id: "6906f380fae8b9e3e212559d",
//     title: "The Dragon Realm Chronicles",
//     // slug: "the-dragon-realm-chronicles",
//     description: "A thrilling fantasy saga...",
//     author: "Mona Adel",
//     quantity: 35,
//     price: 110,
//     priceAfterDiscount: 90,
//     ratings: 4.5,
//     imageCover: "https://bit.ly/3X5J2TP",
//     image: "https://bit.ly/3X5J2TP",
//     pdfLink:
//       "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//     category: "Fantasy",
//     subcategory: "6906f352fae8b9e3e2125598",
//     createdAt: "2023-10-25",
//     updatedAt: "2023-10-25",
//   },
//   {
//     id: "6906f380fae8b9e3e212559e",
//     title: "The Silent Detective: A Mystery Novel",
//     // slug: "the-silent-detective-a-mystery-novel",
//     description: "A gripping mystery...",
//     author: "Ahmed Saeed",
//     quantity: 50,
//     price: 100,
//     priceAfterDiscount: 80,
//     ratings: 4.75,
//     imageCover: "https://bit.ly/3X5J2TP",
//     image: "https://bit.ly/3X5J2TP",
//     pdfLink:
//       "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//     category: "Mystery",
//     subcategory: "6906f352fae8b9e3e2125598",
//     createdAt: "2023-10-25",
//     updatedAt: "2023-10-25",
//   },
//   {
//     id: "6906f380fae8b9e3e212559f",
//     title: "Letters of the Heart: A Romance Story",
//     // slug: "letters-of-the-heart-a-romance-story",
//     description: "A heartwarming romance...",
//     author: "Sara Mahmoud",
//     quantity: 28,
//     price: 95,
//     priceAfterDiscount: 75,
//     ratings: 4,
//     imageCover: "https://bit.ly/3X5J2TP",
//     image: "https://bit.ly/3X5J2TP",
//     pdfLink:
//       "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//     category: "Romance",
//     subcategory: "6906f352fae8b9e3e2125598",
//     createdAt: "2023-10-25",
//     updatedAt: "2023-10-25",
//   },
  
// ];
export const inputsproductData: Iinputsproduct[] = [
  {
    id: uuidv4(),
    name: "title",
    label: "Book Title",
    placeholder: "Enter the book title",
    type: "text",
  },

  {
    id: uuidv4(),
    name: "author",
    label: "Author Name",
    placeholder: "Enter the author name",
    type: "text",
  },
  {
    id: uuidv4(),
    name: "description",
    label: "Description",
    placeholder: "Enter a short description",
    type: "textarea", // نستخدم textarea بدل text لو حابب
  },
  {
    id: uuidv4(),
    name: "price",
    label: "Price",
    placeholder: "Enter the price",
    type: "number",
    registerOptions: {
      valueAsNumber: true,
    },
  },
  {
    id: uuidv4(),
    name: "quantity",
    label: "Quantity",
    placeholder: "Enter the available quantity",
    type: "number",
    registerOptions: {
      valueAsNumber: true,
    },
  },
  {
    id: uuidv4(),
    name: "category",
    label: "Category",
    placeholder: "Enter book category",
    type: "text",
  },
  {
    id: uuidv4(),
    name: "imageCover",
    label: "imageCover",
    placeholder: "upload image cover",
    type: "file",
  },
  {
    id: uuidv4(),
    name: "pdfLink",
    label: "pdf file",
    placeholder: "upload pdf file",
    type: "file",
  },
];
