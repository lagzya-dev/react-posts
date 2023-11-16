import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import axios from "../../axios";

export const AddPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [value, setValue] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [tags, setTags] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const inputRef = React.useRef(null);
  const isAuth = useSelector(selectIsAuth);
  const isEditing = Boolean(id);
  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      formData.append("image", event.target.files[0]);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (e) {
      console.log(e);
    }
  };

  const onClickRemoveImage = async () => {
    setImageUrl("");
    inputRef.target.files = [];
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const fields = {
        title,
        tags: tags.split(" ").map((tag) => tag.trim()),
        text: value,
        imageUrl,
      };
      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);

      const ids = isEditing ? id : data._id;
      navigate(`/posts/${ids}`);
    } catch (e) {
      console.warn(e);
      alert("Ошибка при сохранении статьи");
    }
  };
  const onChange = React.useCallback((value) => {
    setValue(value);
  }, []);
  React.useEffect(() => {
    if (id) {
      console.log(1231231);
      setIsLoading(true);
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setTags(data.tags.join(" "));
          setValue(data.text);
          setImageUrl(data.imageUrl);
        })
        .catch((err) => console.log(err));
    }
  }, []);
  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );
  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/login" />;
  }
  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputRef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input ref={inputRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`https://lagzya.top:4444${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={value}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Сохранить" : "Опубликовать"}
        </Button>
        <Link to="/">
          <Button size="large">Отмена</Button>
        </Link>
      </div>
    </Paper>
  );
};
