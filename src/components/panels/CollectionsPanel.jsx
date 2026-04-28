import { useState, useEffect } from "react";
import { COLORS, FONTS as F, CARD_COLORS } from "../../styles/tokens.js";
import { fetchCollections, deleteCollection } from "../../utils/db.js";

const TYPE_META = {
  dispatch: { label: "DISPATCH", labelColor: COLORS.red },
  book:     { label: "BOOK",     labelColor: COLORS.cobalt },
  quote:    { label: "QUOTE",    labelColor: COLORS.teal },
};

function TypeBadge({ type }) {
  const meta = TYPE_META[type] || TYPE_META.dispatch;
  return (
    <span style={{
      fontFamily: F.ui, fontSize: 8, fontWeight: 700,
      letterSpacing: 2, color: COLORS.paper,
      background: meta.labelColor,
      padding: "2px 7px",
      display: "inline-block",
    }}>{meta.label}</span>
  );
}

function CollectionItem({ item, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const accentColor = CARD_COLORS[item.color] || COLORS.gold;
  const dateStr = item.created_at
    ? new Date(item.created_at).toLocaleDateString("en-US", { month: "numeric", day: "numeric" })
    : "";

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCollection(item.id);
      onDelete(item.id);
    } catch { setDeleting(false); }
  };

  return (
    <div style={{
      display: "flex", gap: 10, alignItems: "flex-start",
      padding: "12px 0",
      borderBottom: `1px solid rgba(42,31,14,0.08)`,
      animation: "duleme-fade-up 0.3s ease both",
    }}>
      <div style={{
        width: 3, alignSelf: "stretch", flexShrink: 0,
        background: accentColor,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <TypeBadge type={item.type} />
          {dateStr && (
            <span style={{ fontFamily: F.ui, fontSize: 9, color: COLORS.muted, letterSpacing: 0.5 }}>{dateStr}</span>
          )}
        </div>
        <div style={{ fontFamily: F.chinese, fontWeight: 700, fontSize: 13, color: COLORS.ink, lineHeight: 1.4, marginBottom: 2 }}>
          {item.title || "(untitled)"}
        </div>
        {item.subtitle && (
          <div style={{ fontFamily: F.ui, fontSize: 10, color: COLORS.muted, letterSpacing: 0.5, lineHeight: 1.4 }}>
            {item.subtitle}
          </div>
        )}
        {item.content && (
          <div style={{ fontFamily: F.body, fontStyle: "italic", fontSize: 11, color: COLORS.muted, marginTop: 4, lineHeight: 1.6 }}>
            "{item.content}"
          </div>
        )}
      </div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: F.ui, fontSize: 14, color: COLORS.paperAged,
          padding: "0 2px", opacity: deleting ? 0.4 : 0.5,
          flexShrink: 0, lineHeight: 1,
        }}
      >×</button>
    </div>
  );
}

export default function CollectionsPanel({ refresh }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCollections()
      .then(data => setItems(data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [refresh]);

  const handleDelete = (id) => {
    setItems(prev => prev.filter(it => it.id !== id));
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", fontFamily: F.body, fontStyle: "italic", fontSize: 12, color: COLORS.muted }}>
        Loading saved items…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "32px 0 8px" }}>
        <div style={{ fontFamily: F.ui, fontSize: 28, marginBottom: 10, opacity: 0.18 }}>♡</div>
        <div style={{ fontFamily: F.body, fontStyle: "italic", fontSize: 11, color: COLORS.muted, opacity: 0.6, lineHeight: 1.8 }}>
          Nothing saved yet —<br />explore something today.
        </div>
      </div>
    );
  }

  return (
    <div>
      {items.map(item => (
        <CollectionItem key={item.id} item={item} onDelete={handleDelete} />
      ))}
    </div>
  );
}
