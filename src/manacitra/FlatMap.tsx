import { useMemo, useRef } from 'react';
import { useManacitraStore } from './store';
import { logoFor } from './logos';
import { TOKENS, TOKENS_HC } from './tokens';
import type { ManacitraData, Zone } from './types';

const TILE_W = 150;
const TILE_H = 46;
const TILE_GAP = 10;
const PAD = 18;
const HEADER = 54;
const ZONE_GAP = 70;
const MARGIN = 40;

interface Rect { x: number; y: number; w: number; h: number }
interface Tile extends Rect { id: string }
interface ZoneCard extends Rect { zone: Zone; tiles: Tile[] }

function gridFor(n: number) {
  const cols = Math.min(4, Math.max(1, Math.ceil(Math.sqrt(n))));
  return { cols, rows: Math.ceil(n / cols) };
}

function zoneSize(n: number) {
  const { cols, rows } = gridFor(n);
  const w = PAD * 2 + cols * (TILE_W + TILE_GAP) - TILE_GAP;
  const h = HEADER + PAD + rows * (TILE_H + TILE_GAP) - TILE_GAP + PAD;
  return { w, h };
}

function layout(data: ManacitraData): { cards: ZoneCard[]; W: number; H: number } {
  const sized = data.zones.map(z => ({ zone: z, size: zoneSize(z.services.length) }));

  const cloudflare = sized.find(s => s.zone.id === 'cloudflare');
  const oradev = sized.find(s => s.zone.id === 'oradev');
  const oradb = sized.find(s => s.zone.id === 'oradb');
  const external = sized.find(s => s.zone.id === 'external');

  const colA = cloudflare?.size.w ?? 0;
  const colB = Math.max(oradev?.size.w ?? 0, external?.size.w ?? 0);
  const xA = MARGIN;
  const xB = xA + colA + ZONE_GAP;
  const xC = xB + colB + ZONE_GAP;

  const yRow1 = MARGIN;
  const yExternal = yRow1 + (oradev?.size.h ?? 0) + ZONE_GAP;

  const place = (entry: { zone: Zone; size: { w: number; h: number } } | undefined, x: number, y: number): ZoneCard | null => {
    if (!entry) return null;
    const { zone, size } = entry;
    const { cols } = gridFor(zone.services.length);
    const tiles: Tile[] = zone.services.map((svc, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      return {
        id: svc.id,
        x: x + PAD + col * (TILE_W + TILE_GAP),
        y: y + HEADER + PAD + row * (TILE_H + TILE_GAP),
        w: TILE_W,
        h: TILE_H,
      };
    });
    return { zone, x, y, w: size.w, h: size.h, tiles };
  };

  const cards = [
    place(cloudflare, xA, yRow1),
    place(oradev, xB, yRow1),
    place(oradb, xC, yRow1),
    place(external, xB, yExternal),
  ].filter((c): c is ZoneCard => c !== null);

  const W = Math.max(xA + colA, xC + (oradb?.size.w ?? 0), xB + colB) + MARGIN;
  const H = Math.max(yRow1 + (cloudflare?.size.h ?? 0), yExternal + (external?.size.h ?? 0), yRow1 + (oradb?.size.h ?? 0)) + MARGIN;
  return { cards, W, H };
}

function zoneAnchor(zone: ZoneCard, src: { x: number; y: number }) {
  const cx = zone.x + zone.w / 2;
  const cy = zone.y + zone.h / 2;
  const horizontal = Math.abs(cx - src.x) >= Math.abs(cy - src.y);
  const min = zone.y + HEADER;
  const max = zone.y + zone.h - PAD;
  const t = Math.max(0, Math.min(1, (src.y - min) / Math.max(1, max - min)));
  if (horizontal) {
    return { x: src.x > cx ? zone.x + zone.w : zone.x, y: min + t * (max - min) };
  }
  const y = src.y > cy ? zone.y + zone.h : zone.y;
  return { x: zone.x + PAD + t * (zone.w - PAD * 2), y };
}

function tileCenter(t: Tile) {
  return { x: t.x + t.w / 2, y: t.y + t.h / 2 };
}

