interface Vector2 {
    x: number;
    y: number;
}
interface Vector3 {
    x: number;
    y: number;
    z: number;
}
interface Vector4 {
    x: number;
    y: number;
    z: number;
    w: number;
}
interface Rect {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
}
interface Tri3D {
    a: Vector3;
    b: Vector3;
    c: Vector3;
}
declare function subtractTris(a: Vector3, b: Vector3): Vector3;
declare function getNormals(tri: Tri3D): Vector3;
declare function normalize3D(vector: Vector3): Vector3;
declare function rectanglesIntersect(a: Rect, b: Rect): boolean;
declare function lerp(value1: number, value2: number, amount: number): number;
export { Vector2, Vector3, Vector4, Tri3D, getNormals, normalize3D, subtractTris, Rect, rectanglesIntersect, lerp };
//# sourceMappingURL=Math.d.ts.map