import { MathUtils, Object3D, Vector3 } from 'three';
import {
  GRID_LAYOUT,
  HELIX_LAYOUT,
  SPHERE_LAYOUT,
  TABLE_LAYOUT,
  TETRAHEDRON_LAYOUT,
} from './constants';

function faceOutward(target, center = new Vector3()) {
  const outward = target.position.clone().sub(center).multiplyScalar(2).add(center);
  target.lookAt(outward);
}

function getTetrahedronFaces() {
  const { edgeLength, rotationYDegrees } = TETRAHEDRON_LAYOUT;
  const height = edgeLength * Math.sqrt(2 / 3);
  const baseRadius = edgeLength / Math.sqrt(3);
  const yAxis = new Vector3(0, 1, 0);
  const rotation = MathUtils.degToRad(rotationYDegrees);

  const [apex, back, frontLeft, frontRight] = [
    new Vector3(0, height / 2, 0),
    new Vector3(0, -height / 2, -baseRadius),
    new Vector3(-edgeLength / 2, -height / 2, baseRadius / 2),
    new Vector3(edgeLength / 2, -height / 2, baseRadius / 2),
  ].map((vertex) => vertex.applyAxisAngle(yAxis, rotation));

  const center = apex.clone().add(back).add(frontLeft).add(frontRight).divideScalar(4);
  const faces = [
    [apex, frontLeft, frontRight],
    [apex, frontRight, back],
    [apex, back, frontLeft],
    [back, frontRight, frontLeft],
  ];

  return { center, faces };
}

function getTriangleSlots(count) {
  let rows = 0;
  while ((rows * (rows + 1)) / 2 < count) {
    rows += 1;
  }

  const slots = [];
  for (let row = 0; row < rows; row += 1) {
    const tilesInRow = Math.min(row + 1, count - slots.length);
    for (let column = 0; column < tilesInRow; column += 1) {
      slots.push({ depth: (row + 0.5) / rows, across: (column + 0.5) / tilesInRow });
    }
  }
  return slots;
}

export function tableLayout(count) {
  const { columns, rows, spacingX, spacingY } = TABLE_LAYOUT;
  const centerColumn = (columns - 1) / 2;
  const centerRow = (rows - 1) / 2;

  return Array.from({ length: count }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const target = new Object3D();
    target.position.set((column - centerColumn) * spacingX, (centerRow - row) * spacingY, 0);
    return target;
  });
}

export function sphereLayout(count) {
  return Array.from({ length: count }, (_, index) => {
    const phi = Math.acos(-1 + (2 * index) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;
    const target = new Object3D();
    target.position.setFromSphericalCoords(SPHERE_LAYOUT.radius, phi, theta);
    faceOutward(target);
    return target;
  });
}

export function doubleHelixLayout(count) {
  const { strands, strandOffsetDegrees, radius, angleStep, verticalStep } = HELIX_LAYOUT;
  const tilesPerStrand = Math.ceil(count / strands);
  const centerStep = (tilesPerStrand - 1) / 2;
  const strandOffset = MathUtils.degToRad(strandOffsetDegrees);

  return Array.from({ length: count }, (_, index) => {
    const strand = index % strands;
    const step = Math.floor(index / strands);
    const theta = step * angleStep + strand * strandOffset;
    const y = (centerStep - step) * verticalStep;
    const target = new Object3D();
    target.position.setFromCylindricalCoords(radius, theta, y);
    faceOutward(target, new Vector3(0, y, 0));
    return target;
  });
}

export function gridLayout(count) {
  const { columns, rows, layers, spacingX, spacingY, spacingZ } = GRID_LAYOUT;
  const centerColumn = (columns - 1) / 2;
  const centerRow = (rows - 1) / 2;
  const centerLayer = (layers - 1) / 2;

  return Array.from({ length: count }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns) % rows;
    const layer = Math.floor(index / (columns * rows));
    const target = new Object3D();
    target.position.set(
      (column - centerColumn) * spacingX,
      (centerRow - row) * spacingY,
      (centerLayer - layer) * spacingZ,
    );
    return target;
  });
}

export function tetrahedronLayout(count) {
  const { center, faces } = getTetrahedronFaces();
  const tilesPerFace = Math.ceil(count / faces.length);

  return faces.flatMap(([top, left, right], faceIndex) => {
    const tilesOnFace = Math.max(0, Math.min(tilesPerFace, count - faceIndex * tilesPerFace));
    const faceCenter = top.clone().add(left).add(right).divideScalar(3);
    const normal = faceCenter.clone().sub(center).normalize();
    const up = top.clone().sub(faceCenter).normalize();

    return getTriangleSlots(tilesOnFace).map(({ depth, across }) => {
      const rowStart = top.clone().lerp(left, depth);
      const rowEnd = top.clone().lerp(right, depth);
      const target = new Object3D();
      target.position.copy(rowStart.lerp(rowEnd, across));
      target.up.copy(up);
      target.lookAt(target.position.clone().add(normal));
      return target;
    });
  });
}

export const LAYOUTS = [
  { id: 'table', label: 'TABLE', create: tableLayout },
  { id: 'sphere', label: 'SPHERE', create: sphereLayout },
  { id: 'helix', label: 'HELIX', create: doubleHelixLayout },
  { id: 'grid', label: 'GRID', create: gridLayout },
  { id: 'tetrahedron', label: 'TETRAHEDRON', create: tetrahedronLayout },
];
