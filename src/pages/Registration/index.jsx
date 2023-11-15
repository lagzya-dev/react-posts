import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import styles from "./Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRegister,
  fetchUserData,
  selectIsAuth,
} from "../../redux/slices/auth";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const { register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
    mode: "onChange",
  });
  const onSubmit = async (values) => {
    console.log(values);
    const { payload } = await dispatch(fetchRegister(values));

    console.log(payload);
    if (!payload) {
      alert("Ошибка");
      return;
    }
    window.localStorage.setItem("token", payload.token);
  };
  if (isAuth) {
    return <Navigate to="/" />;
  }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          error={Boolean(formState.errors.fullName?.message)}
          helperText={formState.errors.fullName?.message}
          {...register("fullName", { required: "Укажите имя" })}
          className={styles.field}
          label="Полное имя"
          fullWidth
        />
        <TextField
          error={Boolean(formState.errors.email?.message)}
          helperText={formState.errors.email?.message}
          {...register("email", { required: "Укажите почту" })}
          className={styles.field}
          label="E-Mail"
          fullWidth
        />
        <TextField
          error={Boolean(formState.errors.password?.message)}
          helperText={formState.errors.password?.message}
          {...register("password", { required: "Укажите пароль" })}
          className={styles.field}
          label="Пароль"
          fullWidth
        />
        <Button
          disable={!formState.isValid}
          type="sumbit"
          size="large"
          variant="contained"
          fullWidth
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
