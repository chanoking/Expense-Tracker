import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import "../css/login.css";
import type { SignupForm } from "../types/Auth";

function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>();

  const onSubmit = async (data: SignupForm) => {
    try {
      const res = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message ?? '회원가입에 실패했습니다.');
        return;
      }

      alert('회원가입이 완료되었습니다.');
    } catch {
      alert('서버에 연결할 수 없습니다.');
    }
  };

  return (
    <main className="login-page">
      <header className="login-header">
        <h1 className="logo">Expense Tracker</h1>
      </header>

      <section className="login-box" aria-labelledby="signup-title">
        <h2 id="signup-title" className="screen-out">
          회원가입
        </h2>

        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <label className="screen-out" htmlFor="name">
            이름
          </label>
          <input
            id="name"
            type="text"
            placeholder="Name"
            {...register("name", {
              required: "이름을 입력해주세요.",
            })}
          />
          {errors.name && (
            <span className="input-error">{errors.name.message}</span>
          )}

          <label className="screen-out" htmlFor="email">
            이메일
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "이메일을 입력해주세요.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "올바른 이메일 형식이 아닙니다.",
              },
            })}
          />
          {errors.email && (
            <span className="input-error">{errors.email.message}</span>
          )}

          <label className="screen-out" htmlFor="password">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "비밀번호를 입력해주세요.",
              minLength: {
                value: 8,
                message: "비밀번호는 8자 이상이어야 합니다.",
              },
            })}
          />
          {errors.password && (
            <span className="input-error">{errors.password.message}</span>
          )}

          <label className="screen-out" htmlFor="passwordConfirm">
            비밀번호 확인
          </label>
          <input
            id="passwordConfirm"
            type="password"
            placeholder="Confirm Password"
            {...register("passwordConfirm", {
              required: "비밀번호 확인을 입력해주세요.",
              validate: (value) =>
                value === watch("password") || "비밀번호가 일치하지 않습니다.",
            })}
          />
          {errors.passwordConfirm && (
            <span className="input-error">{errors.passwordConfirm.message}</span>
          )}

          <button type="submit" className="login-button">
            Sign Up
          </button>
        </form>

        <div className="login-links">
          <Link to="/login">Log In</Link>
        </div>
      </section>
    </main>
  );
}

export default Signup;
