"use client";

interface LoaderProps{
    size?:number
}

import { ClipLoader } from "react-spinners";


export const Loader = ({size = 50}:LoaderProps) => {
  return <ClipLoader color="#3498db" size={50} />;
};