function bezier(p1: { x: number; y: number }, p2: { x: number; y: number }, lat: number) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const c1x = p1.x + dx * 0.35 + nx * lat * 12;
  const c1y = p1.y + dy * 0.35 + ny * lat * 12;
  const c2x = p2.x - dx * 0.35 + nx * lat * 12;
  const c2y = p2.y - dy * 0.35 + ny * lat * 12;
  return `M ${p1.x} ${p1.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
}

function LogoMark({ key, size }: { key: string; size: number }) {
  const def = logoFor(key);
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
    for (const card of cards) {
      for (const t of card.tiles) m.set(t.id, { tile: t, zone: card.zone });
    }
    return m;
  }, [cards]);

  const dimmed = useMemo(() => {
    const s = new Set<string>();
    for (const [id, { tile, zone }] of tileById) {
      const h = data.health[id];
      const statusOk = filters.status.length === 0 || (h && filters.status.includes(h.online ? 'online' : 'offline'));
      const queryOk = !q || tile.id.toLowerCase().includes(q) || zone.name.toLowerCase().includes(q) || zone.label.toLowerCase().includes(q);
      if (!statusOk || !queryOk) s.add(id);
    }
    return s;
  }, [tileById, filters.status, q, data.health]);

  const connections = useMemo(() => {
    const conns: { d: string; from: string; to: string; label: string }[] = [];
    data.connections.forEach((conn, ci) => {
      const fromTile = tileById.get(conn.from);
      const toTile = tileById.get(conn.to);
      const fromCard = cards.find(c => c.zone.id === conn.from);
      const toCard = cards.find(c => c.zone.id === conn.to);
      if (!fromTile && !fromCard) return;
      if (!toTile && !toCard) return;
      const srcCenter = fromTile ? tileCenter(fromTile.tile) : { x: fromCard!.x + fromCard!.w / 2, y: fromCard!.y + fromCard!.h / 2 };
      const dstCenter = toTile ? tileCenter(toTile.tile) : { x: toCard!.x + toCard!.w / 2, y: toCard!.y + toCard!.h / 2 };
      const p1 = fromCard && !fromTile ? zoneAnchor(fromCard, dstCenter) : srcCenter;
      const p2 = toCard && !toTile ? zoneAnchor(toCard, srcCenter) : dstCenter;
      conns.push({ d: bezier(p1, p2, (ci % 4) - 1.5), from: conn.from, to: conn.to, label: conn.label });
    });
    return conns;
  }, [data.connections, tileById, cards]);

  const linkActive = (conn: { from: string; to: string }) => {
    if (!activeId) return true;
    return conn.from === activeId || conn.to === activeId;
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      onClick={e => {
        if (e.target === svgRef.current) setSelected(null);
      }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: T.bgCanvas }}
    >
      <defs>
        <filter id="halo" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor={T.bg} floodOpacity="0.95" />
        </filter>
      </defs>

      {visibleLayers.connections && connections.map((conn, i) => {
        const isActive = linkActive(conn);
        const dim = dimmed.has(conn.from) || dimmed.has(conn.to);
        const opacity = isActive ? 0.75 : dim ? 0.12 : 0.38;
        const stroke = isActive ? T.ink : T.inkMuted;
        const dur = (10 + (i % 5) * 2).toFixed(1);
        return (
          <g key={i} opacity={opacity} style={{ transition: 'opacity .2s' }}>
            <path d={conn.d} fill="none" stroke={stroke} strokeWidth={isActive ? 2 : 1.4} strokeDasharray="5 6" strokeLinecap="round" strokeLinejoin="round" />
            {!reducedMotion && (
              <circle r={2.6} fill={T.accent}>
                <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={conn.d} />
              </circle>
            )}
          </g>
        );
      })}

      {visibleLayers.zones && cards.map(card => {
        const zoneDim = card.tiles.every(t => dimmed.has(t.id));
        return (
          <g key={card.zone.id} opacity={zoneDim ? 0.4 : 1} style={{ transition: 'opacity .2s' }}>
            <rect x={card.x} y={card.y} width={card.w} height={card.h} rx={16} fill={T.surface} stroke={card.zone.color} strokeOpacity={0.5} strokeWidth={1.4} />
            <rect x={card.x} y={card.y} width={card.w} height={5} rx={2.5} fill={card.zone.color} opacity={0.9} />
            <g filter="url(#halo)">
              <text x={card.x + PAD} y={card.y + 30} fontFamily={T.fontMono} fontSize={15} fontWeight={600} fill={T.ink}>
                {card.zone.name}
              </text>
              <text x={card.x + PAD} y={card.y + 46} fontFamily={T.fontMono} fontSize={10} letterSpacing={2} fill={T.inkMuted}>
                {card.zone.label}{card.zone.subtitle ? ` · ${card.zone.subtitle}` : ''}
              </text>
            </g>

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
                    x={tile.x}
                    y={tile.y}
                    width={tile.w}
                    height={tile.h}
                    rx={9}
                    fill={isActive ? T.surfaceBorder : T.bg}
                    stroke={isActive ? T.ink : 'rgba(28,28,26,0.14)'}
                    strokeWidth={isActive ? 1.6 : 1}
                  />
                  <g transform={`translate(${tile.x + 14}, ${tile.y + (TILE_H - 20) / 2})`}>
                    <LogoMark key={svc.logo} size={20} />
                  </g>
                  <text
                    x={tile.x + 44}
                    y={tile.y + TILE_H / 2 + 1}
                    fontFamily={T.fontSans}
                    fontSize={12.5}
                    fontWeight={500}
                    fill={T.ink}
                    style={{ pointerEvents: 'none' }}
                  >
                    {svc.name}
                  </text>
                  {visibleLayers.labels && (
                    <circle cx={tile.x + tile.w - 14} cy={tile.y + TILE_H / 2} r={4} fill={statusColor} stroke={T.bg} strokeWidth={1.5} />
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
