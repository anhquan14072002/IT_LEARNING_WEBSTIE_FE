import React, { useContext, useState } from "react";

import PostAnswer from "./PostAnswer";
import PostQuestion from "./PostQuestion";
import PostContext from "../../store/PostContext";
import { useSelector } from "react-redux";

function PostContentItemList() {
  const { posts, refresh } = useContext(PostContext);
  const user = useSelector((state) => state.user.value);

  return (
    <div className="flex flex-col gap-3" key={refresh}>
      {posts.length === 0 ? (
        <h1 className="text-2xl  m-5">Không có bài đăng nào </h1>
      ) : (
        posts.map((post) => (
          <div
            className="border-stone-200 border-2 flex flex-col rounded"
            key={post.id}
          >
            <PostQuestion
              post={post}
              isFavoritePost={
                post?.favoritePosts?.findIndex(
                  (e) => e?.userId === user?.sub
                ) !== -1
              }
            />
            <PostAnswer post={post} />
          </div>
        ))
      )}
    </div>
  );
}

export default PostContentItemList;
