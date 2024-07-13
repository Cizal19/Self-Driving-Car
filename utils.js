// linear interpolation
function lerp(A, B, t) {
  return A + (B - A) * t;
}

function getIntersection(A, B, C, D) {
  /* 
    Ix = Ax + (Bx - Ax)t = Cx + (Dx - Cx)u   ---- 1
    Iy = Ay + (By - Ay)t = Cy + (Dy - Cy)u   ---- 2

    From 1,
    Ax + (Bx - Ax)t = Cx + (Dx - Cx)u
    Subtracting Cx on both sides
    (Ax - Cx) + (Bx - Ax)t = (Dx - Cx)u ----- (a)

    From 2,
    Ay + (By - Ay)t = Cy + (Dy - Cy)u
    Subtracting Cy on both sides
    (Ay - Cy) + (By - Ay)t = (Dy - Cy)u
    Multipyling by (Dx - Cx) on both sides
    (Dx - Cx)(Ay - Cy) + (Dx - Cx)(By - Ay)t = (Dy - Cy)(Dx - Cx)u
    From (a) substuting (Dx - Cx)u 
    (Dx - Cx)(Ay - Cy) + (Dx - Cx)(By - Ay)t = (Dy - Cy)(Ax - Cx) + (Dy - Cy)(Bx - Ax)t
    (Dx - Cx)(Ay - Cy) - (Dy - Cy)(Ax - Cx) =  (Dy - Cy)(Bx - Ax)t - (Dx - Cx)(By - Ay)t
    
          (Dx - Cx)(Ay - Cy) - (Dy - Cy)(Ax - Cx)
      t = -----------------------------------------
           (Dy - Cy)(Bx - Ax) - (Dx - Cx)(By - Ay)  
           
    Similarly ,
          (Cy - Ay)(Ax - Bx) - (Cx - Ax)(Ay - By)
      u = -----------------------------------------
           (Dy - Cy)(Bx - Ax) - (Dx - Cx)(By - Ay)

    in code below 
    tTop = (Dx - Cx)(Ay - Cy) - (Dy - Cy)(Ax - Cx)
    Bottom = (Dy - Cy)(Bx - Ax) - (Dx - Cx)(By - Ay)
    uTop = (Cy - Ay)(Ax - Bx) - (Cx - Ax)(Ay - By)
    
    t = tTop / bottom;
    u = uTop / bottom;
  */

  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}
