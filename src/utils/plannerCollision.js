/**
 * Collision Detection & Non-Overlap Spatial Engine for Haven Room Planner
 * Ensures furniture pieces do not collide or overlap with each other or walls.
 * Rugs (textile floor coverings) are intentionally allowed beneath furniture.
 */

/**
 * Calculates the Axis-Aligned Bounding Box (AABB) in room coordinates (meters).
 */
export function getItemAABB(item, cat) {
  if (!item || !cat) return null;

  const rot = ((item.rot % 360) + 360) % 360;
  const isRot90 = rot === 90 || rot === 270;

  // For 0/180/90/270 standard rotations, or arbitrary angles
  let visualW;
  let visualD;
  if (rot % 90 === 0) {
    visualW = isRot90 ? cat.dM : cat.wM;
    visualD = isRot90 ? cat.wM : cat.dM;
  } else {
    const rad = (rot * Math.PI) / 180;
    visualW = Math.abs(cat.wM * Math.cos(rad)) + Math.abs(cat.dM * Math.sin(rad));
    visualD = Math.abs(cat.wM * Math.sin(rad)) + Math.abs(cat.dM * Math.cos(rad));
  }

  // Center coordinate in room (meters)
  const cx = item.x + cat.wM / 2;
  const cy = item.y + cat.dM / 2;

  return {
    minX: cx - visualW / 2,
    maxX: cx + visualW / 2,
    minY: cy - visualD / 2,
    maxY: cy + visualD / 2,
    visualW,
    visualD,
    cx,
    cy,
    isRug: cat.type === "rug" || cat.category === "accents",
  };
}

/**
 * Checks if two bounding boxes overlap, with a small tolerance margin (2cm).
 */
export function doAABBsOverlap(a, b, margin = 0.02) {
  if (!a || !b) return false;
  if (a.isRug || b.isRug) return false;

  return (
    a.minX < b.maxX - margin &&
    a.maxX > b.minX + margin &&
    a.minY < b.maxY - margin &&
    a.maxY > b.minY + margin
  );
}

/**
 * Checks if a candidate item position collides with room boundaries or any other solid furniture.
 */
export function checkItemCollision(
  testItem,
  placedItems,
  catalog,
  roomWidth,
  roomLength,
  margin = 0.02
) {
  const cat = catalog.find((c) => c.id === testItem.catId);
  if (!cat || cat.type === "rug" || cat.category === "accents") return false;

  const testAABB = getItemAABB(testItem, cat);
  if (!testAABB) return false;

  // Wall perimeter bounds check
  if (
    testAABB.minX < -margin ||
    testAABB.maxX > roomWidth + margin ||
    testAABB.minY < -margin ||
    testAABB.maxY > roomLength + margin
  ) {
    return true;
  }

  // Solid furniture collision check
  for (const other of placedItems) {
    if (other.id === testItem.id) continue;
    const otherCat = catalog.find((c) => c.id === other.catId);
    if (!otherCat || otherCat.type === "rug" || otherCat.category === "accents") continue;

    const otherAABB = getItemAABB(other, otherCat);
    if (doAABBsOverlap(testAABB, otherAABB, margin)) {
      return true;
    }
  }

  return false;
}

/**
 * Finds all item IDs currently overlapping with any other solid piece.
 */
export function getOverlappingItemIds(placedItems, catalog, margin = 0.02) {
  const overlapping = new Set();
  const solidItems = placedItems
    .map((item) => ({ item, cat: catalog.find((c) => c.id === item.catId) }))
    .filter(({ cat }) => cat && cat.type !== "rug" && cat.category !== "accents");

  for (let i = 0; i < solidItems.length; i++) {
    const aBox = getItemAABB(solidItems[i].item, solidItems[i].cat);
    for (let j = i + 1; j < solidItems.length; j++) {
      const bBox = getItemAABB(solidItems[j].item, solidItems[j].cat);
      if (doAABBsOverlap(aBox, bBox, margin)) {
        overlapping.add(solidItems[i].item.id);
        overlapping.add(solidItems[j].item.id);
      }
    }
  }
  return overlapping;
}

/**
 * Resolves a proposed movement of an item, allowing smooth sliding along
 * walls and adjacent furniture without ever penetrating or overlapping.
 */
