import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://novel-list-backend-production.up.railway.app/api/v1",
  // baseURL: "http://localhost:5000/api/v1",
  timeout: 30000,
});

export default axiosInstance;



// axiosInstance.interceptors.request.use((config)=>{
//   const {token} = useAuth();// dont work because hooks cant be used outside components
//   if(token){
//     config.headers.Authorization = `bearer ${token}`
//   }
//   return config;
// })

// export function setAuthToken(token: string | null) {
//   axiosInstance.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
// }

//default تعنى بشكل افتراضى تضع بعدها ما تريد تعيينة افتراضيا

// headers.common → رؤوس تُرسل مع جميع أنواع الطلبات.

// headers.get → رؤوس تُرسل فقط مع طلبات GET.

// headers.post → رؤوس تُرسل فقط مع طلبات POST.

// وهكذا...