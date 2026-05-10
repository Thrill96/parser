"use client";
import { useState } from "react";
import type { Constituent } from "@/lib/types";

type Mode = "idle" | "compose" | "sending" | "sent" | "logged";

const STAFF = [
  { email: "puffin@washingtonwintershow.org", name: "Puffin Hawkins", role: "Executive Director" },
  { email: "natalie@washingtonwintershow.org", name: "Natalie Greer", role: "Operations" },
  { email: "georgina@washingtonwintershow.org", name: "Georgina Ashworth", role: "Development" },
];

const TEMPLATES = [
  {
    name: "Sponsorship upgrade conversation",
    subject: "A quick conversation about Washington Winter Show 2027",
    body: (n: string) =>
      `Dear ${n.split(" ").slice(0, -1).join(" ") || "Friend"},\n\nThank you for your continued support of the Washington Winter Show. As we begin planning for 2027, I'd love to set up a brief conversation about how you'd like to be involved next year.\n\nWould you be open to a 15-minute call next week?\n\nWarmly,\nPuffin`,
  },
  {
    name: "Preview Night personal RSVP follow-up",
    subject: "Saving you a seat at Preview Night",
    body: (n: string) =>
      `Dear ${n.split(" ").slice(0, -1).join(" ") || "Friend"},\n\nWe haven't heard back on Preview Night yet — wanted to check in personally. We have a small group of patrons gathering around 6:30 before the formal program; I'd love to introduce you to a few of them.\n\nLet me know if I should put you on the list.\n\nBest,\nPuffin`,
  },
];

