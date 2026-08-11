"use client";

// items: array de nomes (strings)
// values: objeto { [nome]: { status, obs } }
// onChange(nome, patch) - patch é { status } ou { obs }
// showNA: se true, mostra o botão "NA"
// obsPlaceholder: texto do campo de observação
export default function ItemsEditor({ items, values, onChange, showNA = true, obsPlaceholder }) {
  return (
    <div>
      {items.map((name, idx) => {
        const current = values[name] || { status: null, obs: "" };
        return (
          <div className="item-card" key={name}>
            <div className="item-top">
              <span className="item-idx">{idx + 1}</span>
              <span className="item-name" style={{ flex: 1 }}>
                {name}
              </span>
            </div>
            <div className="segmented">
              <button
                type="button"
                className={"segbtn c" + (current.status === "C" ? " active" : "")}
                onClick={() => onChange(name, { status: "C" })}
              >
                C
              </button>
              <button
                type="button"
                className={"segbtn nc" + (current.status === "NC" ? " active" : "")}
                onClick={() => onChange(name, { status: "NC" })}
              >
                NC
              </button>
              {showNA && (
                <button
                  type="button"
                  className={"segbtn na" + (current.status === "NA" ? " active" : "")}
                  onClick={() => onChange(name, { status: "NA" })}
                >
                  NA
                </button>
              )}
            </div>
            <div className="item-obs">
              <input
                type="text"
                value={current.obs || ""}
                placeholder={obsPlaceholder || "Observação (opcional)"}
                onChange={(e) => onChange(name, { obs: e.target.value })}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
