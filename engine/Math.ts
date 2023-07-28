interface Vector2 {
  x: number
  y: number
}

interface Vector3 {
  x: number
  y: number
  z: number
}

interface Vector4 {
  x: number
  y: number
  z: number
  w: number
}

interface Rect {
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number
}

interface Tri3D {
  a: Vector3,
  b: Vector3,
  c: Vector3
}

function subtractTris(a: Vector3, b: Vector3): Vector3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }
}

function getNormals(tri: Tri3D): Vector3 {
  const u = subtractTris(tri.b, tri.a)
  const v = subtractTris(tri.c, tri.a)
  const x = (u.y * v.z) - (u.z * v.y)
  const y = (u.z * v.x) - (u.x * v.z)
  const z = (u.x * v.y) - (u.y * v.x)
  return { x, y, z}
}

function normalize3D(vector: Vector3): Vector3 {
  const length = Math.sqrt((vector.x * vector.x) + (vector.y * vector.y) + (vector.z * vector.z))
  return { x: vector.x / length, y: vector.y / length, z: vector.z / length }
}

function rectanglesIntersect(a: Rect, b: Rect): boolean {
  const aLeftOfB = a.xMax < b.xMin
  const aRightOfB = a.xMin > b.xMax
  const aAboveB = a.yMin > b.yMax
  const aBelowB = a.yMax < b.yMin
  return !( aLeftOfB || aRightOfB || aAboveB || aBelowB )
}

function lerp(value1: number, value2: number, amount: number) {
  amount = amount < 0 ? 0 : amount
  amount = amount > 1 ? 1 : amount
  return value1 + (value2 - value1) * amount
}

function clamp(min: number, max: number, val: number): number {
  return val < min ? min : val > max ? max : val
}

export {
  Vector2,
  Vector3,
  Vector4,
  Tri3D,
  getNormals,
  normalize3D,
  subtractTris,
  Rect,
  rectanglesIntersect,
  lerp,
  clamp
}
