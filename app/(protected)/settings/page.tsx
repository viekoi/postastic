import { Loader } from "@/components/Loader";
import Edit from "@/components/protected/forms/profile/edit";
import { currentUser } from "@/lib/user";

const page = async () => {
  const user = await currentUser();

  if(!user){
    return <Loader/>
  }
  return <Edit id={user.id} />;
};

export default page;
