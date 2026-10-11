import { useEffect, useRef } from "react";

/** Procedural wireframe icosahedron of points + lines. Lazy-loads three.js, falls back to SVG. */
export default function Sculpture({ interactive = false, className = "" }: { interactive?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    import("three").then((THREE) => {
      if (disposed) return;
      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        el.dataset["fallback"] = "1";
        return;
      }
      const styles = getComputedStyle(document.documentElement);
      const ink = new THREE.Color().setStyle(toRgb(styles.getPropertyValue("--ink")) || "#222");
      const volt = new THREE.Color().setStyle(toRgb(styles.getPropertyValue("--volt")) || "#3b6cff");
      const dark = !!el.closest(".env-dark");
      const lineColor = dark ? new THREE.Color("#d8d6cf") : ink;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      el.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.z = 7;

      const group = new THREE.Group();
      scene.add(group);
      const geo = new THREE.IcosahedronGeometry(1.6, 2);
      const wire = new THREE.LineSegments(
        new THREE.WireframeGeometry(geo),
        new THREE.LineBasicMaterial({ color: lineColor, transparent: true, opacity: 0.35 }),
      );
      group.add(wire);
      const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: volt, size: 0.05 }));
      group.add(pts);
      const inner = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.8)),
        new THREE.LineBasicMaterial({ color: volt }),
      );
      group.add(inner);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.3, 0.004, 4, 160),
        new THREE.MeshBasicMaterial({ color: lineColor, transparent: true, opacity: 0.5 }),
      );
      ring.rotation.x = Math.PI / 2.4;
      group.add(ring);

      const base = (geo.getAttribute("position").array as Float32Array).slice();
      const resize = () => {
        const { width, height } = el.getBoundingClientRect();
        renderer.setSize(width, height, false);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      const target = { x: 0, y: 0 };
      let drag = false, last = { x: 0, y: 0 }, spin = { x: 0, y: 0 }, distort = 0;
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
        if (drag) {
          spin.y += (e.clientX - last.x) * 0.01;
          spin.x += (e.clientY - last.y) * 0.01;
          last = { x: e.clientX, y: e.clientY };
        }
      };
      const onDown = (e: PointerEvent) => { drag = true; last = { x: e.clientX, y: e.clientY }; distort = 1; };
      const onUp = () => { drag = false; };
      window.addEventListener("pointermove", onMove);
      if (interactive) {
        el.addEventListener("pointerdown", onDown);
        window.addEventListener("pointerup", onUp);
      }

      let raf = 0, t = 0;
      const tick = () => {
        t += reduce ? 0 : 0.008;
        const scroll = window.scrollY / window.innerHeight;
        group.rotation.y += (target.x * 0.6 + t + spin.y + scroll * 1.2 - group.rotation.y) * 0.06;
        group.rotation.x += (target.y * 0.4 + spin.x + scroll * 0.4 - group.rotation.x) * 0.06;
        inner.rotation.z -= reduce ? 0 : 0.01;
        distort *= 0.96;
        const pos = geo.getAttribute("position").array as Float32Array;
        for (let i = 0; i < pos.length; i += 3) {
          const n = 1 + Math.sin(t * 3 + i) * 0.03 + Math.sin(i * 1.7 + t * 6) * 0.18 * distort;
          pos[i] = base[i]! * n; pos[i + 1] = base[i + 1]! * n; pos[i + 2] = base[i + 2]! * n;
        }
        geo.getAttribute("position").needsUpdate = true;
        wire.geometry.dispose();
        wire.geometry = new THREE.WireframeGeometry(geo);
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      tick();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointerdown", onDown);
        renderer.dispose();
        renderer.domElement.remove();
      };
    });
    return () => { disposed = true; cleanup(); };
  }, [interactive]);

  return (
    <div ref={ref} className={`group relative ${className} ${interactive ? "cursor-grab active:cursor-grabbing touch-none" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" className="absolute inset-0 m-auto hidden h-2/3 w-2/3 text-silver group-data-[fallback=1]:block">
        <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="currentColor" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" />
      </svg>
    </div>
  );
}

function toRgb(v: string) {
  v = v.trim();
  if (!v) return "";
  // three.js can't parse oklch; render via canvas
  const c = document.createElement("canvas").getContext("2d");
  if (!c) return "";
  c.fillStyle = v;
  c.fillRect(0, 0, 1, 1);
  const [r, g, b] = c.getImageData(0, 0, 1, 1).data;
  return `rgb(${r},${g},${b})`;
}
