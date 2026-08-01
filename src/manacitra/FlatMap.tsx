import { useMemo, useRef } from 'react';
import { useManacitraStore } from './store';
import { logoFor } from './logos';
import { TOKENS, TOKENS_HC } from './tokens';
import type { ManacitraData, Zone } from './types';

const TILE = 72;
const TILE_GAP = 24;
const ROW_PITCH = TILE + TILE_GAP;
const PAD = 26;
const HEADER = 58;
const MARGIN = 64;
const COL_GAP = 420;
const ROW_GAP = 240;

interface Rect { x: number; y: number; w: number; h: number }
interface Tile extends Rect { id: string }
interface ZoneCard extends Rect { zone: Zone; tiles: Tile[] }

function gridFor(n: number) {
  const cols = Math.min(4, Math.max(1, Math.ceil(Math.sqrt(n))));
  return { cols, rows: Math.ceil(n / cols) };
}

function zoneSize(n: number) {
  const { cols, rows } = gridFor(n);
  const w = PAD * 2 + cols * (TILE + TILE_GAP) - TILE_GAP;
  const h = HEADER + PAD + rows * ROW_PITCH - TILE_GAP + PAD;
  return { w, h };
}

function layout(data: ManacitraData): { cards: ZoneCard[]; W: number; H: number } {
  const sized = data.zones.map(z => ({ zone: z, size: zoneSize(z.services.length) }));
  const get = (id: string) => sized.find(s => s.zone.id === id)!;

  const cloudflare = get('cloudflare');
  const oradb = get('oradb');
  const oradev = get('oradev');
  const external = get('external');

  const leftW = Math.max(cloudflare.size.w, oradev.size.w);
  const rightX = MARGIN + leftW + COL_GAP;

  const place = (entry: { zone: Zone; size: { w: number; h: number } }, x: number, y: number): ZoneCard => {
    const { zone, size } = entry;
    const { cols } = gridFor(zone.services.length);
    const tiles: Tile[] = zone.services.map((svc, i) => ({
      id: svc.id,
      x: x + PAD + (i % cols) * (TILE + TILE_GAP),
      y: y + HEADER + PAD + Math.floor(i / cols) * ROW_PITCH,
      w: TILE,
      h: TILE,
    }));
    return { zone, x, y, w: size.w, h: size.h, tiles };
  };

  const cards = [
    place(cloudflare, MARGIN, MARGIN),
    place(oradb, rightX, MARGIN),
    place(oradev, MARGIN, MARGIN + cloudflare.size.h + ROW_GAP),
    place(external, rightX, MARGIN + oradb.size.h + ROW_GAP),
  ];

  const W = rightX + Math.max(oradb.size.w, external.size.w) + MARGIN;
  const H = Math.max(
    MARGIN + cloudflare.size.h + ROW_GAP + oradev.size.h,
    MARGIN + oradb.size.h + ROW_GAP + external.size.h,
  ) + MARGIN;
  return { cards, W, H };
}

