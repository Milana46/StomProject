import React, { useMemo, useState } from "react";
import "./App.css";

const EXAMPLES = [
  { diagnosis: "флегмона", microorganism: "sep" },
  { diagnosis: "абсцесс", microorganism: "sau" },
  { diagnosis: "остеомиелит", microorganism: "kpn" },
];

const DIAGNOSES = [
  "флегмона",
  "абсцесс",
  "остеомиелит",
  "фурункул",
];

const MICROBES = ["sep", "sau", "svi", "kpn", "sap"];

function formatProb(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  return num.toFixed(3);
}

function scoreClass(ps) {
  const n = Number(ps);
  if (n >= 0.55) return "high";
  if (n >= 0.35) return "mid";
  return "low";
}

export default function App() {
  const [diagnosis, setDiagnosis] = useState("");
  const [microorganism, setMicroorganism] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);

  const bugs = useMemo(() => {
    const count = 55;
    return Array.from({ length: count }).map((_, i) => {
      const size = 8 + Math.random() * 22;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const dur = 10 + Math.random() * 22;
      const delay = -Math.random() * dur;
      const drift = 10 + Math.random() * 40;
      const rot = Math.random() * 360;
      const type = Math.random() < 0.6 ? "coccus" : "bacillus";
      return { id: i, size, left, top, dur, delay, drift, rot, type };
    });
  }, []);

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/predict";

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setData(null);
    setLoading(true);
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagnosis, microorganism }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || "Request failed");
      }
      setData(json);
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setLoading(false);
    }
  }

  function applyExample(item) {
    setDiagnosis(item.diagnosis);
    setMicroorganism(item.microorganism);
    setErr("");
  }

  return (
    <div className="page">
      <div className="bgMany" aria-hidden="true">
        {bugs.map((b) => (
          <span
            key={b.id}
            className={`bug ${b.type}`}
            style={{
              left: `${b.left}%`,
              top: `${b.top}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              animationDuration: `${b.dur}s`,
              animationDelay: `${b.delay}s`,
              "--drift": `${b.drift}px`,
              "--rot": `${b.rot}deg`,
            }}
          />
        ))}
        <div className="grain" />
      </div>
      <div className="bg">
        <div className="blob b1"></div>
        <div className="blob b2"></div>
        <div className="blob b3"></div>
        <div className="blob b4"></div>
        <div className="blob b5"></div>
        <div className="grain"></div>
      </div>

      <header className="topbar">
        <div className="brand">
          <span className="brandMark">ЧЛХ</span>
          <span>ИИ-система</span>
        </div>
        <nav className="nav">
          <a href="#advantages">Преимущества</a>
          <a href="#how">Как работает</a>
          <a href="#try">Попробовать</a>
        </nav>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <h1 className="heroTitle">
            Интеллектуальная система для оптимизации антимикробной терапии
            в челюстно-лицевой хирургии
          </h1>
          <p className="heroText">
            Введите диагноз и микроорганизм — нейросеть оценит чувствительность S / I / R
            и ранжирует препараты от наиболее действенного к менее действенному.
          </p>
          <div className="heroActions">
            <a className="btn" href="#try">Попробовать сейчас</a>
            <a className="btnGhost" href="#advantages">Смотреть преимущества</a>
          </div>
          <div className="heroStats">
            <div>
              <b>Top-15</b>
              <span>ранжированный список</span>
            </div>
            <div>
              <b>S / I / R</b>
              <span>вероятности классов</span>
            </div>
            <div>
              <b>1 запрос</b>
              <span>диагноз + микроорганизм</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="advantages">
        <h2 className="sectionTitle">Преимущества</h2>
        <p className="sectionLead">Три причины, почему системе есть место в клинической практике.</p>
        <div className="grid">
          <article className="feature">
            <span className="featureIcon">01</span>
            <h3>Выигрыш во времени почти в 2 раза</h3>
            <p>Подбор терапии занимает меньше времени: врач сразу видит ранжированный Top-15, а не перебирает справочники вручную.</p>
          </article>
          <article className="feature">
            <span className="featureIcon">02</span>
            <h3>Оптимизированность и гибкость</h3>
            <p>Решение подстраивается под конкретный диагноз и микроорганизм, а не предлагает один фиксированный протокол на все случаи.</p>
          </article>
          <article className="feature">
            <span className="featureIcon">03</span>
            <h3>Нет прямых конкурентов</h3>
            <p>Для челюстно-лицевой хирургии это узкоспециализированный ИИ-инструмент: аналогичных систем подбора антимикробной терапии практически нет.</p>
          </article>
        </div>
      </section>

      <section className="section" id="how">
        <h2 className="sectionTitle">Как работает система</h2>
        <div className="steps">
          <div className="step">
            <b>1</b>
            <h3>Ввод</h3>
            <p>Диагноз и микроорганизм уходят на сервер одним запросом.</p>
          </div>
          <div className="step">
            <b>2</b>
            <h3>Оценка</h3>
            <p>Нейросеть считает P(R), P(I), P(S) для каждого известного антибиотика.</p>
          </div>
          <div className="step">
            <b>3</b>
            <h3>Рейтинг</h3>
            <p>Препараты сортируются по ожидаемому баллу и возвращаются как Top-15.</p>
          </div>
        </div>
      </section>

      <section className="section" id="try">
        <div className="card">
          <h2 className="title">Попробуйте расчёт</h2>
          <p className="subtitle">
            Выберите диагноз и микроорганизм или готовую пару — система вернёт Top-15 антибиотиков
            с оценкой S / I / R.
          </p>

          <p className="fieldHint">Готовые пары из таблицы</p>
          <div className="chips">
            {EXAMPLES.map((item) => (
              <button
                key={`${item.diagnosis}-${item.microorganism}`}
                type="button"
                className="chip"
                onClick={() => applyExample(item)}
              >
                {item.diagnosis} · {item.microorganism}
              </button>
            ))}
          </div>

          <p className="fieldHint">Диагнозы</p>
          <div className="chips">
            {DIAGNOSES.map((item) => (
              <button
                key={item}
                type="button"
                className={`chip ${diagnosis === item ? "chipActive" : ""}`}
                onClick={() => setDiagnosis(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <p className="fieldHint">Микроорганизмы</p>
          <div className="chips">
            {MICROBES.map((item) => (
              <button
                key={item}
                type="button"
                className={`chip ${microorganism === item ? "chipActive" : ""}`}
                onClick={() => setMicroorganism(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <label className="label">
              Диагноз
              <input
                className="input"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Напр.: флегмона"
                required
              />
            </label>
            <label className="label">
              Микроорганизм
              <input
                className="input"
                value={microorganism}
                onChange={(e) => setMicroorganism(e.target.value)}
                placeholder="Напр.: sep"
                required
              />
            </label>
            <button className="btn" disabled={loading}>
              {loading ? "Рассчитываем..." : "Получить рекомендации"}
            </button>
            {err && <div className="error">Ошибка: {err}</div>}
          </form>
        </div>

        {data && (
          <div className="card resultsCard">
            <h2 className="title2">Результаты</h2>
            <div className="meta">
              <div><b>Диагноз:</b> {data.diagnosis}</div>
              <div><b>Микроорганизм:</b> {data.microorganism}</div>
            </div>
            <div className="tableWrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Антибиотик</th>
                    <th>P(S)</th>
                    <th>P(I)</th>
                    <th>P(R)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.top15.map((row, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{row["Антибиотик"]}</td>
                      <td className={scoreClass(row["P(S)"])}>{formatProb(row["P(S)"])}</td>
                      <td>{formatProb(row["P(I)"])}</td>
                      <td>{formatProb(row["P(R)"])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="hint">
              Примечание: это инструмент поддержки решений и не заменяет врача.
            </p>
          </div>
        )}
      </section>

      <footer className="footer">
        Инструмент поддержки клинических решений. Не является медицинским назначением.
      </footer>
    </div>
  );
}
