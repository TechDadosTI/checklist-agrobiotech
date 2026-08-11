"use client";

export default function VeiculosTab({ plates, onSavePlates }) {
  function updatePlate(idx, field, value) {
    const next = plates.map((p, i) =>
      i === idx ? { ...p, [field]: field === "placa" ? value.toUpperCase() : value } : p
    );
    onSavePlates(next);
  }

  function removePlate(idx) {
    const next = plates.filter((_, i) => i !== idx);
    onSavePlates(next);
  }

  function addPlate() {
    onSavePlates([...plates, { placa: "NOVA-PLACA", modelo: "" }]);
  }

  return (
    <div className="view active">
      <div className="card">
        <h2>
          <span className="num">V</span> Veículos cadastrados
        </h2>
        <div className="platelist">
          {plates.map((p, idx) => (
            <div className="plate-row" key={idx}>
              <input
                type="text"
                value={p.placa}
                placeholder="Placa"
                onChange={(e) => updatePlate(idx, "placa", e.target.value)}
              />
              <input
                type="text"
                className="modelo"
                value={p.modelo || ""}
                placeholder="Modelo do veículo"
                onChange={(e) => updatePlate(idx, "modelo", e.target.value)}
              />
              <button type="button" onClick={() => removePlate(idx)}>
                Remover
              </button>
            </div>
          ))}
        </div>
        <button
          className="btn secondary small"
          style={{ marginTop: 12 }}
          type="button"
          onClick={addPlate}
        >
          + Adicionar veículo
        </button>
      </div>
    </div>
  );
}