export function resolveSlidePosition({
  item,
  targetX,
  targetY,
  placedItems,
  catalog,
  roomWidth,
  roomLength,
}) {
  const cat = catalog.find((c) => c.id === item.catId);
  if (!cat) return { x: targetX, y: targetY };

  // Rugs are flat floor coverings - allow free positioning within walls
  if (cat.type === "rug" || cat.category === "accents") {
    const maxX = Math.max(0, roomWidth - cat.wM);
    const maxY = Math.max(0, roomLength - cat.dM);
    return {
      x: Math.max(0, Math.min(maxX, targetX)),
      y: Math.max(0, Math.min(maxY, targetY)),
    };
  }

  const rot = ((item.rot % 360) + 360) % 360;
  const isRot90 = rot === 90 || rot === 270;
  const visualW = isRot90 ? cat.dM : cat.wM;
  const visualD = isRot90 ? cat.wM : cat.dM;

  // Clamp target center within room perimeter
  const minCx = visualW / 2;
  const maxCx = Math.max(minCx, roomWidth - visualW / 2);
  const minCy = visualD / 2;
  const maxCy = Math.max(minCy, roomLength - visualD / 2);

  const targetCx = Math.max(minCx, Math.min(maxCx, targetX + cat.wM / 2));
  const targetCy = Math.max(minCy, Math.min(maxCy, targetY + cat.dM / 2));

  const clampedTargetX = targetCx - cat.wM / 2;
  const clampedTargetY = targetCy - cat.dM / 2;

  const currentX = item.x;
  const currentY = item.y;

  // 1. Check if the direct target is completely free
  const fullCandidate = { ...item, x: clampedTargetX, y: clampedTargetY };
  if (!checkItemCollision(fullCandidate, placedItems, catalog, roomWidth, roomLength)) {
    return { x: clampedTargetX, y: clampedTargetY };
  }

  // 2. Try axis sliding (X-only or Y-only)
  const canSlideX = !checkItemCollision(
    { ...item, x: clampedTargetX, y: currentY },
    placedItems,
    catalog,
    roomWidth,
    roomLength
  );

  const canSlideY = !checkItemCollision(
    { ...item, x: currentX, y: clampedTargetY },
    placedItems,
    catalog,
    roomWidth,
    roomLength
  );

  if (canSlideX && !canSlideY) {
    return { x: clampedTargetX, y: currentY };
  }
  if (canSlideY && !canSlideX) {
    return { x: currentX, y: clampedTargetY };
  }
  if (canSlideX && canSlideY) {
    // Both axes free, slide along axis closest to target
    const distSqX = Math.pow(clampedTargetX - clampedTargetX, 2) + Math.pow(clampedTargetY - currentY, 2);
    const distSqY = Math.pow(clampedTargetX - currentX, 2) + Math.pow(clampedTargetY - clampedTargetY, 2);
    return distSqX <= distSqY
      ? { x: clampedTargetX, y: currentY }
      : { x: currentX, y: clampedTargetY };
  }

  // 3. Binary search along movement axes to find the exact flush touching edge
  let bestX = currentX;
  let lowX = currentX;
  let highX = clampedTargetX;
  for (let i = 0; i < 6; i++) {
    const midX = (lowX + highX) / 2;
    if (!checkItemCollision({ ...item, x: midX, y: currentY }, placedItems, catalog, roomWidth, roomLength)) {
      lowX = midX;
    } else {
      highX = midX;
    }
  }
  bestX = lowX;

  let bestY = currentY;
  let lowY = currentY;
  let highY = clampedTargetY;
  for (let i = 0; i < 6; i++) {
    const midY = (lowY + highY) / 2;
    if (!checkItemCollision({ ...item, x: currentX, y: midY }, placedItems, catalog, roomWidth, roomLength)) {
      lowY = midY;
    } else {
      highY = midY;
    }
  }
  bestY = lowY;

  // Check if combination is valid
  if (!checkItemCollision({ ...item, x: bestX, y: bestY }, placedItems, catalog, roomWidth, roomLength)) {
    return { x: bestX, y: bestY };
  }

  // Otherwise return the axis with greater progress
  if (Math.abs(bestX - currentX) >= Math.abs(bestY - currentY)) {
    return { x: bestX, y: currentY };
  } else {
    return { x: currentX, y: bestY };
  }
}

