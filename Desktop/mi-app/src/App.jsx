import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [display, setDisplay] = useState("");

  const safeAppend = (valor) => {
    if (display === "Error") setDisplay(String(valor));
    else setDisplay((d) => d + String(valor));
  };

  const clear = () => setDisplay("");

  const backspace = () => setDisplay((d) => (d ? d.slice(0, -1) : ""));

  const evaluate = () => {
    try {
      // Normalizar símbolos a operadores JS
      const expr = display.replace(/×/g, "*").replace(/÷/g, "/");
      if (/\/0(?!\d)/.test(expr)) return setDisplay("Error");
      // Evaluación en entorno restringido
      // eslint-disable-next-line no-new-func
      const resultado = Function(`"use strict"; return (${expr})`)();
      setDisplay(String(resultado));
    } catch {
      setDisplay("Error");
    }
  };

  // Soporte de teclado
  useEffect(() => {
    const onKey = (e) => {
      const k = e.key;
      if (/^[0-9]$/.test(k)) return safeAppend(k);
      if (k === ".") return safeAppend(".");
      if (k === "+" || k === "-" || k === "*" || k === "/") return safeAppend(k);
      if (k === "Enter") return evaluate();
      if (k === "Backspace") return backspace();
      if (k === "Escape") return clear();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [display]);

  const buttons = [
    { label: "C", action: clear, type: "control", row: 1, col: 1 },
    { label: "Del", action: backspace, type: "control", row: 1, col: 2 },
    { label: "7", action: () => safeAppend(7), type: "num", row: 2, col: 1 },
    { label: "÷", action: () => safeAppend("÷"), type: "op", row: 1, col: 4 },
    

    { label: "8", action: () => safeAppend(8), type: "num", row: 2, col: 2 },
    { label: "9", action: () => safeAppend(9), type: "num", row: 2, col: 3 },
    { label: "x", action: () => safeAppend("×"), type: "op", row: 2, col: 4 },
    { label: "4", action: () => safeAppend(4), type: "num", row: 3, col: 1 },

    { label: "5", action: () => safeAppend(5), type: "num", row: 3, col: 2 },
    { label: "6", action: () => safeAppend(6), type: "num", row: 3, col: 3 },
    { label: "-", action: () => safeAppend("-"), type: "op", row: 3, col: 4 },
    { label: "1", action: () => safeAppend(1), type: "num", row: 4, col: 1 },

    { label: "2", action: () => safeAppend(2), type: "num", row: 4, col: 2 },
    { label: "3", action: () => safeAppend(3), type: "num", row: 4, col: 3 },
    { label: "+", action: () => safeAppend("+"), type: "op", row: 4, col: 4 },
    // row 4 col 4 intentionally left empty to match visual spacing

    { label: "0", action: () => safeAppend(0), type: "num", row: 5, col: 1, colSpan: 2 },
    { label: ".", action: () => safeAppend('.'), type: "num", row: 5, col: 3 },
    { label: "=", action: evaluate, type: "accent", row: 5, col: 4 },
  ];

  return (
    <main className="app">
      <section className="calculator" role="application" aria-label="Calculadora">
        <div className="header">
          <h1 className="title">Calculadora</h1>
        </div>

        <div className="screen" aria-live="polite">
          <input
            className="display"
            value={display}
            readOnly
            aria-label="Entrada de calculadora"
          />
        </div>

        <div className="pad">
          {buttons.map((b, i) => (
            <button
              key={i}
              className={`btn ${b.type ? `btn--${b.type}` : ""}`}
              onClick={b.action}
              aria-label={`Botón ${b.label}`}
              style={{
                gridRow: b.row,
                gridColumn: b.colSpan ? `${b.col} / span ${b.colSpan}` : b.col,
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
