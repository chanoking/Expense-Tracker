import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../css/main.css";

type Category = { id: number; name: string };

type Expense = {
  id: number;
  date: string;
  price: number;
  content: string | null;
  category: Category;
};

type AddExpenseForm = {
  categoryId: number;
  date: string;
  price: number;
  content?: string;
};

const API = "http://localhost:3000";

function apiFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem("accessToken");
  return fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
}

function Main() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddExpenseForm>();

  useEffect(() => {
    apiFetch("/expenses")
      .then((res) => {
        if (res.status === 401) { navigate("/login"); return null; }
        return res.json();
      })
      .then((data) => data && setExpenses(data));

    apiFetch("/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const onSubmit = async (data: AddExpenseForm) => {
    const res = await apiFetch("/expenses", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!res.ok) return;

    const newExpense = await res.json();
    setExpenses((prev) => [newExpense, ...prev]);
    setShowModal(false);
    reset();
  };

  const totalThisMonth = expenses
    .filter((e) => e.date.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((sum, e) => sum + e.price, 0);

  const formatDate = (iso: string) => iso.slice(0, 10);

  return (
    <div className="main-page">
      <header className="main-header">
        <h1 className="logo">Expense Tracker</h1>
        <div className="header-right">
          <button className="logout-button" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </header>

      <div className="main-content">
        <div className="summary-grid">
          <div className="summary-card">
            <p className="label">이번 달 총 지출</p>
            <p className="amount">
              {totalThisMonth.toLocaleString()}
              <span>원</span>
            </p>
          </div>
          <div className="summary-card">
            <p className="label">전체 지출 건수</p>
            <p className="amount">
              {expenses.length}
              <span>건</span>
            </p>
          </div>
          <div className="summary-card">
            <p className="label">이번 달 지출 건수</p>
            <p className="amount">
              {expenses.filter((e) =>
                e.date.startsWith(new Date().toISOString().slice(0, 7))
              ).length}
              <span>건</span>
            </p>
          </div>
        </div>

        <div className="section-header">
          <h2 className="section-title">최근 지출</h2>
          <button className="add-button" onClick={() => setShowModal(true)}>
            + 지출 추가
          </button>
        </div>

        <div className="expense-list">
          <div className="expense-list-header">
            <span>날짜</span>
            <span>내용</span>
            <span>카테고리</span>
            <span style={{ textAlign: "right" }}>금액</span>
          </div>
          {expenses.length === 0 ? (
            <p className="expense-empty">등록된 지출이 없습니다.</p>
          ) : (
            expenses.map((expense) => (
              <div key={expense.id} className="expense-item">
                <span className="date">{formatDate(expense.date)}</span>
                <span className="content">{expense.content ?? "-"}</span>
                <span className="category">{expense.category.name}</span>
                <span className="price">
                  {expense.price.toLocaleString()}원
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">지출 추가</h2>
            <form className="modal-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-field">
                <label htmlFor="date">날짜</label>
                <input
                  id="date"
                  type="date"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  {...register("date", { required: true })}
                />
              </div>
              <div className="form-field">
                <label htmlFor="price">금액 (원)</label>
                <input
                  id="price"
                  type="number"
                  placeholder="0"
                  min={1}
                  {...register("price", { required: true, min: 1 })}
                />
                {errors.price && (
                  <span className="input-error">금액을 입력해주세요.</span>
                )}
              </div>
              <div className="form-field">
                <label htmlFor="content">내용</label>
                <input
                  id="content"
                  type="text"
                  placeholder="지출 내용"
                  {...register("content")}
                />
              </div>
              <div className="form-field">
                <label htmlFor="categoryId">카테고리</label>
                <select
                  id="categoryId"
                  {...register("categoryId", { required: true })}
                >
                  <option value="">선택해주세요</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <span className="input-error">카테고리를 선택해주세요.</span>
                )}
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() => { setShowModal(false); reset(); }}
                >
                  취소
                </button>
                <button type="submit" className="modal-submit">
                  추가하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