/**
 * Resolves rotation by 90°. If rotating in place hits a wall or obstacle,
 * tests smart small nudge offsets to clear it. Returns null if blocked.
 */
export function resolveRotateItem(item, placedItems, catalog, roomWidth, roomLength) {
  const cat = catalog.find((c) => c.id === item.catId);
  if (!cat) return null;

  const newRot = (item.rot + 90) % 360;
  const rotatedItem = { ...item, rot: newRot };

  if (cat.type === "rug" || cat.category === "accents") {
    return rotatedItem;
  }

  // 1. In place check
  if (!checkItemCollision(rotatedItem, placedItems, catalog, roomWidth, roomLength)) {
    return rotatedItem;
  }

  // 2. Smart Nudge clearance
  const nudgeSteps = [0.06, -0.06, 0.12, -0.12, 0.18, -0.18, 0.25, -0.25, 0.35, -0.35];
  for (const dx of nudgeSteps) {
    const candidateX = { ...rotatedItem, x: item.x + dx };
    if (!checkItemCollision(candidateX, placedItems, catalog, roomWidth, roomLength)) {
      return candidateX;
    }
    const candidateY = { ...rotatedItem, y: item.y + dx };
    if (!checkItemCollision(candidateY, placedItems, catalog, roomWidth, roomLength)) {
      return candidateY;
    }
  }

  // Diagonal nudges
  for (const dx of nudgeSteps.slice(0, 6)) {
    for (const dy of nudgeSteps.slice(0, 6)) {
      const candidate = { ...rotatedItem, x: item.x + dx, y: item.y + dy };
      if (!checkItemCollision(candidate, placedItems, catalog, roomWidth, roomLength)) {
        return candidate;
      }
    }
  }

  return null; // Blocked
}

/**
 * Finds a nearby clear non-overlapping position for a newly added or cloned piece.
 */
export function findNonOverlappingPosition(
  catId,
  rot = 0,
  preferredX = null,
  preferredY = null,
  placedItems = [],
  catalog = [],
  roomWidth = 6.0,
  roomLength = 4.5
) {
  const cat = catalog.find((c) => c.id === catId);
  if (!cat) return { x: 1, y: 1 };

  const isRot90 = rot === 90 || rot === 270;
  const visualW = isRot90 ? cat.dM : cat.wM;
  const visualD = isRot90 ? cat.wM : cat.dM;

  if (cat.type === "rug" || cat.category === "accents") {
    const initX = preferredX ?? (roomWidth - cat.wM) / 2;
    const initY = preferredY ?? (roomLength - cat.dM) / 2;
    return {
      x: Math.max(0, Math.min(roomWidth - cat.wM, initX)),
      y: Math.max(0, Math.min(roomLength - cat.dM, initY)),
    };
  }

  const startX = Math.max(0, Math.min(roomWidth - visualW, preferredX ?? (roomWidth - visualW) / 2));
  const startY = Math.max(0, Math.min(roomLength - visualD, preferredY ?? (roomLength - visualD) / 2));

  const testItem = {
    id: `temp-${Date.now()}`,
    catId,
    x: startX,
    y: startY,
    rot,
  };

  if (!checkItemCollision(testItem, placedItems, catalog, roomWidth, roomLength)) {
    return { x: startX, y: startY };
  }

  // Spiral search for nearest open position
  const step = 0.3;
  for (let r = step; r < Math.max(roomWidth, roomLength); r += step) {
    const offsets = [
      [r, 0],
      [0, r],
      [-r, 0],
      [0, -r],
      [r, r],
      [-r, r],
      [-r, r],
      [-r, -r],
      [r * 1.4, 0],
      [-r * 1.4, 0],
      [0, r * 1.4],
      [0, -r * 1.4],
    ];

    for (const [ox, oy] of offsets) {
      const candX = Math.max(0, Math.min(roomWidth - visualW, startX + ox));
      const candY = Math.max(0, Math.min(roomLength - visualD, startY + oy));
      const candItem = { ...testItem, x: candX, y: candY };

      if (!checkItemCollision(candItem, placedItems, catalog, roomWidth, roomLength)) {
        return {
          x: Math.round(candX * 100) / 100,
          y: Math.round(candY * 100) / 100,
        };
      }
    }
  }

  return { x: startX, y: startY };
}
