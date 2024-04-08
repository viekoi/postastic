import UserProfile from "@/components/protected/user/user-profile";

const page = async ({ params }: { params: { id: string } }) => {
  return <UserProfile id={params.id} />;
};

export default page;
