import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import "../css/login.css";
import type { LoginForm } from "../types/Auth";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message ?? '로그인에 실패했습니다.');
        return;
      }

      const { accessToken } = await res.json();
      localStorage.setItem('accessToken', accessToken);
      alert('로그인 성공!');
    } catch {
      alert('서버에 연결할 수 없습니다.');
    }
  };

  return (
    <main className="login-page">
      <header className="login-header">
        <h1 className="logo">Expense Tracker</h1>
      </header>

      <section className="login-box" aria-labelledby="login-title">
        <h2 id="login-title" className="screen-out">
          로그인
        </h2>

        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
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

          <button type="submit" className="login-button">
            Log In
          </button>
        </form>

        <div className="login-links">
          <Link to="/signup">Sign Up</Link>
          <a href="#">Find Account</a>
          <a href="#">Reset Password</a>
        </div>
      </section>
    </main>
  );
}

export default Login;
