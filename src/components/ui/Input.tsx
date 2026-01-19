function Input({
  ...rest
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
  let baseClass =
    "border-2 border-gray-500 w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

  // إذا كان نوع الحقل ملف
  if (rest.type === "file") {
    baseClass += " cursor-pointer bg-gray-100"; // تنسيق إضافي لحقول الملفات
  }

  return <input className={baseClass} {...rest} />;
}

export default Input;
