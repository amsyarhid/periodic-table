import { MathUtils, Object3D, Vector3 } from 'three';
import { GRID_LAYOUT, HELIX_LAYOUT, SPHERE_LAYOUT, TABLE_LAYOUT } from './constants';

function faceOutward(target, center = new Vector3()) {
  const outward = target.position.clone().sub(center).multiplyScalar(2).add(center);
  target.lookAt(outward);
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

export const LAYOUTS = [
  { id: 'table', label: 'TABLE', create: tableLayout },
  { id: 'sphere', label: 'SPHERE', create: sphereLayout },
  { id: 'helix', label: 'HELIX', create: doubleHelixLayout },
  { id: 'grid', label: 'GRID', create: gridLayout },
];
