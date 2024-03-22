// "use client";
// import { useNewPostModal } from "@/hooks/use-modal-store";
// import React from "react";

// import NewForm from "./new-form";
// import Edit from "../edit/edit";
// import { QUERY_KEYS } from "@/queries/react-query/query-keys";

// const Form = () => {
//   const { postId } = useNewPostModal();

//   if (!postId) {
//     return <NewForm />;
//   }

//   return <Edit id={postId} queryKey={[QUERY_KEYS.GET_HOME_POSTS]} />;
// };

// export default Form;
