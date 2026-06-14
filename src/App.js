import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const C = {
  navy: "#1a2744",
  navyL: "#243561",
  gold: "#c9a84c",
  bg: "#f0f3f8",
  white: "#fff",
  green: "#1a7f4b",
  greenBg: "#d1fae5",
  amber: "#b45309",
  amberBg: "#fef3c7",
  red: "#991b1b",
  redBg: "#fee2e2",
  text: "#1e293b",
  muted: "#64748b",
  border: "#e2e8f0",
};
const PIE_C = ["#e53e3e", "#d97706", "#1a2744", "#1a7f4b"];

const safe = (n, d = 0) => (isFinite(n) && !isNaN(n) ? n : d);
const pctOf = (a, b) => (b > 0 ? safe((a / b) * 100) : 0);
const fmt = (n) =>
  `₹${Math.abs(safe(n)).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const fmtS = (n) => `${n >= 0 ? "+" : "−"}${fmt(n)}`;
const fmtP = (n) => `${safe(n).toFixed(1)}%`;
const fmtL = (v) => `₹${(v / 100000).toFixed(1)}L`;

const bench = (t, v) => {
  if (t === "food") return v <= 30 ? "e" : v <= 35 ? "g" : "w";
  if (t === "bev") return v <= 24 ? "e" : v <= 28 ? "g" : "w";
  if (t === "lab") return v <= 35 ? "e" : v <= 40 ? "g" : "w";
};
const BS = {
  e: { bg: "#1a7f4b", t: "#fff", label: "✅ Excellent" },
  g: { bg: "#b45309", t: "#fff", label: "⚠️ Good" },
  w: { bg: "#991b1b", t: "#fff", label: "🔴 Warning" },
};

const Card = ({ children, style }) => (
  <div
    style={{
      background: C.white,
      borderRadius: 12,
      padding: 20,
      boxShadow: "0 1px 6px rgba(0,0,0,.07)",
      ...style,
    }}
  >
    {children}
  </div>
);
const CT = ({ children }) => (
  <div
    style={{
      fontSize: 11,
      fontWeight: 800,
      color: C.navy,
      textTransform: "uppercase",
      letterSpacing: ".6px",
      borderBottom: `2px solid ${C.gold}`,
      paddingBottom: 8,
      marginBottom: 16,
    }}
  >
    {children}
  </div>
);
const KPI = ({ icon, label, value, color = C.navy, sub }) => (
  <div
    style={{
      background: C.white,
      borderRadius: 12,
      padding: 16,
      boxShadow: "0 1px 6px rgba(0,0,0,.07)",
      borderTop: `3px solid ${color}`,
    }}
  >
    <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
    <div style={{ fontSize: 20, fontWeight: 900, color, lineHeight: 1.2 }}>
      {value}
    </div>
    <div
      style={{
        fontSize: 10,
        color: C.muted,
        marginTop: 5,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: ".3px",
      }}
    >
      {label}
    </div>
    {sub && (
      <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{sub}</div>
    )}
  </div>
);
const Inp = ({ label, value, onChange }) => (
  <div style={{ marginBottom: 11 }}>
    <label
      style={{
        display: "block",
        fontSize: 10,
        fontWeight: 700,
        color: C.muted,
        textTransform: "uppercase",
        letterSpacing: ".4px",
        marginBottom: 4,
      }}
    >
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(+e.target.value)}
      style={{
        width: "100%",
        padding: "8px 11px",
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 700,
        color: C.text,
        boxSizing: "border-box",
        background: "#fafbfc",
      }}
    />
  </div>
);
const Sldr = ({ label, value, onChange, min, max, color = C.navy }) => (
  <div style={{ marginBottom: 16 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 4,
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>
        {label}
      </span>
      <span style={{ fontSize: 14, fontWeight: 900, color }}>{value}%</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(+e.target.value)}
      style={{ width: "100%", accentColor: color, cursor: "pointer" }}
    />
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 10,
        color: C.muted,
        marginTop: 2,
      }}
    >
      <span>{min}%</span>
      <span>{max}%</span>
    </div>
  </div>
);
const Row = ({ k, v, hl }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "7px 0",
      borderBottom: `1px solid ${C.border}`,
      fontSize: 13,
    }}
  >
    <span style={{ color: C.muted }}>{k}</span>
    <span style={{ fontWeight: 700, color: hl || C.text }}>{v}</span>
  </div>
);
const SecH = ({ n, title }) => (
  <h3
    style={{
      color: C.navy,
      borderBottom: `1px solid ${C.border}`,
      paddingBottom: 8,
      marginBottom: 14,
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: ".5px",
    }}
  >
    {n}. {title}
  </h3>
);

export default function App() {
  const [tab, setTab] = useState("dash");

  // Main inputs — set to realistic luxury 5-star hotel values
  const [fRev, setFRev] = useState(1800000);
  const [bRev, setBRev] = useState(650000);
  const [oRev, setORev] = useState(150000);
  const [cov, setCov] = useState(4200);
  const [fP, setFP] = useState(28);
  const [bP, setBP] = useState(22);
  const [lP, setLP] = useState(34);
  const [oP, setOP] = useState(14);

  // Monthly / Annual toggle
  const [period, setPeriod] = useState("M");
  const mult = period === "A" ? 12 : 1;

  // Scenario
  const [sfP, setSfP] = useState(28);
  const [sbP, setSbP] = useState(22);

  // Banquet inputs — defaults inspired by ITC Grand Bharat banquet operations
  const [bqEvt, setBqEvt] = useState(18);
  const [bqPax, setBqPax] = useState(180);
  const [bqFpax, setBqFpax] = useState(2800);
  const [bqBpax, setBqBpax] = useState(900);
  const [bqFp, setBqFp] = useState(32);
  const [bqBp, setBqBp] = useState(24);

  const [wiLog, setWiLog] = useState([]);

  const c = useMemo(() => {
    const fbR = fRev + bRev,
      totR = fbR + oRev;
    const fA = (fRev * fP) / 100,
      fGP = fRev - fA;
    const bA = (bRev * bP) / 100,
      bGP = bRev - bA;
    const cos = fA + bA,
      gp = fGP + bGP;
    const lA = (totR * lP) / 100,
      oA = (totR * oP) / 100;
    const nop = gp - lA - oA,
      marg = pctOf(nop, totR);
    const avgC = safe(fbR / cov),
      cpp = safe(cos / cov),
      ppp = safe(gp / cov);
    const sfA = (fRev * sfP) / 100,
      sbA = (bRev * sbP) / 100;
    const sCos = sfA + sbA,
      sGP = fbR - sCos;
    const sNOP = sGP - lA - oA,
      sMarg = pctOf(sNOP, totR);
    const delta = sNOP - nop;
    const xtra = sCos - cos;
    const revN =
      xtra > 0 ? totR + xtra / Math.max(0.01, 1 - lP / 100 - oP / 100) : totR;
    return {
      fbR,
      totR,
      fA,
      fGP,
      bA,
      bGP,
      cos,
      gp,
      lA,
      oA,
      nop,
      marg,
      avgC,
      cpp,
      ppp,
      sfA,
      sbA,
      sCos,
      sGP,
      sNOP,
      sMarg,
      delta,
      fVar: sfP - fP,
      bVar: sbP - bP,
      revN,
      fbMarg: pctOf(gp, fbR),
    };
  }, [fRev, bRev, oRev, cov, fP, bP, lP, oP, sfP, sbP]);

  const bq = useMemo(() => {
    const totPax = bqEvt * bqPax;
    const fR = totPax * bqFpax,
      bR = totPax * bqBpax,
      totR = fR + bR;
    const fA = (fR * bqFp) / 100,
      bA = (bR * bqBp) / 100,
      cos = fA + bA,
      gp = totR - cos;
    return {
      totPax,
      fR,
      bR,
      totR,
      fA,
      bA,
      cos,
      gp,
      gpPct: pctOf(gp, totR),
      revPerEvt: safe(totR / bqEvt),
      gpPerEvt: safe(gp / bqEvt),
      revPerPax: safe(totR / totPax),
      gpPerPax: safe(gp / totPax),
      fbContrib: pctOf(gp, c.gp),
    };
  }, [bqEvt, bqPax, bqFpax, bqBpax, bqFp, bqBp, c.gp]);

  const applyWI = (id) => {
    let nf = fRev,
      nb = bRev,
      nfp = fP,
      nbp = bP,
      label = "";
    if (id === "f1") {
      nfp = Math.max(5, fP - 1);
      label = "🍽️ Food Cost −1%";
    }
    if (id === "f3") {
      nfp = Math.max(5, fP - 3);
      label = "🍽️ Food Cost −3%";
    }
    if (id === "b1") {
      nbp = Math.max(5, bP - 1);
      label = "🍷 Bev Cost −1%";
    }
    if (id === "r10") {
      nf *= 1.1;
      nb *= 1.1;
      label = "📈 Revenue +10%";
    }
    if (id === "r20") {
      nf *= 1.2;
      nb *= 1.2;
      label = "🚀 Revenue +20%";
    }
    const ntR = nf + nb + oRev;
    const ngp = nf * (1 - nfp / 100) + nb * (1 - nbp / 100);
    const nNOP = ngp - (ntR * lP) / 100 - (ntR * oP) / 100;
    setWiLog((p) => [
      {
        label,
        gp: ngp,
        nop: nNOP,
        marg: pctOf(nNOP, ntR),
        gpD: ngp - c.gp,
        nopD: nNOP - c.nop,
      },
      ...p.slice(0, 4),
    ]);
  };

  const barData = [
    { name: "Food", Revenue: fRev, Cost: c.fA, Profit: c.fGP },
    { name: "Beverage", Revenue: bRev, Cost: c.bA, Profit: c.bGP },
  ];
  const pieData = [
    { name: "Food Cost", value: Math.max(0, c.fA) },
    { name: "Bev Cost", value: Math.max(0, c.bA) },
    { name: "Labour+OpEx", value: Math.max(0, c.lA + c.oA) },
    { name: "Net Profit", value: Math.max(0, c.nop) },
  ];
  const fTrend = useMemo(
    () =>
      Array.from({ length: 11 }, (_, i) => {
        const p = 10 + i * 5;
        return {
          pct: `${p}%`,
          Profit: fRev * (1 - p / 100),
          Cost: (fRev * p) / 100,
        };
      }),
    [fRev]
  );
  const bTrend = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const p = 5 + i * 5;
        return {
          pct: `${p}%`,
          Profit: bRev * (1 - p / 100),
          Cost: (bRev * p) / 100,
        };
      }),
    [bRev]
  );
  const wfall = [
    { name: "Food Rev", v: fRev },
    { name: "Bev Rev", v: bRev },
    { name: "Other Rev", v: oRev },
    { name: "Food Cost", v: -c.fA },
    { name: "Bev Cost", v: -c.bA },
    { name: "Labour", v: -c.lA },
    { name: "OpEx", v: -c.oA },
    { name: "Net Profit", v: c.nop },
  ];
  const bqBarData = [
    { name: "Revenue", Food: bq.fR, Beverage: bq.bR },
    { name: "Cost", Food: bq.fA, Beverage: bq.bA },
    { name: "Gross Profit", Food: bq.fR - bq.fA, Beverage: bq.bR - bq.bA },
  ];

  const mCol = c.marg >= 15 ? C.green : c.marg >= 8 ? C.amber : C.red;

  const TABS = [
    { id: "dash", label: "📊 Dashboard" },
    { id: "scenario", label: "🎯 Scenario" },
    { id: "whatif", label: "💡 What-If" },
    { id: "bench", label: "📈 Benchmarks" },
    { id: "trends", label: "📉 Trends" },
    { id: "banquet", label: "🎪 Banquet" },
    { id: "edu", label: "🎓 Education" },
    { id: "report", label: "📋 Report" },
  ];

  return (
    <div
      style={{
        fontFamily: "'Segoe UI',system-ui,sans-serif",
        background: C.bg,
        minHeight: "100vh",
        color: C.text,
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          background: `linear-gradient(135deg,${C.navy} 0%,#0d1b2a 100%)`,
          color: "#fff",
          padding: "16px 22px",
          borderBottom: `3px solid ${C.gold}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>🏨</span>
          <div style={{ flex: 1 }}>
            <div
              style={{ fontSize: 17, fontWeight: 900, letterSpacing: ".3px" }}
            >
              Hotel F&B Cost Impact Calculator
            </div>
            <div
              style={{
                fontSize: 9,
                color: C.gold,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              Professional Hospitality Finance Decision Tool
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>
              Designed by Sujjwal
            </div>
            <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>
              SGT University · Hotel Management
            </div>
            <div style={{ fontSize: 9, color: C.gold, marginTop: 1 }}>
              Inspired by F&B Ops · ITC Grand Bharat
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div
        style={{
          background: "#0d1b2a",
          display: "flex",
          overflowX: "auto",
          padding: "0 10px",
          gap: 2,
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "10px 12px",
              border: "none",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 700,
              whiteSpace: "nowrap",
              borderRadius: "5px 5px 0 0",
              background: tab === t.id ? C.gold : "transparent",
              color: tab === t.id ? C.navy : "#94a3b8",
              transition: "all .15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "18px 20px" }}>
        {/* ═══ DASHBOARD ═══ */}
        {tab === "dash" && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 13,
                marginBottom: 13,
              }}
            >
              <Card>
                <CT>💰 Revenue Inputs (Monthly)</CT>
                <Inp label="Food Revenue (₹)" value={fRev} onChange={setFRev} />
                <Inp
                  label="Beverage Revenue (₹)"
                  value={bRev}
                  onChange={setBRev}
                />
                <Inp
                  label="Other Revenue (₹)"
                  value={oRev}
                  onChange={setORev}
                />
                <Inp label="Covers Served" value={cov} onChange={setCov} />
              </Card>
              <Card>
                <CT>📉 Cost Percentages</CT>
                <Sldr
                  label="Food Cost %"
                  value={fP}
                  onChange={setFP}
                  min={5}
                  max={80}
                  color={C.red}
                />
                <Sldr
                  label="Beverage Cost %"
                  value={bP}
                  onChange={setBP}
                  min={5}
                  max={60}
                  color={C.amber}
                />
                <Sldr
                  label="Labor Cost %"
                  value={lP}
                  onChange={setLP}
                  min={5}
                  max={70}
                  color={C.navy}
                />
                <Sldr
                  label="Operating Expense %"
                  value={oP}
                  onChange={setOP}
                  min={1}
                  max={50}
                  color={C.navyL}
                />
              </Card>
            </div>

            {/* Period toggle */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>
                Key Performance Indicators
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 11, color: C.muted, marginRight: 4 }}>
                  View:
                </span>
                {[
                  { id: "M", label: "Monthly" },
                  { id: "A", label: "Annual" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPeriod(p.id)}
                    style={{
                      padding: "5px 14px",
                      border: `1px solid ${
                        period === p.id ? C.navy : C.border
                      }`,
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      background: period === p.id ? C.navy : "transparent",
                      color: period === p.id ? "#fff" : C.muted,
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 11,
                marginBottom: 13,
              }}
            >
              <KPI
                icon="💵"
                label="Total Revenue"
                value={fmt(c.totR * mult)}
                color={C.navy}
                sub={period === "A" ? "Annual projection" : "This month"}
              />
              <KPI
                icon="📈"
                label="Gross Profit"
                value={fmt(c.gp * mult)}
                color={C.green}
                sub={`${fmtP(c.fbMarg)} of F&B revenue`}
              />
              <KPI
                icon="🏆"
                label="Net Operating Profit"
                value={fmt(c.nop * mult)}
                color={c.nop >= 0 ? C.green : C.red}
                sub={period === "A" ? "Annual projection" : "This month"}
              />
              <KPI
                icon="🎯"
                label="Profit Margin"
                value={fmtP(c.marg)}
                color={mCol}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 11,
                marginBottom: 13,
              }}
            >
              <Card>
                <CT>🍽️ Food Department</CT>
                <Row k="Revenue" v={fmt(fRev)} />
                <Row k="Cost Amount" v={fmt(c.fA)} hl={C.red} />
                <Row k="Gross Profit" v={fmt(c.fGP)} hl={C.green} />
                <Row k="Gross Margin" v={fmtP(100 - fP)} />
              </Card>
              <Card>
                <CT>🍷 Beverage Department</CT>
                <Row k="Revenue" v={fmt(bRev)} />
                <Row k="Cost Amount" v={fmt(c.bA)} hl={C.red} />
                <Row k="Gross Profit" v={fmt(c.bGP)} hl={C.green} />
                <Row k="Gross Margin" v={fmtP(100 - bP)} />
              </Card>
              <Card>
                <CT>👤 Per Cover Analysis</CT>
                <Row k="Covers Served" v={cov.toLocaleString("en-IN")} />
                <Row k="Avg Check / Cover" v={fmt(c.avgC)} />
                <Row k="Cost per Cover" v={fmt(c.cpp)} hl={C.red} />
                <Row k="Profit per Cover" v={fmt(c.ppp)} hl={C.green} />
              </Card>
            </div>

            <Card style={{ marginBottom: 13 }}>
              <CT>📊 Combined F&B Summary</CT>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5,1fr)",
                  gap: 9,
                }}
              >
                {[
                  ["F&B Revenue", fmt(c.fbR), C.navy],
                  ["Food Cost", fmt(c.fA), C.red],
                  ["Bev Cost", fmt(c.bA), C.amber],
                  ["Cost of Sales", fmt(c.cos), C.red],
                  ["Gross Profit", fmt(c.gp), C.green],
                ].map(([l, v, col]) => (
                  <div
                    key={l}
                    style={{
                      background: "#f8fafc",
                      borderRadius: 8,
                      padding: 11,
                      textAlign: "center",
                      borderTop: `3px solid ${col}`,
                    }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 900, color: col }}>
                      {v}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        color: C.muted,
                        marginTop: 5,
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {l}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 13,
              }}
            >
              <Card>
                <CT>📊 Revenue vs Costs</CT>
                <ResponsiveContainer width="100%" height={185}>
                  <BarChart data={barData} barGap={3} barCategoryGap="35%">
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis dataKey="name" style={{ fontSize: 11 }} />
                    <YAxis tickFormatter={fmtL} style={{ fontSize: 10 }} />
                    <Tooltip formatter={(v) => fmt(v)} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar
                      dataKey="Revenue"
                      fill={C.navy}
                      radius={[3, 3, 0, 0]}
                    />
                    <Bar dataKey="Cost" fill="#ef4444" radius={[3, 3, 0, 0]} />
                    <Bar
                      dataKey="Profit"
                      fill={C.green}
                      radius={[3, 3, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <CT>🥧 Revenue Breakdown</CT>
                <ResponsiveContainer width="100%" height={185}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      innerRadius={26}
                      dataKey="value"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_C[i]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => fmt(v)} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </>
        )}

        {/* ═══ SCENARIO ═══ */}
        {tab === "scenario" && (
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}
          >
            <Card>
              <CT>🎯 Adjust Scenario Costs</CT>
              <p style={{ color: C.muted, fontSize: 12, margin: "0 0 18px" }}>
                Move sliders to simulate cost environments and see real-time
                profit impact.
              </p>
              <Sldr
                label="Scenario Food Cost %"
                value={sfP}
                onChange={setSfP}
                min={10}
                max={60}
                color={C.red}
              />
              <Sldr
                label="Scenario Bev Cost %"
                value={sbP}
                onChange={setSbP}
                min={5}
                max={50}
                color={C.amber}
              />
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: 10,
                  padding: 14,
                  marginTop: 6,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.muted,
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Cost Variance from Base
                </div>
                {[
                  { l: "Food Cost", v: c.fVar },
                  { l: "Bev Cost", v: c.bVar },
                ].map(({ l, v }) => (
                  <div
                    key={l}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: C.muted }}>{l} Variance</span>
                    <span
                      style={{
                        fontWeight: 800,
                        color: v > 0 ? C.red : v < 0 ? C.green : C.muted,
                      }}
                    >
                      {v > 0 ? "+" : ""}
                      {v.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 12,
                  padding: 13,
                  borderRadius: 10,
                  background: c.delta >= 0 ? C.greenBg : C.redBg,
                  border: `1px solid ${c.delta >= 0 ? "#6ee7b7" : "#fca5a5"}`,
                  fontSize: 12,
                  lineHeight: 1.7,
                  color: c.delta >= 0 ? "#064e3b" : "#7f1d1d",
                }}
              >
                {c.delta >= 0
                  ? `✅ These cost levels increase net profit by ${fmt(
                      c.delta
                    )}.`
                  : `⚠️ These costs reduce net profit by ${fmt(
                      Math.abs(c.delta)
                    )}. You need ${fmt(
                      c.revN - c.totR
                    )} more revenue to compensate.`}
              </div>
            </Card>
            <Card>
              <CT>📊 Scenario vs Baseline</CT>
              {[
                [
                  "Baseline Net Profit",
                  fmt(c.nop),
                  c.nop >= 0 ? C.green : C.red,
                ],
                ["Scenario Gross Profit", fmt(c.sGP), C.green],
                [
                  "Scenario Net Profit",
                  fmt(c.sNOP),
                  c.sNOP >= 0 ? C.green : C.red,
                ],
                [
                  "Scenario Profit Margin",
                  fmtP(c.sMarg),
                  c.sMarg >= 10 ? C.green : c.sMarg >= 5 ? C.amber : C.red,
                ],
                [
                  "Profit Impact",
                  fmtS(c.delta),
                  c.delta >= 0 ? C.green : C.red,
                ],
                ["Revenue to Maintain", fmt(c.revN), C.navy],
              ].map(([k, v, hl]) => (
                <Row key={k} k={k} v={v} hl={hl} />
              ))}
              <div style={{ marginTop: 18 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.muted,
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Profit Comparison
                </div>
                {[
                  { label: "Baseline NOP", val: c.nop, scen: false },
                  { label: "Scenario NOP", val: c.sNOP, scen: true },
                ].map(({ label, val, scen }) => {
                  const mx = Math.max(Math.abs(c.nop), Math.abs(c.sNOP), 1);
                  return (
                    <div key={label} style={{ marginBottom: 10 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 12,
                          marginBottom: 4,
                        }}
                      >
                        <span>{label}</span>
                        <strong>{fmt(val)}</strong>
                      </div>
                      <div
                        style={{
                          background: C.border,
                          borderRadius: 8,
                          height: 14,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.min(
                              100,
                              Math.abs(val / mx) * 100
                            )}%`,
                            background: scen
                              ? c.delta >= 0
                                ? C.green
                                : C.red
                              : C.navy,
                            borderRadius: 8,
                            transition: "width .4s",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* ═══ WHAT-IF ═══ */}
        {tab === "whatif" && (
          <Card>
            <CT>💡 What-If Simulator</CT>
            <p style={{ color: C.muted, fontSize: 13, margin: "0 0 16px" }}>
              Simulate management decisions and instantly see their impact on
              gross profit, net profit, and profit margin.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 11,
                marginBottom: 22,
              }}
            >
              {[
                {
                  id: "f1",
                  label: "🍽️ Reduce Food Cost by 1%",
                  color: C.green,
                },
                {
                  id: "f3",
                  label: "🍽️ Reduce Food Cost by 3%",
                  color: "#15803d",
                },
                {
                  id: "b1",
                  label: "🍷 Reduce Bev Cost by 1%",
                  color: "#0f766e",
                },
                {
                  id: "r10",
                  label: "📈 Increase Revenue by 10%",
                  color: C.navy,
                },
                {
                  id: "r20",
                  label: "🚀 Increase Revenue by 20%",
                  color: C.navyL,
                },
              ].map(({ id, label, color }) => (
                <button
                  key={id}
                  onClick={() => applyWI(id)}
                  style={{
                    padding: "13px 10px",
                    background: color,
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            {wiLog.length > 0 ? (
              <>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.muted,
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Simulation Results (Last 5)
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: 12,
                    }}
                  >
                    <thead>
                      <tr style={{ background: C.navy, color: "#fff" }}>
                        {[
                          "Action",
                          "Gross Profit",
                          "Net Profit",
                          "Margin",
                          "GP Change",
                          "NP Change",
                        ].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "10px 11px",
                              textAlign: h === "Action" ? "left" : "right",
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {wiLog.map((r, i) => (
                        <tr
                          key={i}
                          style={{
                            background: i % 2 === 0 ? "#f8fafc" : "#fff",
                          }}
                        >
                          <td style={{ padding: "9px 11px", fontWeight: 700 }}>
                            {r.label}
                          </td>
                          <td
                            style={{ padding: "9px 11px", textAlign: "right" }}
                          >
                            {fmt(r.gp)}
                          </td>
                          <td
                            style={{ padding: "9px 11px", textAlign: "right" }}
                          >
                            {fmt(r.nop)}
                          </td>
                          <td
                            style={{
                              padding: "9px 11px",
                              textAlign: "right",
                              fontWeight: 700,
                              color:
                                r.marg >= 10
                                  ? C.green
                                  : r.marg >= 5
                                  ? C.amber
                                  : C.red,
                            }}
                          >
                            {fmtP(r.marg)}
                          </td>
                          <td
                            style={{
                              padding: "9px 11px",
                              textAlign: "right",
                              fontWeight: 800,
                              color: r.gpD >= 0 ? C.green : C.red,
                            }}
                          >
                            {fmtS(r.gpD)}
                          </td>
                          <td
                            style={{
                              padding: "9px 11px",
                              textAlign: "right",
                              fontWeight: 800,
                              color: r.nopD >= 0 ? C.green : C.red,
                            }}
                          >
                            {fmtS(r.nopD)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: C.muted }}>
                <div style={{ fontSize: 34, marginBottom: 10 }}>👆</div>
                <div style={{ fontSize: 13 }}>
                  Click any action button above to run your first simulation
                </div>
              </div>
            )}
          </Card>
        )}

        {/* ═══ BENCHMARKS ═══ */}
        {tab === "bench" && (
          <>
            <Card style={{ marginBottom: 13 }}>
              <CT>📈 Industry Benchmark Comparison</CT>
              <div
                style={{
                  background: C.amberBg,
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 14,
                  fontSize: 12,
                  color: "#92400e",
                }}
              >
                📌 Benchmarks based on luxury 5-star F&B operational standards
                in India — sourced from IHM curriculum & FHRAI industry
                guidelines.
              </div>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr style={{ background: C.navy, color: "#fff" }}>
                      {[
                        "Metric",
                        "Your Value",
                        "Excellent",
                        "Good",
                        "Warning",
                        "Status",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "11px 13px",
                            textAlign: h === "Metric" ? "left" : "center",
                            fontWeight: 700,
                            fontSize: 11,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        l: "Food Cost %",
                        v: fP,
                        t: "food",
                        ex: "25–30%",
                        gd: "30–35%",
                        wn: ">35%",
                      },
                      {
                        l: "Beverage Cost %",
                        v: bP,
                        t: "bev",
                        ex: "18–24%",
                        gd: "24–28%",
                        wn: ">28%",
                      },
                      {
                        l: "Labor Cost %",
                        v: lP,
                        t: "lab",
                        ex: "25–35%",
                        gd: "35–40%",
                        wn: ">40%",
                      },
                    ].map(({ l, v, t, ex, gd, wn }, i) => {
                      const s = BS[bench(t, v)];
                      return (
                        <tr
                          key={l}
                          style={{
                            background: i % 2 === 0 ? "#f8fafc" : "#fff",
                          }}
                        >
                          <td style={{ padding: "11px 13px", fontWeight: 700 }}>
                            {l}
                          </td>
                          <td
                            style={{
                              padding: "11px 13px",
                              textAlign: "center",
                              fontWeight: 900,
                              fontSize: 16,
                              color: C.navy,
                            }}
                          >
                            {v}%
                          </td>
                          <td
                            style={{
                              padding: "11px 13px",
                              textAlign: "center",
                              fontWeight: 700,
                              color: C.green,
                            }}
                          >
                            {ex}
                          </td>
                          <td
                            style={{
                              padding: "11px 13px",
                              textAlign: "center",
                              fontWeight: 700,
                              color: C.amber,
                            }}
                          >
                            {gd}
                          </td>
                          <td
                            style={{
                              padding: "11px 13px",
                              textAlign: "center",
                              fontWeight: 700,
                              color: C.red,
                            }}
                          >
                            {wn}
                          </td>
                          <td
                            style={{
                              padding: "11px 13px",
                              textAlign: "center",
                            }}
                          >
                            <span
                              style={{
                                background: s.bg,
                                color: s.t,
                                padding: "4px 12px",
                                borderRadius: 20,
                                fontSize: 11,
                                fontWeight: 700,
                              }}
                            >
                              {s.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
            <Card>
              <CT>🎯 Profit Margin Gauge</CT>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 11, color: C.muted }}>0%</span>
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: 24, fontWeight: 900, color: mCol }}>
                    {fmtP(c.marg)}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: mCol,
                      marginLeft: 8,
                      fontWeight: 700,
                    }}
                  >
                    {c.marg >= 15
                      ? "✅ Excellent"
                      : c.marg >= 8
                      ? "⚠️ Moderate"
                      : "🔴 Below Target"}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: C.muted }}>30%+</span>
              </div>
              <div
                style={{
                  background: "#e2e8f0",
                  borderRadius: 12,
                  height: 24,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(
                      100,
                      Math.max(0, (c.marg / 30) * 100)
                    )}%`,
                    background: mCol,
                    borderRadius: 12,
                    transition: "width .5s ease",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 4,
                  fontSize: 10,
                  color: C.muted,
                }}
              >
                {[0, 5, 10, 15, 20, 25, 30].map((v) => (
                  <span key={v}>{v}%</span>
                ))}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 10,
                  marginTop: 16,
                }}
              >
                {[
                  { l: "Excellent", r: "≥ 15%", c: C.green, bg: C.greenBg },
                  { l: "Moderate", r: "8–14%", c: C.amber, bg: C.amberBg },
                  { l: "Below Target", r: "< 8%", c: C.red, bg: C.redBg },
                ].map(({ l, r, c: col, bg }) => (
                  <div
                    key={l}
                    style={{
                      background: bg,
                      borderRadius: 8,
                      padding: 12,
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontWeight: 900, color: col, fontSize: 14 }}>
                      {r}
                    </div>
                    <div style={{ fontSize: 11, color: col, marginTop: 4 }}>
                      {l}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* ═══ TRENDS ═══ */}
        {tab === "trends" && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 13,
                marginBottom: 13,
              }}
            >
              <Card>
                <CT>📉 Food Cost % → Profit Trend</CT>
                <p style={{ fontSize: 11, color: C.muted, margin: "0 0 8px" }}>
                  Food revenue: {fmt(fRev)} · Current:{" "}
                  <strong style={{ color: C.red }}>{fP}%</strong>
                </p>
                <ResponsiveContainer width="100%" height={190}>
                  <LineChart data={fTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis dataKey="pct" style={{ fontSize: 10 }} />
                    <YAxis tickFormatter={fmtL} style={{ fontSize: 10 }} />
                    <Tooltip formatter={(v) => fmt(v)} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line
                      type="monotone"
                      dataKey="Profit"
                      stroke={C.green}
                      strokeWidth={2.5}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="Cost"
                      stroke={C.red}
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <CT>📉 Bev Cost % → Profit Trend</CT>
                <p style={{ fontSize: 11, color: C.muted, margin: "0 0 8px" }}>
                  Bev revenue: {fmt(bRev)} · Current:{" "}
                  <strong style={{ color: C.amber }}>{bP}%</strong>
                </p>
                <ResponsiveContainer width="100%" height={190}>
                  <LineChart data={bTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis dataKey="pct" style={{ fontSize: 10 }} />
                    <YAxis tickFormatter={fmtL} style={{ fontSize: 10 }} />
                    <Tooltip formatter={(v) => fmt(v)} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line
                      type="monotone"
                      dataKey="Profit"
                      stroke={C.green}
                      strokeWidth={2.5}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="Cost"
                      stroke={C.amber}
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
            <Card>
              <CT>🏨 Hotel P&L Waterfall</CT>
              <p style={{ fontSize: 11, color: C.muted, margin: "0 0 8px" }}>
                Revenue inflows and cost deductions building to net profit.
              </p>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart
                  data={wfall}
                  layout="vertical"
                  margin={{ left: 16, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis
                    type="number"
                    tickFormatter={fmtL}
                    style={{ fontSize: 10 }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={82}
                    style={{ fontSize: 10 }}
                  />
                  <Tooltip formatter={(v) => fmt(v)} />
                  <Bar dataKey="v" radius={[0, 4, 4, 0]}>
                    {wfall.map(({ v }, i) => (
                      <Cell
                        key={i}
                        fill={v >= 0 ? (i < 3 ? C.navy : C.green) : C.red}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </>
        )}

        {/* ═══ BANQUET ═══ */}
        {tab === "banquet" && (
          <>
            <div
              style={{
                background: `linear-gradient(135deg,${C.navy} 0%,#0d1b2a 100%)`,
                borderRadius: 12,
                padding: "16px 20px",
                marginBottom: 13,
                color: "#fff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 26 }}>🎪</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>
                    Banquet Event Analyzer
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: C.gold,
                      marginTop: 3,
                      letterSpacing: ".5px",
                    }}
                  >
                    ORIGINAL MODULE · Developed from banquet operations
                    experience at ITC Grand Bharat, A Luxury Collection Retreat,
                    Manesar
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 13,
                marginBottom: 13,
              }}
            >
              <Card>
                <CT>🎪 Banquet Event Inputs</CT>
                <Inp
                  label="Number of Events / Month"
                  value={bqEvt}
                  onChange={setBqEvt}
                />
                <Inp
                  label="Average Pax per Event"
                  value={bqPax}
                  onChange={setBqPax}
                />
                <Inp
                  label="Food Revenue per Pax (₹)"
                  value={bqFpax}
                  onChange={setBqFpax}
                />
                <Inp
                  label="Beverage Revenue per Pax (₹)"
                  value={bqBpax}
                  onChange={setBqBpax}
                />
                <Sldr
                  label="Banquet Food Cost %"
                  value={bqFp}
                  onChange={setBqFp}
                  min={20}
                  max={60}
                  color={C.red}
                />
                <Sldr
                  label="Banquet Beverage Cost %"
                  value={bqBp}
                  onChange={setBqBp}
                  min={10}
                  max={50}
                  color={C.amber}
                />
              </Card>
              <Card>
                <CT>📊 Banquet Analysis</CT>
                <Row
                  k="Total Pax / Month"
                  v={(bqEvt * bqPax).toLocaleString("en-IN")}
                />
                <Row k="Banquet Food Revenue" v={fmt(bq.fR)} />
                <Row k="Banquet Bev Revenue" v={fmt(bq.bR)} />
                <Row k="Total Banquet Revenue" v={fmt(bq.totR)} hl={C.navy} />
                <Row k="Food Cost Amount" v={fmt(bq.fA)} hl={C.red} />
                <Row k="Bev Cost Amount" v={fmt(bq.bA)} hl={C.amber} />
                <Row k="Total Cost" v={fmt(bq.cos)} hl={C.red} />
                <Row k="Gross Profit" v={fmt(bq.gp)} hl={C.green} />
                <Row
                  k="Gross Margin"
                  v={fmtP(bq.gpPct)}
                  hl={
                    bq.gpPct >= 65 ? C.green : bq.gpPct >= 50 ? C.amber : C.red
                  }
                />
              </Card>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 11,
                marginBottom: 13,
              }}
            >
              <KPI
                icon="🎉"
                label="Revenue per Event"
                value={fmt(bq.revPerEvt)}
                color={C.navy}
              />
              <KPI
                icon="💰"
                label="Profit per Event"
                value={fmt(bq.gpPerEvt)}
                color={C.green}
              />
              <KPI
                icon="👤"
                label="Revenue per Pax"
                value={fmt(bq.revPerPax)}
                color={C.navyL}
              />
              <KPI
                icon="🏆"
                label="Profit per Pax"
                value={fmt(bq.gpPerPax)}
                color={C.green}
              />
            </div>

            <Card style={{ marginBottom: 13 }}>
              <CT>📈 Banquet vs Main F&B Contribution</CT>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <div>
                  <Row k="Main F&B Gross Profit" v={fmt(c.gp)} hl={C.navy} />
                  <Row k="Banquet Gross Profit" v={fmt(bq.gp)} hl={C.green} />
                  <Row
                    k="Banquet % of F&B GP"
                    v={fmtP(bq.fbContrib)}
                    hl={bq.fbContrib >= 30 ? C.green : C.amber}
                  />
                  <div
                    style={{
                      marginTop: 14,
                      padding: 12,
                      background: C.greenBg,
                      borderRadius: 8,
                      fontSize: 12,
                      color: "#064e3b",
                      lineHeight: 1.8,
                    }}
                  >
                    💡 At ITC Grand Bharat, banquet & MICE events contribute
                    35–50% of total F&B revenue in luxury properties. Higher
                    revenue per head, but tighter cost control is essential due
                    to large-scale preparation.
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: C.muted,
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    Banquet F&B Split
                  </div>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={bqBarData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                      <XAxis dataKey="name" style={{ fontSize: 10 }} />
                      <YAxis tickFormatter={fmtL} style={{ fontSize: 10 }} />
                      <Tooltip formatter={(v) => fmt(v)} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="Food" fill={C.navy} radius={[3, 3, 0, 0]} />
                      <Bar
                        dataKey="Beverage"
                        fill={C.amber}
                        radius={[3, 3, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>

            <Card>
              <CT>📋 Banquet Operations Best Practices</CT>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {[
                  [
                    "🎯",
                    "Fix menu packages in advance to control food cost variance",
                    "Key Insight",
                  ],
                  [
                    "📦",
                    "Bulk purchasing for banquet menus lowers per-unit raw material cost",
                    "Cost Control",
                  ],
                  [
                    "🍷",
                    "Pre-selected beverage packages help manage and cap bev cost %",
                    "Bev Strategy",
                  ],
                  [
                    "👨‍🍳",
                    "Pre-production and mise en place reduce labour cost per event",
                    "Labour",
                  ],
                  [
                    "📋",
                    "Final pax confirmation 48 hrs before reduces food wastage significantly",
                    "Waste Mgmt",
                  ],
                  [
                    "💎",
                    "Upsell floral, AV, and décor for higher non-F&B revenue per event",
                    "Revenue Mix",
                  ],
                ].map(([icon, tip, tag]) => (
                  <div
                    key={tip}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: "10px 12px",
                      background: "#f8fafc",
                      borderRadius: 8,
                      fontSize: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                    <div>
                      <div
                        style={{
                          fontSize: 9,
                          fontWeight: 800,
                          color: C.gold,
                          marginBottom: 3,
                          textTransform: "uppercase",
                          letterSpacing: ".5px",
                        }}
                      >
                        {tag}
                      </div>
                      <div style={{ color: C.text, lineHeight: 1.5 }}>
                        {tip}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* ═══ EDUCATION ═══ */}
        {tab === "edu" && (
          <>
            {[
              {
                icon: "🍽️",
                title: "What is Food Cost?",
                body: `Food Cost is the total expenditure on raw ingredients used to prepare dishes sold to guests, expressed as a percentage of food revenue. If your restaurant earns ₹1,00,000 in food sales and spends ₹30,000 on raw materials, your Food Cost % is 30%. The lower the food cost %, the higher your gross profit margin. Industry best practice for luxury hotels in India is 25–30%.`,
              },
              {
                icon: "🍷",
                title: "What is Beverage Cost?",
                body: `Beverage Cost is the cost of alcoholic and non-alcoholic beverages consumed in producing drinks sold. Beverages carry far lower raw material costs than food — a cocktail with a raw cost of ₹80 may sell for ₹400+, yielding an 80% gross margin. A standard beverage cost target is 18–28%. Fine wine, cocktails, and specialty beverages typically offer the highest margins.`,
              },
              {
                icon: "📊",
                title: "Why Do Hotels Monitor Cost Percentages?",
                body: `Hotels operate on thin margins due to high fixed costs — real estate, utilities, and staffing. Even a 1–2% increase in food or beverage cost can eliminate lakhs of rupees in monthly profit. By tracking percentages rather than absolute values, managers can compare performance across outlets, shifts, events, and seasons regardless of volume, and take corrective action quickly.`,
              },
              {
                icon: "📈",
                title:
                  "How Does a 1% Reduction in Food Cost Affect Annual Profit?",
                body: `At a food revenue of ${fmt(
                  fRev
                )}/month, a 1% reduction in food cost saves ${fmt(
                  fRev * 0.01
                )}/month — that is ${fmt(
                  fRev * 0.01 * 12
                )}/year in additional profit. This is why F&B managers obsess over standardized recipes, portion control, spoilage reduction, and procurement pricing. At ITC Grand Bharat, tight cost controls across restaurant, room service, and banquet menus are critical to maintaining these benchmarks.`,
              },
              {
                icon: "💡",
                title:
                  "Why Do Beverage Departments Have Higher Margins Than Food?",
                body: `Beverages have very low input costs relative to their selling price. A bottle of wine bought at ₹400 wholesale may sell for ₹1,600 by the glass, yielding 75%+ gross margin. Food requires skilled labor, has higher spoilage risk, and complex supply chains. This is why hotels invest in signature cocktail programs, premium wine lists, and dedicated bar concepts — they disproportionately drive F&B profitability.`,
              },
            ].map(({ icon, title, body }) => (
              <Card
                key={title}
                style={{ marginBottom: 11, borderLeft: `4px solid ${C.gold}` }}
              >
                <div
                  style={{ display: "flex", gap: 14, alignItems: "flex-start" }}
                >
                  <span style={{ fontSize: 26, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <h3
                      style={{
                        margin: "0 0 8px",
                        color: C.navy,
                        fontSize: 14,
                        fontWeight: 800,
                      }}
                    >
                      {title}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        color: C.muted,
                        fontSize: 13,
                        lineHeight: 1.8,
                      }}
                    >
                      {body}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}

        {/* ═══ REPORT ═══ */}
        {tab === "report" && (
          <Card>
            <div
              style={{
                textAlign: "center",
                marginBottom: 22,
                paddingBottom: 20,
                borderBottom: `2px solid ${C.gold}`,
              }}
            >
              <div style={{ fontSize: 30, marginBottom: 4 }}>🏨</div>
              <h2
                style={{
                  margin: "0 0 4px",
                  color: C.navy,
                  fontSize: 17,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                F&B Management Performance Report
              </h2>
              <p
                style={{
                  margin: "0 0 3px",
                  color: C.muted,
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Hotel F&B Cost Impact Calculator ·{" "}
                {new Date().toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p
                style={{
                  margin: 0,
                  color: C.gold,
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                Designed by Sujjwal · SGT University, Hotel Management ·
                Inspired by F&B Operations at ITC Grand Bharat, A Luxury
                Collection Retreat
              </p>
            </div>

            <SecH n={1} title="Current Performance Summary" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 9,
                marginBottom: 22,
              }}
            >
              {[
                ["Total Revenue", fmt(c.totR)],
                ["F&B Revenue", fmt(c.fbR)],
                ["Total Cost of Sales", fmt(c.cos)],
                ["Gross Profit", fmt(c.gp)],
                ["Net Operating Profit", fmt(c.nop)],
                ["Profit Margin", fmtP(c.marg)],
                ["Avg Check / Cover", fmt(c.avgC)],
                ["Cost per Cover", fmt(c.cpp)],
                ["Profit per Cover", fmt(c.ppp)],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    background: "#f8fafc",
                    borderRadius: 8,
                    padding: 11,
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: C.muted,
                      marginBottom: 4,
                      textTransform: "uppercase",
                      fontWeight: 700,
                    }}
                  >
                    {k}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: C.navy }}>
                    {v}
                  </div>
                </div>
              ))}
            </div>

            <SecH n={2} title="Benchmark Comparison" />
            <div
              style={{
                background: C.amberBg,
                borderRadius: 8,
                padding: "8px 12px",
                marginBottom: 12,
                fontSize: 11,
                color: "#92400e",
              }}
            >
              📌 Benchmarks based on luxury 5-star F&B operational standards in
              India (FHRAI / IHM curriculum).
            </div>
            <div style={{ marginBottom: 22 }}>
              {[
                { l: "Food Cost %", v: fP, t: "food", tgt: "25–30%" },
                { l: "Beverage Cost %", v: bP, t: "bev", tgt: "18–24%" },
                { l: "Labor Cost %", v: lP, t: "lab", tgt: "25–35%" },
              ].map(({ l, v, t, tgt }) => {
                const s = BS[bench(t, v)];
                return (
                  <div
                    key={l}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "9px 0",
                      borderBottom: `1px solid ${C.border}`,
                      fontSize: 13,
                    }}
                  >
                    <span style={{ fontWeight: 700, flex: 1 }}>{l}</span>
                    <span style={{ flex: 1 }}>
                      Current: <strong>{v}%</strong>
                    </span>
                    <span style={{ flex: 1 }}>
                      Target: <strong>{tgt}</strong>
                    </span>
                    <span
                      style={{
                        background: s.bg,
                        color: s.t,
                        padding: "4px 12px",
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <SecH n={3} title="Key Cost Observations" />
            <ul
              style={{
                paddingLeft: 20,
                color: C.muted,
                fontSize: 13,
                lineHeight: 2.1,
                marginBottom: 22,
              }}
            >
              <li>
                Food Cost is <strong>{fP}%</strong> —{" "}
                {bench("food", fP) === "e"
                  ? "✅ Within the excellent 25–30% range."
                  : bench("food", fP) === "g"
                  ? "⚠️ Acceptable but above ideal. Reduce through portion control and procurement review."
                  : "🔴 Exceeds 35% benchmark. Urgent action required — review menu pricing, portion sizes, and supplier contracts."}
              </li>
              <li>
                Beverage Cost is <strong>{bP}%</strong> —{" "}
                {bench("bev", bP) === "e"
                  ? "✅ Excellent beverage margins being maintained."
                  : bench("bev", bP) === "g"
                  ? "⚠️ Monitor over-pouring and bar wastage closely."
                  : "🔴 High beverage cost. Review bar operations, waste logs, and drink pricing."}
              </li>
              <li>
                Labor Cost is <strong>{lP}%</strong> —{" "}
                {bench("lab", lP) === "e"
                  ? "✅ Labor is efficiently managed."
                  : bench("lab", lP) === "g"
                  ? "⚠️ Review staffing ratios and peak-hour scheduling."
                  : "🔴 Exceeds 40% threshold. Workforce restructuring or scheduling optimisation recommended."}
              </li>
              <li>
                F&B Cost of Sales: <strong>{fmt(c.cos)}</strong> · F&B Gross
                Margin: <strong>{fmtP(c.fbMarg)}</strong>
              </li>
              <li>
                Net Operating Profit:{" "}
                <strong style={{ color: c.nop >= 0 ? C.green : C.red }}>
                  {fmt(c.nop)}
                </strong>{" "}
                ({fmtP(c.marg)} margin)
              </li>
            </ul>

            <SecH n={4} title="Profit Opportunities" />
            <div
              style={{
                background: C.greenBg,
                borderRadius: 10,
                padding: 14,
                fontSize: 13,
                lineHeight: 2.2,
                color: "#064e3b",
                marginBottom: 22,
              }}
            >
              <p style={{ margin: 0 }}>
                📌 Reducing Food Cost by 1% → saves{" "}
                <strong>{fmt(fRev * 0.01)}/month</strong> ={" "}
                <strong>{fmt(fRev * 0.01 * 12)}/year</strong>
              </p>
              <p style={{ margin: 0 }}>
                📌 Reducing Bev Cost by 1% → saves{" "}
                <strong>{fmt(bRev * 0.01)}/month</strong> ={" "}
                <strong>{fmt(bRev * 0.01 * 12)}/year</strong>
              </p>
              <p style={{ margin: 0 }}>
                📌 F&B Revenue +10% at current margins → adds{" "}
                <strong>{fmt(c.fbR * 0.1 * (c.fbMarg / 100))}</strong> gross
                profit
              </p>
              <p style={{ margin: 0 }}>
                📌 Avg check +₹50 across {cov} covers →{" "}
                <strong>{fmt(50 * cov)}</strong> extra monthly revenue
              </p>
            </div>

            <SecH n={5} title="Recommended Actions" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 9,
              }}
            >
              {[
                ["📊", "Weekly F&B cost tracking & variance reporting", "High"],
                [
                  "🤝",
                  "Renegotiate vendor contracts & procurement pricing",
                  "High",
                ],
                [
                  "⚖️",
                  "Standardized portion control & recipe costing sheets",
                  "High",
                ],
                [
                  "♻️",
                  "Reduce spoilage: FIFO, daily waste logs, cold-chain audit",
                  "Medium",
                ],
                [
                  "🍽️",
                  "Menu engineering: promote high-margin star dishes",
                  "Medium",
                ],
                [
                  "🎓",
                  "Train staff on upselling beverages & premium add-ons",
                  "Medium",
                ],
                [
                  "👥",
                  "Optimize staffing schedules by covers and peak hours",
                  "Medium",
                ],
                [
                  "🍹",
                  "Build signature cocktail programme to lift bev revenue",
                  "Low",
                ],
              ].map(([icon, action, priority]) => (
                <div
                  key={action}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "9px 11px",
                    background: "#f8fafc",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                >
                  <span style={{ fontSize: 17 }}>{icon}</span>
                  <span style={{ flex: 1, color: C.text }}>{action}</span>
                  <span
                    style={{
                      background:
                        priority === "High"
                          ? C.red
                          : priority === "Medium"
                          ? C.amber
                          : C.green,
                      color: "#fff",
                      padding: "2px 8px",
                      borderRadius: 12,
                      fontSize: 10,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {priority}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
