import type { ReactNode } from "react";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  classname?: string;
  children: ReactNode;
}

function Button(props: IProps) {
  const { classname, children,...rest } = props;

  return (
    <button className={`w-full rounded-md py-2 capitalize cursor-pointer  ${classname}`}
    {...rest}>
      {children}
    </button>
  );
}

export default Button;


// import { ReactNode } from "react";

// interface IProps {
//   classname: string;
//   children: ReactNode;
//   onclick:()=> void
// }

// function Button(props: IProps) {
//   const { classname, children,onclick } = props;

//   return (
//     <button className={`${classname} w-full rounded-md py-1.5 uppercase cursor-pointer text-white`}
//     onClick={onclick}>
//       {children}
//     </button>
//   );
// }

// export default Button;
