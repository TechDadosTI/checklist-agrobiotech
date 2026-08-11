"use client";

import Image from "next/image";
import { VEHICLE_IMAGES } from "@/lib/constants";

export default function PlateSelect({ plates, value, onChange, id }) {
  const src = VEHICLE_IMAGES[value];
  return (
    <div className="field">
      <label>Placa</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {plates.map((p) => (
          <option key={p.placa} value={p.placa}>
            {p.placa} — {p.modelo || "sem modelo"}
          </option>
        ))}
      </select>
      {src && (
        <div style={{ marginTop: 12, display: "block", textAlign: "center" }}>
          <Image
            src={src}
            alt={value}
            width={280}
            height={170}
            style={{ width: "100%", maxWidth: 280, height: "auto", display: "block", margin: "0 auto" }}
          />
        </div>
      )}
    </div>
  );
}
