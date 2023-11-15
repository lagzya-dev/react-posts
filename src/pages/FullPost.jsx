import React from "react";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams } from "react-router-dom";
import axios from "../axios";
import ReactMarkdown from "react-markdown";
export const FullPost = () => {
  const [data, setData] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const { id } = useParams();
  React.useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setIsLoading(false);
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  if (isLoading) {
    return <Post isLoading={true} />;
  }
  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={`http://localhost:4444${data.imageUrl}`}
        user={{
          avatarUrl: data.avatarUrl,
          fullName: data.user.fullName,
        }}
        createdAt={"12 июня 2022 г."}
        viewsCount={data.viewCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Вася Пупкин",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Это тестовый комментарий 555555",
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
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
