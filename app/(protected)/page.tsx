import PostFormCard from "@/components/protected/cards/post-form-card";
import PostContainer from "@/components/protected/containers/post/post-container";
import { InfiniteMediasQueryKeyBuilder } from "@/lib/utils";
import { getInfiniteMedias } from "@/actions/get-infinite-medias";
const Home = async () => {
  return (
    <>
      <PostFormCard />
      <PostContainer
        route={"home"}
        queryFn={getInfiniteMedias}
      />
    </>
  );
};

export default Home;