export function ProfileActions({ constituent }: { constituent: Constituent }) {
  const [mode, setMode] = useState<Mode>("idle");
  const [sender, setSender] = useState(STAFF[0].email);
  const [tplIdx, setTplIdx] = useState(0);
  const tpl = TEMPLATES[tplIdx];
  const [subject, setSubject] = useState(tpl.subject);
  const [body, setBody] = useState(tpl.body(constituent.name));

  const send = async () => {
    setMode("sending");
    await new Promise((r) => setTimeout(r, 1300));
    setMode("sent");
    setTimeout(() => setMode("logged"), 700);
  };

  const pickTemplate = (i: number) => {
    setTplIdx(i);
    setSubject(TEMPLATES[i].subject);
    setBody(TEMPLATES[i].body(constituent.name));
  };

  const senderName = STAFF.find((s) => s.email === sender)?.name ?? "";

  if (mode === "idle") {
    return (
      <div className="flex gap-2 mt-4 flex-wrap">
        <button
          onClick={() => setMode("compose")}
          className="dm text-xs font-medium px-3 py-2 rounded transition"
          style={{
            background: "rgba(75,156,211,0.12)",
            color: "#4B9CD3",
            border: "1px solid rgba(75,156,211,0.3)",
          }}
        >
          ✉ Email via Gmail
        </button>
        <button
          className="dm text-xs font-medium px-3 py-2 rounded transition"
          style={{
            background: "rgba(201,168,76,0.1)",
            color: "#C9A84C",
            border: "1px solid rgba(201,168,76,0.25)",
          }}
        >
          📞 Log a call
        </button>
        <button
          className="dm text-xs font-medium px-3 py-2 rounded transition"
          style={{
            background: "rgba(91,166,122,0.08)",
            color: "#5BA67A",
            border: "1px solid rgba(91,166,122,0.25)",
          }}
        >
          ✓ Add task
        </button>
        <button
          className="dm text-xs font-medium px-3 py-2 rounded transition"
          style={{
            background: "rgba(255,255,255,0.04)",
            color: "rgba(232,228,221,0.65)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          📊 Push to Mailchimp segment
        </button>
      </div>
    );
  }

  if (mode === "sent" || mode === "logged" || mode === "sending") {
    return (
      <div
        className="mt-4 rounded p-4 space-y-2"
        style={{
          background:
            mode === "sending"
              ? "rgba(75,156,211,0.06)"
              : "rgba(91,166,122,0.06)",
          border: `1px solid ${mode === "sending" ? "rgba(75,156,211,0.25)" : "rgba(91,166,122,0.3)"}`,
        }}
      >
        <div
          className="dm text-xs font-semibold"
          style={{ color: mode === "sending" ? "#4B9CD3" : "#5BA67A" }}
        >
          {mode === "sending"
            ? "Sending via Gmail…"
            : `✓ Sent from ${senderName}'s Gmail`}
        </div>
        {mode !== "sending" && (
          <div className="dm text-xs text-[color:var(--color-text-2)]">
            To: {constituent.email}
            <br />
            Subject: {subject}
          </div>
        )}
        {mode === "logged" && (
          <div
            className="dm text-[11px] flex items-center gap-1.5 pt-1 border-t"
            style={{
              color: "#5BA67A",
              borderColor: "rgba(91,166,122,0.2)",
            }}
          >
            ✓ Journal entry written to eTapestry · constituent record updated · communication logged in dashboard
          </div>
        )}
        <button
          onClick={() => setMode("idle")}
          className="dm text-[10px] underline mt-1"
          style={{ color: "rgba(232,228,221,0.5)" }}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <div
      className="mt-4 rounded p-4 space-y-3"
      style={{
        background: "rgba(75,156,211,0.04)",
        border: "1px solid rgba(75,156,211,0.25)",
      }}
    >
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="dm text-[10px] uppercase tracking-widest" style={{ color: "#4B9CD3" }}>
          Compose · Personal Gmail
        </div>
        <button
          onClick={() => setMode("idle")}
          className="dm text-[10px] text-[color:var(--color-text-3)]"
        >
          Cancel
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <div className="lbl">Send as</div>
          <select
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            className="dm w-full px-2 py-1.5 rounded text-xs"
            style={{
              background: "rgba(0,0,0,0.3)",
              color: "#E8E4DD",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {STAFF.map((s) => (
              <option key={s.email} value={s.email}>
                {s.name} — {s.role}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="lbl">Template</div>
          <select
            value={tplIdx}
            onChange={(e) => pickTemplate(Number(e.target.value))}
            className="dm w-full px-2 py-1.5 rounded text-xs"
            style={{
              background: "rgba(0,0,0,0.3)",
              color: "#E8E4DD",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {TEMPLATES.map((t, i) => (
              <option key={i} value={i}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="lbl">To</div>
        <div
          className="dm text-xs px-2 py-1.5 rounded"
          style={{
            background: "rgba(0,0,0,0.2)",
            color: "rgba(232,228,221,0.6)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          {constituent.email}
        </div>
      </div>

      <div>
        <div className="lbl">Subject</div>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="dm w-full px-2 py-1.5 rounded text-xs"
          style={{
            background: "rgba(0,0,0,0.3)",
            color: "#E8E4DD",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />
      </div>

      <div>
        <div className="lbl">Body</div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={9}
          className="dm w-full px-2 py-2 rounded text-xs leading-relaxed font-mono"
          style={{
            background: "rgba(0,0,0,0.3)",
            color: "#E8E4DD",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />
      </div>

      <div
        className="dm text-[10px] flex items-start gap-2 p-2 rounded"
        style={{ background: "rgba(75,156,211,0.05)", color: "rgba(232,228,221,0.55)" }}
      >
        <span aria-hidden>ⓘ</span>
        <span>
          Sent from <strong>{senderName}</strong>&rsquo;s Gmail account · this
          will be auto-logged as a journal entry on the eTapestry record.
        </span>
      </div>

      <button
        onClick={send}
        className="dm text-sm font-semibold w-full py-2.5 rounded transition"
        style={{ background: "#4B9CD3", color: "#0B1120" }}
      >
        Send & log to eTapestry
      </button>
    </div>
  );
}
