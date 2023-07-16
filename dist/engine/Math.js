function subtractTris(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}
function getNormals(tri) {
    const u = subtractTris(tri.b, tri.a);
    const v = subtractTris(tri.c, tri.a);
    const x = (u.y * v.z) - (u.z * v.y);
    const y = (u.z * v.x) - (u.x * v.z);
    const z = (u.x * v.y) - (u.y * v.x);
    return { x, y, z };
}
function normalize3D(vector) {
    const length = Math.sqrt((vector.x * vector.x) + (vector.y * vector.y) + (vector.z * vector.z));
    return { x: vector.x / length, y: vector.y / length, z: vector.z / length };
}
function rectanglesIntersect(a, b) {
    const aLeftOfB = a.xMax < b.xMin;
    const aRightOfB = a.xMin > b.xMax;
    const aAboveB = a.yMin > b.yMax;
    const aBelowB = a.yMax < b.yMin;
    return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
}
function lerp(value1, value2, amount) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
}
export { getNormals, normalize3D, subtractTris, rectanglesIntersect, lerp };