function cardById(cards: ZoneCard[], id: string) {
  return cards.find(c => c.zone.id === id);
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

// point on a card edge (face: l/r/t/b), t in 0..1 along that edge
function edgePoint(c: ZoneCard, face: 'l' | 'r' | 't' | 'b', t: number) {
  const pad = PAD;
  const t0 = clamp(t, 0.08, 0.92);
  if (face === 'l') return { x: c.x, y: c.y + pad + t0 * (c.h - pad * 2) };
  if (face === 'r') return { x: c.x + c.w, y: c.y + pad + t0 * (c.h - pad * 2) };
  if (face === 't') return { x: c.x + pad + t0 * (c.w - pad * 2), y: c.y };
  return { x: c.x + pad + t0 * (c.w - pad * 2), y: c.y + c.h };
}

interface Route {
  d: string;
  end: { x: number; y: number };
  angle: number;
  label: { x: number; y: number };
  from: string;
  to: string;
}

function buildRoutes(data: ManacitraData, cards: ZoneCard[]) {
  const tileOf = new Map<string, { tile: Tile; zone: Zone }>();
  for (const card of cards) for (const t of card.tiles) tileOf.set(t.id, { tile: t, zone: card.zone });
  const cardOf = (id: string) => cardById(cards, id);
  const zoneOf = (id: string) => (tileOf.has(id) ? tileOf.get(id)!.zone : cardOf(id)?.zone ?? null);

  // spread exit/entry points along tile edges so multiple arrows to the same block don't stack
  const srcCount = new Map<string, number>();
  const dstCount = new Map<string, number>();
  const nextSrc = (t: Tile) => {
    const k = srcCount.get(t.id) ?? 0;
    srcCount.set(t.id, k + 1);
    return t.y + 12 + (k % 5) * 12;
  };
  const nextDst = (t: Tile) => {
    const k = dstCount.get(t.id) ?? 0;
    dstCount.set(t.id, k + 1);
    return t.x + 10 + (k % 5) * 11;
  };
  const nextDstLane = (t: Tile) => {
    const k = dstCount.get(t.id) ?? 0;
    return t.y - TILE_GAP + 4 + (k % 3) * 3;
  };

  const routes: Route[] = [];
  const intraRoutes: Route[] = [];

  // rightward families: (fromZone, toZone) -> ordered connections, lanes sliced per family
  const rightConnList = data.connections.filter(c => {
    const f = zoneOf(c.from), t = zoneOf(c.to);
    return f && t && f.id !== t.id && cardById(cards, t.id)!.x >= cardById(cards, f.id)!.x + cardById(cards, f.id)!.w;
  });
  const families = new Map<string, { from: Zone; to: Zone; conns: typeof data.connections }>();
  for (const c of rightConnList) {
    const f = zoneOf(c.from)!, t = zoneOf(c.to)!;
    const key = `${f.id}>${t.id}`;
    const fam = families.get(key) ?? { from: f, to: t, conns: [] };
    fam.conns.push(c);
    families.set(key, fam);
  }
  const famList = [...families.values()].map(fam => ({
    ...fam,
    conns: [...fam.conns].sort((x, y) => {
      const a = tileOf.get(x.from);
      const b = tileOf.get(y.from);
      return (a ? a.tile.y : 0) - (b ? b.tile.y : 0);
    }),
  }));
  // divide the corridor among families sharing the same destination card
  const familySlices = new Map<string, { min: number; max: number }>();
  const byToCard = new Map<string, typeof famList>();
  for (const fam of famList) {
    const tc = cardOf(fam.to.id)!;
    const key = `${tc.x},${tc.y}`;
    const list = byToCard.get(key) ?? [];
    list.push(fam);
    byToCard.set(key, list);
  }
  for (const list of byToCard.values()) {
    const fc = cardOf(list[0].from.id)!;
    const tc = cardOf(list[0].to.id)!;
    const corridorMin = fc.x + fc.w + 12;
    const corridorMax = tc.x - 12;
    const total = list.reduce((s, f) => s + f.conns.length, 0);
    let offset = 0;
    for (const fam of list) {
      const min = corridorMin + (offset / total) * (corridorMax - corridorMin);
      offset += fam.conns.length;
      const max = corridorMin + (offset / total) * (corridorMax - corridorMin);
      familySlices.set(`${fam.from.id}>${fam.to.id}`, { min, max });
    }
  }

  data.connections.forEach(conn => {
    const fromZone = zoneOf(conn.from);
    const toZone = zoneOf(conn.to);
    if (!fromZone || !toZone) return;
    const fromCard = cardOf(fromZone.id)!;
    const toCard = cardOf(toZone.id)!;

    // intra-zone: route inside the card through tile-gap lanes so no line crosses a tile
    if (fromZone.id === toZone.id) {
      const a = tileOf.get(conn.from);
      const b = tileOf.get(conn.to);
      if (!a || !b) return;
      const sy = nextSrc(a.tile);
      const lx = a.tile.x - TILE_GAP / 2;
      const lane = nextDstLane(b.tile);
      const tx = nextDst(b.tile);
      const d = `M ${a.tile.x} ${sy} H ${lx} V ${lane} H ${tx} V ${b.tile.y}`;
      intraRoutes.push({
        d,
        end: { x: tx, y: b.tile.y },
        angle: 90,
        label: { x: lx - 8, y: (sy + lane) / 2 },
        from: conn.from,
        to: conn.to,
      });
      return;
    }

    // rightward: target card is to the right of source card
    if (toCard.x >= fromCard.x + fromCard.w) {
      const srcT = tileOf.get(conn.from);
      const dstT = tileOf.get(conn.to);
      const slice = familySlices.get(`${fromZone.id}>${toZone.id}`)!;
      const fam = famList.find(f => f.from.id === fromZone.id && f.to.id === toZone.id)!;
      const pos = Math.max(0, fam.conns.findIndex(c => c.from === conn.from && c.to === conn.to));
      const laneX = slice.min + ((pos + 0.5) / Math.max(1, fam.conns.length)) * (slice.max - slice.min);
      const src = srcT ? edgePoint(fromCard, 'r', (srcT.tile.y - fromCard.y) / fromCard.h)
                       : edgePoint(fromCard, 'r', 0.5);

      if (dstT) {
        // route into the card through the left padding gutter, then touch the tile's top edge
        const entry = edgePoint(toCard, 'l', (dstT.tile.y - toCard.y) / toCard.h);
        const gutterX = toCard.x + PAD / 2;
        const lane = nextDstLane(dstT.tile);
        const tx = nextDst(dstT.tile);
        const d = `M ${src.x} ${src.y} H ${laneX} V ${entry.y} H ${gutterX} V ${lane} H ${tx} V ${dstT.tile.y}`;
        routes.push({ d, end: { x: tx, y: dstT.tile.y }, angle: 90, label: { x: laneX + 8, y: (src.y + entry.y) / 2 }, from: conn.from, to: conn.to });
        return;
      }

      const dst = { x: toCard.x, y: toCard.y + PAD + (laneX - (fromCard.x + fromCard.w + 12)) / ((toCard.x - 12) - (fromCard.x + fromCard.w + 12)) * (toCard.h - PAD * 2) };
      const d = `M ${src.x} ${src.y} H ${laneX} V ${dst.y} H ${dst.x}`;
      routes.push({ d, end: dst, angle: 0, label: { x: laneX + 8, y: (src.y + dst.y) / 2 }, from: conn.from, to: conn.to });
      return;
    }

    // upward: target card is above source card
    if (toCard.y + toCard.h <= fromCard.y) {
      const srcT = tileOf.get(conn.from);
      const dstT = tileOf.get(conn.to);
      const src = srcT ? edgePoint(fromCard, 't', (srcT.tile.x - fromCard.x) / fromCard.w)
                       : edgePoint(fromCard, 't', 0.5);
      const dst = dstT ? edgePoint(toCard, 'b', (dstT.tile.x - toCard.x) / toCard.w)
                       : edgePoint(toCard, 'b', (src.x - toCard.x) / toCard.w);
      const corridorMin = toCard.y + toCard.h + 8;
      const corridorMax = fromCard.y - 8;
      const upConns = data.connections.filter(c => {
        const f = zoneOf(c.from), t = zoneOf(c.to);
        if (!f || !t || f.id !== fromZone.id || t.id !== toZone.id) return false;
        const fc = cardOf(f.id)!, tc = cardOf(t.id)!;
        return tc.y + tc.h <= fc.y;
      });
      const pos = Math.max(0, upConns.findIndex(c => c.from === conn.from && c.to === conn.to));
      const laneY = corridorMin + ((pos + 0.5) / Math.max(1, upConns.length)) * (corridorMax - corridorMin);
      const d = `M ${src.x} ${src.y} V ${laneY} H ${dst.x} V ${dst.y}`;
      routes.push({ d, end: dst, angle: -90, label: { x: (src.x + dst.x) / 2, y: laneY - 6 }, from: conn.from, to: conn.to });
      return;
    }
  });

  return { routes, intraRoutes };
}

function arrowPts(x: number, y: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  const s = 8;
  const w = 4.5;
  const tip = `${x},${y}`;
  const b1 = `${x - s * Math.cos(a) + w * Math.cos(a + Math.PI / 2)},${y - s * Math.sin(a) + w * Math.sin(a + Math.PI / 2)}`;
  const b2 = `${x - s * Math.cos(a) - w * Math.cos(a + Math.PI / 2)},${y - s * Math.sin(a) - w * Math.sin(a + Math.PI / 2)}`;
  return `${tip} ${b1} ${b2}`;
}

function LogoMark({ key, size }: { key: string; size: number }) {
  const def = logoFor(key);
  if (!def) return null;
  return (
    <svg viewBox={def.vb} width={size} height={size} aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d={def.d} fill={def.color} />
    </svg>
  );
}

export default function FlatMap({ data }: { data: ManacitraData }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { cards, W, H } = useMemo(() => layout(data), [data]);

  const hoveredId = useManacitraStore(s => s.hoveredId);
  const selectedId = useManacitraStore(s => s.selectedId);
  const filters = useManacitraStore(s => s.filters);
  const visibleLayers = useManacitraStore(s => s.visibleLayers);
  const searchQuery = useManacitraStore(s => s.searchQuery);
  const reducedMotion = useManacitraStore(s => s.reducedMotion);
  const highContrast = useManacitraStore(s => s.highContrast);
  const setHovered = useManacitraStore(s => s.setHovered);
  const setSelected = useManacitraStore(s => s.setSelected);

  const T = highContrast ? TOKENS_HC : TOKENS;
  const q = searchQuery.trim().toLowerCase();
  const activeId = hoveredId ?? selectedId;

  const tileById = useMemo(() => {
    const m = new Map<string, { tile: Tile; zone: Zone }>();
    for (const card of cards) for (const t of card.tiles) m.set(t.id, { tile: t, zone: card.zone });
    return m;
  }, [cards]);

  const dimmed = useMemo(() => {
    const s = new Set<string>();
    for (const [id, { zone }] of tileById) {
      const h = data.health[id];
      const statusOk = filters.status.length === 0 || (h && filters.status.includes(h.online ? 'online' : 'offline'));
      const queryOk = !q || id.toLowerCase().includes(q) || zone.name.toLowerCase().includes(q) || zone.label.toLowerCase().includes(q);
      if (!statusOk || !queryOk) s.add(id);
    }
    return s;
  }, [tileById, filters.status, q, data.health]);

  const { routes, intraRoutes } = useMemo(() => buildRoutes(data, cards), [data, cards]);

  const linkActive = (from: string, to: string) => {
    if (!activeId) return true;
    return from === activeId || to === activeId;
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      onClick={e => { if (e.target === svgRef.current) setSelected(null); }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: T.bgCanvas }}
    >
      <defs>
        <filter id="halo" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor={T.bg} floodOpacity="0.95" />
        </filter>
      </defs>

      {/* inter-zone connections (under cards) */}
      {visibleLayers.connections && routes.map((conn, i) => {
        const isActive = linkActive(conn.from, conn.to);
        const dim = dimmed.has(conn.from) || dimmed.has(conn.to);
        const opacity = isActive ? 0.8 : dim ? 0.12 : 0.42;
        const stroke = isActive ? T.accent : T.ink;
        const dur = (8 + (i % 5) * 2).toFixed(1);
        return (
          <g key={`r${i}`} opacity={opacity} style={{ transition: 'opacity .2s' }}>
            <path d={conn.d} fill="none" stroke={stroke} strokeWidth={isActive ? 2.2 : 1.5} strokeLinecap="round" />
            {!reducedMotion && (
              <circle r={2.4} fill={T.accent}>
                <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={conn.d} />
              </circle>
            )}
          </g>
        );
      })}

      {/* zone cards */}
      {visibleLayers.zones && cards.map(card => {
        const zoneDim = card.tiles.every(t => dimmed.has(t.id));
        const tint = card.zone.color;
        return (
          <g key={card.zone.id} opacity={zoneDim ? 0.4 : 1} style={{ transition: 'opacity .2s' }}>
            <rect x={card.x} y={card.y} width={card.w} height={card.h} rx={16} fill={T.surface} stroke={T.lineStrong} strokeWidth={1.2} />
            <rect x={card.x + 1} y={card.y + 1} width={6} height={card.h - 2} rx={3} fill={tint} opacity={0.85} />
            <text x={card.x + PAD + 12} y={card.y + 30} fontFamily={T.fontMono} fontSize={15} fontWeight={600} fill={T.ink} letterSpacing={1}>
              {card.zone.name}
            </text>
            <text x={card.x + PAD + 12} y={card.y + 48} fontFamily={T.fontMono} fontSize={10} letterSpacing={2} fill={T.inkMuted}>
              {card.zone.label}{card.zone.subtitle ? ` · ${card.zone.subtitle}` : ''}
            </text>

            {visibleLayers.services && card.tiles.map(tile => {
              const svc = card.zone.services.find(s => s.id === tile.id)!;
              const h = data.health[tile.id];
              const online = h?.online ?? null;
              const isActive = tile.id === activeId;
              const dim = dimmed.has(tile.id);
              const statusColor = online === null ? T.unknown : online ? T.online : T.offline;
              return (
                <g
                  key={tile.id}
                  opacity={isActive ? 1 : dim ? 0.3 : 1}
                  style={{ transition: 'opacity .2s', cursor: svc.url ? 'pointer' : 'default' }}
                  onMouseEnter={() => setHovered(tile.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={e => {
                    e.stopPropagation();
                    setSelected(tile.id);
                    if (svc.url) window.open(svc.url, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <rect
                    x={tile.x} y={tile.y} width={tile.w} height={tile.h} rx={16}
                    fill={isActive ? T.surfaceBorder : T.bg}
                    stroke={isActive ? T.ink : T.surfaceBorder}
                    strokeWidth={isActive ? 1.6 : 1}
                  />
                  <g transform={`translate(${tile.x + (tile.w - 26) / 2}, ${tile.y + 8})`}>
                    <LogoMark key={svc.logo} size={26} />
                  </g>
                  <text
                    x={tile.x + tile.w / 2} y={logoFor(svc.logo) ? tile.y + tile.h - 10 : tile.y + tile.h / 2}
                    fontFamily={T.fontSans} fontSize={logoFor(svc.logo) ? 10 : 11} fontWeight={500} fill={T.ink}
                    textAnchor="middle"
                    style={{ pointerEvents: 'none' }}
                  >
                    {svc.name}
                  </text>
                  {visibleLayers.labels && (
                    <circle cx={tile.x + tile.w - 9} cy={tile.y + 9} r={4.5} fill={statusColor} stroke={T.bg} strokeWidth={1.5} />
                  )}
                </g>
              );
            })}
          </g>
        );
      })}

      {/* intra-zone connections (above cards) */}
      {visibleLayers.connections && intraRoutes.map((conn, i) => {
        const isActive = linkActive(conn.from, conn.to);
        const dim = dimmed.has(conn.from) || dimmed.has(conn.to);
        const opacity = isActive ? 0.9 : dim ? 0.15 : 0.5;
        const stroke = isActive ? T.accent : T.ink;
        return (
          <path key={`i${i}`} d={conn.d} fill="none" stroke={stroke} strokeWidth={isActive ? 2.2 : 1.5}
            opacity={opacity} strokeLinecap="round" style={{ transition: 'opacity .2s' }} />
        );
      })}

      {/* arrowheads */}
      {visibleLayers.connections && [...routes, ...intraRoutes].map((conn, i) => {
        const isActive = linkActive(conn.from, conn.to);
        const dim = dimmed.has(conn.from) || dimmed.has(conn.to);
        const opacity = isActive ? 0.95 : dim ? 0.15 : 0.5;
        return (
          <polygon key={`ar${i}`} points={arrowPts(conn.end.x, conn.end.y, conn.angle)} fill={isActive ? T.accent : T.ink} opacity={opacity} style={{ transition: 'opacity .2s' }} />
        );
      })}

      {/* connection labels */}
      {visibleLayers.labels && [...routes, ...intraRoutes].map((conn, i) => {
        const label = data.connections.find(c => c.from === conn.from && c.to === conn.to)?.label;
        if (!label) return null;
        const isActive = linkActive(conn.from, conn.to);
        const dim = dimmed.has(conn.from) || dimmed.has(conn.to);
        const opacity = isActive ? 1 : dim ? 0.15 : 0.6;
        return (
          <text key={`l${i}`} x={conn.label.x} y={conn.label.y} fontFamily={T.fontMono} fontSize={9.5}
            fill={isActive ? T.accent : T.ink} opacity={opacity} filter="url(#halo)" style={{ transition: 'opacity .2s' }}>
            {label}
          </text>
        );
      })}
    </svg>
  );
}
