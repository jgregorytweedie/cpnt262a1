function initialize () {// I have to name it initialize instead of init because I already have other functions being called init, this is to avoid confusion. 
 // import box 2D Lite Javascript module
  import * as box2D from "https://codepen.io/ge1doot/pen/OJXXGKv.js";
  const bodies = box2D.bodies;
  let numBodies = 0;
  let tempo = 0;
  // ---- init canvas ----

  const canvas = {
    elem: document.createElement("canvas"),
    init(w, h) {
      const ctx = this.elem.getContext("2d");
      this.width = w;
      this.height = h;
      this.elem.width = w;
      this.elem.height = h;
      document.body.appendChild(this.elem);
      this.resize();
      window.addEventListener("resize", () => this.resize(), false);
      return ctx;
    },
    resize() {
      let o = this.elem;
      this.sx = this.width / this.elem.offsetWidth;
      this.sy = this.height / this.elem.offsetHeight;
      for (this.left = 0, this.top = 0; o != null; o = o.offsetParent) {
        this.left += o.offsetLeft;
        this.top += o.offsetTop;
      }
    }
  };

  // ---- init pointer ----

  const pointer = {
    x: 0,
    y: 0,
    init() {
      window.addEventListener("mousemove", (e) => this.move(e), false);
      canvas.elem.addEventListener("touchmove", (e) => this.move(e), false);
      window.addEventListener("mousedown", (e) => this.down(e), false);
      window.addEventListener("touchstart", (e) => this.down(e), false);
    },
    move(e) {
      let touchMode = e.targetTouches,
        pointer;
      if (touchMode) {
        e.preventDefault();
        pointer = touchMode[0];
      } else pointer = e;
      this.x = (-canvas.left + pointer.clientX) * canvas.sx;
      this.y = (-canvas.top + pointer.clientY) * canvas.sy;
    },
    down(e) {
      this.move(e);
      e.preventDefault();
      const over = box2D.isPointerInside(ctx, this.x, this.y);
      if (over !== false && over.invMass > 0) {
        if (over.group !== "") {
          const group = over.group;
          for (const body of bodies) {
            if (body.group === group) {
              body.velocity.x = Math.random() * 500 - 250;
              body.velocity.y = -Math.random() * 400;
              if (body.gravity < 0) body.gravity = 40;
              box2D.remove.joints(body);
              body.group = "";
              body.fillColor = "#bbb";
              body.age = 0;
            }
          }
          numBodies--;
          tempo = 0;
        }
      }
    }
  };

  // ---- main loop ----
  let frame = 0;
  const run = () => {
    requestAnimationFrame(run);
    ctx.fillStyle = "#eee";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    box2D.step();

    for (const body of bodies) {
      body.drawLines(ctx);
      ctx.strokeStyle = "#555";
      ctx.fillStyle = body.fillColor;
      ctx.fill();
      ctx.stroke();
    }
    
    let ok = true;
    for (const body of bodies) {
      if (body.invMass > 0.0 && body.group === "" && tempo > 100 && ok === true) {
        ok = false;
        box2D.remove.body(body);
      }
    }

    if (frame % 140 === 0) {
      if (numBodies < 10) {
        ragdoll(
          100 + Math.floor(Math.random() * 600),
          -1000,
          Math.floor(Math.random() * 360)
        );
      }
    }
    frame++;
    tempo++;
  };

  // ---- setup ----

  const ctx = canvas.init(800, 800);
  pointer.init();
  const assets = "https://assets.codepen.io/222599/";
  console.clear();

  box2D.set.gravity(40);
  box2D.set.iterations(40);
  box2D.set.friction(2.0);
  box2D.set.timeStep(1 / 20);
  box2D.set.allowedPenetration(10.0);

  box2D.clear();

  // ground
  let ground = box2D.addBody(400, 850, 800, 100, Infinity);

  // side walls
  box2D.addBody(-50, 400, 100, 800, Infinity, { friction: 0.0 });
  box2D.addBody(850, 400, 100, 800, Infinity, { friction: 0.0 });

  // ragdoll

  const ragdoll = (x, y, hue) => {
    const lum = Math.floor(Math.random() * 40);
    const col1 = `hsl(${hue},50%, ${20 + lum}%`;
    const col2 = `hsl(${hue},50%, ${40 + lum}%`;
    const name = Math.floor(Math.random() * 10000);
    const t1 = box2D.addBody(x, y - 10, 60, 60, -1, {
      group: name,
      fillColor: col1
    });
    const c0 = box2D
      .addBody(x, y + 40, 25, 20, -1, { group: name, fillColor: col2 })
      .addJoint(t1, 0, -10, 0, 35, 0);
    const c1 = box2D
      .addBody(x, y + 55, 100, 10, -1, { group: name, fillColor: col1 })
      .addJoint(c0, 0, -5, 0, 10, 0);
    const b1 = box2D
      .addBody(x, y + 65, 25, 10, -1, { group: name, fillColor: col2 })
      .addJoint(c1, 0, -5, 0, 5, 0);
    const c2 = box2D
      .addBody(x, y + 75, 100, 10, -1, { group: name, fillColor: col1 })
      .addJoint(b1, 0, -5, 0, 5, 0);
    const b2 = box2D
      .addBody(x, y + 85, 25, 10, -1, { group: name, fillColor: col2 })
      .addJoint(c2, 0, -5, 0, 5, 0);
    const c3 = box2D
      .addBody(x, y + 95, 100, 10, -1, { group: name, fillColor: col1 })
      .addJoint(b2, 0, -5, 0, 5, 0);
    const b3 = box2D
      .addBody(x, y + 105, 25, 10, -1, { group: name, fillColor: col2 })
      .addJoint(c3, 0, -5, 0, 5, 0);
    const c4 = box2D
      .addBody(x, y + 115, 100, 10, -1, { group: name, fillColor: col1 })
      .addJoint(b3, 0, -5, 0, 5, 0);
    const b4 = box2D
      .addBody(x, y + 125, 25, 15, -1, { group: name, fillColor: col2 })
      .addJoint(c4, 0, -8.5, 0, 5, 0);
    const b5 = box2D
      .addBody(x, y + 140, 25, 15, -1, { group: name, fillColor: col2 })
      .addJoint(b4, 0, -8.5, 0, 8.5, 0);
    const b6 = box2D
      .addBody(x, y + 155, 25, 15, -1, { group: name, fillColor: col2 })
      .addJoint(b5, 0, -8.5, 0, 8.5, 0);
    const h1 = box2D
      .addBody(x, y + 185, 100, 30, -1, { group: name, fillColor: col1 })
      .addJoint(b6, 0, -15, 0, 7.5, 0);
    const l1 = box2D
      .addBody(x - 25, y + 240, 30, 80, -1, { group: name, fillColor: col2 })
      .addJoint(h1, 0, -40, -25, 15, 0.05);
    const p1 = box2D
      .addBody(x - 25, y + 330, 20, 100, -1, { group: name, fillColor: col2 })
      .addJoint(l1, 0, -52.5, 0, 42.5, 0);
    const p3 = box2D
      .addBody(x - 25, y + 390, 30, 20, -1, { group: name, fillColor: col1 })
      .addJoint(p1, 0, -12.5, 0, 52.5, 0);
    const l2 = box2D
      .addBody(x + 25, y + 240, 30, 80, -1, { group: name, fillColor: col2 })
      .addJoint(h1, 0, -40, 25, 15, 0.05);
    const p2 = box2D
      .addBody(x + 25, y + 330, 20, 100, -1, { group: name, fillColor: col2 })
      .addJoint(l2, 0, -52.5, 0, 42.5, 0);
    const p4 = box2D
      .addBody(x + 25, y + 390, 30, 20, -1, { group: name, fillColor: col1 })
      .addJoint(p2, 0, -12.5, 0, 52.5, 0);
    const e1 = box2D
      .addBody(x - 75, y + 60, 40, 40, -1, { group: name, fillColor: col1 })
      .addJoint(c1, 22.5, 0, -52.5, 0, 0.1);
    const e2 = box2D
      .addBody(x + 75, y + 60, 40, 40, -1, { group: name, fillColor: col1 })
      .addJoint(c1, -22.5, 0, 52.5, 0, 0.1);
    const r1 = box2D
      .addBody(x - 75, y + 115, 20, 60, -1, { group: name, fillColor: col2 })
      .addJoint(e1, 0, -32.5, 0, 22.5, 0);
    const r2 = box2D
      .addBody(x + 75, y + 115, 20, 60, -1, { group: name, fillColor: col2 })
      .addJoint(e2, 0, -32.5, 0, 22.5, 0);
    const a1 = box2D
      .addBody(x - 75, y + 190, 15, 80, -1, { group: name, fillColor: col2 })
      .addJoint(r1, 0, -42.5, 0, 32.5, 0);
    const a2 = box2D
      .addBody(x + 75, y + 190, 15, 80, -1, { group: name, fillColor: col2 })
      .addJoint(r2, 0, -42.5, 0, 32.5, 0);
    const m1 = box2D
      .addBody(x - 75, y + 250, 25, 30, -1, {
        group: name,
        gravity: -150 * Math.random(),
        fillColor: col1
      })
      .addJoint(a1, 0, -17.5, 0, 42.5, 0);
    const m2 = box2D
      .addBody(x + 75, y + 250, 25, 30, -1, {
        group: name,
        gravity: -150 * Math.random(),
        fillColor: col1
      })
      .addJoint(a2, 0, -17.5, 0, 42.5, 0);
    numBodies++;
  };

  ragdoll(200, 100, Math.floor(Math.random() * 360));
  ragdoll(400, 100, Math.floor(Math.random() * 360));
  ragdoll(600, 100, Math.floor(Math.random() * 360));

  run();
}
window.addEventListener("load", (initialize) => {
  console.log("page has fully loaded");
});