const deg = 180;
let orig = [];
let x, y, z, xp, yp;

const zp = 150;
const dtheta = 5;
const dalpha = 5;
const dbeta = 1;
const dphi = 2.3;

const x0 = 0, y0 = 0, z0 = 1000;

let r1 = 600, r2 = 300;
let counter = 0;
let light = [0, 0, 0];
let a, b;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  for (let j = 0; j < (2 * deg) / dtheta; j++) {
    x = x0 + (r1 + r2 * cos(j * dtheta));
    y = y0 + r2 * sin(j * dtheta);
    z = z0;
    orig.push([x, y, z]);
  }
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  scale(1, -1);
  noStroke();

  let torus = [];
  let torus2 = [];

  for (let i = 0; i < (2 * deg) / dalpha; i++) {
    let circ = [];

    for (let j = 0; j < orig.length; j++) {
      x = x0 + (orig[j][0] - x0) * cos(i * dalpha) + (orig[j][2] - z0) * sin(i * dalpha);
      y = y0 + (orig[j][1] - y0);
      z = z0 + (orig[j][0] - x0) * sin(i * dalpha) + (orig[j][2] - z0) * cos(i * dalpha);
      circ.push([x, y, z]);
    }

    torus.push(circ);
  }

  for (let i = 0; i < torus.length; i++) {
    let circ2 = [];

    for (let j = 0; j < torus[i].length; j++) {
      let xx = torus[i][j][0];
      let yx = (torus[i][j][1] - y0) * cos(dbeta * counter) - (torus[i][j][2] - z0) * sin(dbeta * counter);
      let zx = (torus[i][j][1] - y0) * sin(dbeta * counter) + (torus[i][j][2] - z0) * cos(dbeta * counter);

      let x1 = xx * cos(dphi * counter) + yx * sin(dphi * counter);
      let y1 = -1 * xx * sin(dphi * counter) + yx * cos(dphi * counter);
      let z1 = zx;

      circ2.push([x1, y1, z1]);
    }

    torus2.push(circ2);
  }

  for (let i = 0; i < torus2.length; i++) {
    let centerx = r1 * cos(-dalpha * i) * cos(dphi * counter) + r1 * sin(-dalpha * i) * sin(dbeta * counter) * sin(dphi * counter);
    let centery = -r1 * cos(-dalpha * i) * sin(dphi * counter) + r1 * sin(-dalpha * i) * sin(dbeta * counter) * cos(dphi * counter);
    let centerz = -r1 * sin(-dalpha * i) * cos(dbeta * counter);
    let centerabs = sqrt(centerx * centerx + centery * centery + centerz * centerz);

    let cxp = (centerx + x0) * (zp / (centerz + z0));
    let cyp = (centery + y0) * (zp / (centerz + z0));

    for (let j = 0; j < torus2[i].length; j++) {
      let x2 = torus2[i][j][0];
      let y2 = torus2[i][j][1];
      let z2 = torus2[i][j][2];

      let Nx = x2 - centerx;
      let Ny = y2 - centery;
      let Nz = z2 - centerz;

      let normalabs = sqrt(Nx * Nx + Ny * Ny + Nz * Nz);
      Nx /= normalabs;
      Ny /= normalabs;
      Nz /= normalabs;

      let lvectorx = -((x2 + x0) - light[0]);
      let lvectory = -((y2 + y0) - light[1]);
      let lvectorz = -((z2 + z0) - light[2]);

      let lightabs = sqrt(lvectorx*lvectorx + lvectory*lvectory + lvectorz*lvectorz);
      lvectorx /= lightabs;
      lvectory /= lightabs;
      lvectorz /= lightabs;

      let Brightness = Nx * lvectorx + Ny * lvectory + Nz * lvectorz;
      Brightness = constrain(Brightness, 0, 1);

      let xp = (x0 + x2) * (zp / (z2 + z0));
      let yp = (y0 + y2) * (zp / (z2 + z0));

      if (Brightness > 0) {
        fill(Brightness * 255);
        circle(xp, yp, 2);
      }


    }
  }

  counter++;

}
