import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchTags } from "../redux/slices/posts";
import { PostSkeleton } from "../components/Post/Skeleton";
export const Home = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchTags());
    dispatch(fetchPosts());
    console.log(123);
  }, []);
  const { posts, tags } = useSelector((state) => state.postReducer);
  const data = useSelector((state) => state.authReducer.data);
  const isLoadingPosts = posts.status === "loading";
  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={0}
        aria-label="basic tabs example"
      >
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {isLoadingPosts
            ? [...Array(5)].map(() => <Post isLoading={true} />)
            : posts.items.map((obj) => (
                <Post
                  id={obj._id}
                  title={obj.title}
                  imageUrl={
                    obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ""
                  }
                  user={{
                    avatarUrl: obj.user.avatarUrl,
                    fullName: obj.user.fullName,
                  }}
                  createdAt={obj.createdAt}
                  viewsCount={obj.viewCount}
                  commentsCount={3}
                  tags={obj.tags}
                  isEditable={data ? obj.user._id === data._id : false}
                  isLoading={isLoadingPosts}
                />
              ))}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={false} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: "Вася Пупкин",
                  avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                },
                text: "Это тестовый комментарий",
              },
              {
                user: {
                  fullName: "Иван Иванов",
                  avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                },
                text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
