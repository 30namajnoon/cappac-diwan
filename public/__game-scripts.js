var Models = pc.createScript("models");
(Models.prototype.initialize = function () {
  (this.dolaplar = []), (this.modelSelected = null), (this.modelNo = 0);
}),
  (Models.prototype.draw = function (e = new Data()) {
    const o = setData(e);
    o.models.forEach((e) => {
      switch (e.name) {
        case "alt dolabi":
          e.modelsSize.forEach((e) => {
            let {
              en: o,
              model: t,
              derinlik: a,
              boy: l,
              raf: i,
              arkalik: d,
              govde: s,
              kapak: r,
              adet: h,
            } = e;
            this.dolaplar.push(
              new AltDolabi(t, m(o), m(l), m(a), m(d), m(s), m(r), i, h)
            );
          });
          break;
        case "çekmece dolabi":
          e.modelsSize.forEach((e) => {
            let {
              en: o,
              model: t,
              derinlik: a,
              boy: l,
              cekmece: i,
              arkalik: d,
              govde: s,
              kapak: r,
              adet: h,
            } = e;
            this.dolaplar.push(
              new CekmeceDolabi(t, m(o), m(l), m(a), m(d), m(s), m(r), i, h)
            );
          });
      }
    }),
      this.dolaplar.forEach((e) => {
        e.draw(this.app.root);
      }),
      this.moveList("N"),
      this.entity.script.index.projectData.setProjectName(o.name);
  }),
  (Models.prototype.moveList = function (e = "L") {
    switch (e) {
      case "L":
        this.modelNo > 0
          ? this.modelNo--
          : (this.modelNo = this.dolaplar.length - 1);
        break;
      case "R":
        this.modelNo < this.dolaplar.length - 1
          ? this.modelNo++
          : (this.modelNo = 0);
    }
    this.dolaplar.forEach((e) => {
      e.root.enabled = !1;
    }),
      (this.dolaplar[this.modelNo].root.enabled = !0),
      (this.modelSelected = this.dolaplar[this.modelNo]),
      this.entity.script.index.projectData.setModelData(
        this.modelSelected.toData()
      );
  }),
  (Models.prototype.update = function (e) {});
var CameraMove = pc.createScript("cameraMove");
CameraMove.attributes.add("distancia", { type: "number", default: 50 }),
  CameraMove.attributes.add("sensibilidad", {
    type: "number",
    default: 0.1,
    min: 0,
    max: 1,
  }),
  (CameraMove.prototype.initialize = function () {
    (this.look = this.app.root),
      this.entity.lookAt(this.look.getPosition()),
      (this.rotation = this.entity.getLocalRotation()),
      (this.xl = 0),
      (this.yl = 250),
      (this.t = !1),
      this.app.mouse.on(pc.EVENT_MOUSEDOWN, (t) => {
        this.t = !0;
        let i = t.x,
          e = t.y,
          s = this.xl,
          o = this.yl;
        this.app.mouse.on(pc.EVENT_MOUSEMOVE, (t) => {
          if (this.t) {
            let a = t.x - i,
              n = t.y - e;
            (this.xl = s + a), (this.yl = o + n);
          }
        });
      }),
      this.app.mouse.on(pc.EVENT_MOUSEUP, (t) => {
        this.t = !1;
      });
  }),
  (CameraMove.prototype.update = function (t) {
    let i = this.look.getPosition();
    this.entity.lookAt(i);
    let e = new pc.Quat().setFromEulerAngles(
      -this.yl * this.sensibilidad,
      -this.xl * this.sensibilidad,
      0
    );
    this.entity.setPosition(this.look.getPosition()),
      this.entity.setRotation(e),
      this.entity.translateLocal(0, 0.2, this.distancia);
  });
var PickerRaycast = pc.createScript("pickerRaycast");
(PickerRaycast.prototype.initialize = function () {
  (this.camera = this.app.root.findByName("Camera")),
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onSelect, this),
    this.on(
      "destroy",
      function () {
        this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.onSelect, this);
      },
      this
    );
}),
  (PickerRaycast.prototype.onSelect = function (t) {
    let a = this.camera.camera.screenToWorld(
      t.x,
      t.y,
      this.camera.camera.nearClip
    );
    var e = this.camera.camera.screenToWorld(
        t.x,
        t.y,
        this.camera.camera.farClip
      ),
      i = this.app.systems.rigidbody.raycastFirst(a, e);
    if (i) {
      var r = i.entity;
      this.entity.lookAt(r.getPosition());
    }
  });
function AddNewProject(e, t) {
  (this.root = t),
    (this.display = !1),
    (this.container = createElement({
      tagName: "div",
      className: "addNewProduct-container",
    })),
    (this.sablon = createElement({
      container: this.container,
      tagName: "a",
      href: e,
      innerHTML: "Sablon indir",
      attributs: [{ name: "download", value: "sablon" }],
    })),
    (this.file = createElement({
      container: this.container,
      tagName: "input",
      type: "file",
    })),
    (this.button = createElement({
      container: this.container,
      tagName: "input",
      type: "button",
      value: "olculeri indir",
    })),
    this.button.addEventListener("click", () => {
      this.file.click();
    }),
    this.file.addEventListener("input", () => {
      let e = new XMLHttpRequest();
      e.open("POST", "/dataDownload", !0);
      let t = new FormData();
      t.append("file", this.file.files[0]),
        t.append("fileName", this.file.name);
      let a = this.root,
        i = this.setDisplay.bind(this);
      (e.onreadystatechange = function () {
        4 == e.readyState &&
          200 == e.status &&
          (a.script.models.draw(JSON.parse(e.responseText)), i());
      }),
        e.send(t);
    }),
    this.setDisplay();
}
function ModelSize(
  e,
  t = document.body,
  a,
  i = {
    cNames: ["EN", "BOY", "DERINLIK", "RAF", "ADET"],
    cValues: [mm(this.w), mm(this.h), mm(this.l), this.raf, this.adet],
  }
) {
  (this.modelSize = i),
    (this.nextLeft = createElement({
      container: t,
      tagName: "span",
      innerHTML: "keyboard_double_arrow_left",
      className: "material-symbols-rounded",
      id: "nextLeft",
    })),
    (this.nextRight = createElement({
      container: t,
      tagName: "span",
      innerHTML: "keyboard_double_arrow_right",
      className: "material-symbols-rounded",
      id: "nextRight",
    })),
    (this.modelName = createElement({
      container: t,
      tagName: "div",
      className: "modelName",
      innerHTML: a,
    })),
    (this.container = createElement({
      container: t,
      tagName: "div",
      className: "modelSize-container",
    })),
    this.modelSize.cNames.map((e, t) => {
      let a = createElement({
        container: this.container,
        tagName: "div",
        className: "cContainer",
      });
      createElement({
        container: a,
        tagName: "div",
        innerHTML: e,
        className: "cName",
      }),
        createElement({
          container: a,
          tagName: "div",
          innerHTML: this.modelSize.cValues[t],
          className: "cValue",
        });
      return a;
    }),
    this.nextLeft.addEventListener("click", () => {
      e.script.models.moveList("L");
    }),
    this.nextRight.addEventListener("click", () => {
      e.script.models.moveList("R");
    });
}
function MaterialSize(
  e,
  t = {
    govde: {
      kalinlik: this.govde,
      cNames: ["", "EN", "BOY", "ADET", "KENAR BANDI", "KENAR BANDI(M)", "M2"],
      cValues: [
        {
          name: "ALT",
          value: [
            mm(this.l) - (mm(this.kapak) - 2),
            mm(this.w),
            this.adet,
            "2 BOY 2 EN",
            (2 * this.w + 2 * this.l) * this.adet,
            (this.w * this.l * this.adet).toFixed(2),
          ],
        },
        {
          name: "YAN",
          value: [
            mm(this.l) - (mm(this.kapak) - 2),
            mm(this.h) - mm(this.govde),
            2 * this.adet,
            "2 BOY 1 EN",
            ((2 * this.h + this.l) * this.adet * 2).toFixed(2),
            ((this.h - this.govde) * this.l * this.adet * 2).toFixed(2),
          ],
        },
        {
          name: "SABIT",
          value: [
            mm(100),
            mm(this.w) - mm(2 * this.govde),
            2 * this.adet,
            "2 BOY",
            (2 * this.w * this.adet * 2).toFixed(2),
            (0.1 * (this.w - 2 * this.govde) * this.adet * 2).toFixed(2),
          ],
        },
      ],
    },
    arkalik: {
      kalinlik: this.arka,
      cNames: ["EN", "BOY", "ADET", "M2"],
      cValues: [
        [
          mm(this.w) - mm(19),
          mm(this.h) - mm(19),
          this.adet,
          (this.w - 0.019) * (this.h - 0.019) * this.adet,
        ],
      ],
    },
  }
) {
  (this.materialsSizes = t),
    (this.kalinlik1 = createElement({
      container: e,
      tagName: "div",
      className: "kalinlik",
      innerHTML: this.materialsSizes.govde.kalinlik + "mm",
    })),
    (this.container1 = createElement({
      container: e,
      tagName: "div",
      className: "materialSize-container",
    })),
    (this.sizes1 = this.materialsSizes.govde.cNames.map((e, t) => {
      let a = createElement({
        container: this.container1,
        tagName: "div",
        className: "cContainer",
      });
      createElement({
        container: a,
        tagName: "div",
        innerHTML: e,
        className: "cName",
      });
      return (
        t > 0
          ? this.materialsSizes.govde.cValues.forEach((e) => {
              createElement({
                container: a,
                tagName: "div",
                innerHTML: e.value[t - 1],
                className: "value",
              });
            })
          : this.materialsSizes.govde.cValues.forEach((e, t) => {
              createElement({
                container: a,
                tagName: "div",
                innerHTML: e.name,
                className: "name",
              });
            }),
        a
      );
    })),
    (this.kalinlik1 = createElement({
      container: e,
      tagName: "div",
      className: "kalinlik",
      innerHTML: this.materialsSizes.arkalik.kalinlik + "mm",
    })),
    (this.container2 = createElement({
      container: e,
      tagName: "div",
      className: "materialSize-container",
    })),
    (this.sizes2 = this.materialsSizes.arkalik.cNames.map((e, t) => {
      let a = createElement({
        container: this.container2,
        tagName: "div",
        className: "cContainer",
      });
      createElement({
        container: a,
        tagName: "div",
        innerHTML: e,
        className: "cName",
      });
      return (
        this.materialsSizes.arkalik.cValues.forEach((e) => {
          createElement({
            container: a,
            tagName: "div",
            innerHTML: e[t],
            className: "value",
          });
        }),
        a
      );
    }));
}
function ModelsData(e) {
  (this.entity = e),
    (this.container = createElement({
      tagName: "div",
      className: "modelsData-container",
    })),
    (this.projectName = createElement({
      tagName: "h1",
      container: this.container,
      className: "projectName",
      innerHTML: "Proje adi:",
    })),
    (this.dataContainer = createElement({
      container: this.container,
      tagName: "div",
      className: "dataContainer",
    }));
}
(AddNewProject.prototype.setDisplay = function () {
  this.display
    ? ((this.container.style.visibility = "hidden"), (this.display = !1))
    : ((this.container.style.visibility = "visible"), (this.display = !0));
}),
  (ModelsData.prototype.setProjectName = function (e) {
    this.projectName.innerHTML = "Proje adi:" + e;
  }),
  (ModelsData.prototype.setModelData = function (e = {}) {
    (this.dataContainer.innerHTML = ""),
      (this.modelSize = new ModelSize(
        this.entity,
        this.dataContainer,
        e.model,
        e.modelSize
      )),
      (this.materialsSizes = new MaterialSize(
        this.dataContainer,
        e.materialsSizes
      ));
  });
var Index = pc.createScript("index");
Index.attributes.add("style", { type: "asset", assetType: "css" }),
  Index.attributes.add("icons", { type: "asset", assetType: "text" }),
  (Index.prototype.initialize = function () {
    this.setCanvas(),
      window.addEventListener("resize", () => {
        this.setCanvas();
      }),
      (document.head.innerHTML += this.icons.resource),
      (this.css = createElement({
        container: document.head,
        tagName: "style",
        innerHTML: this.style.resource,
      })),
      window.addEventListener("keydown", (e) => {
        76 == e.keyCode && (this.css.innerHTML = this.style.resource);
      }),
      (this.projectData = new ModelsData(this.entity)),
      (this.sablonURL = "./JALIL MAHMOOD.xlsx"),
      (this.addProjectPage = new AddNewProject(this.sablonURL, this.entity));
  }),
  (Index.prototype.setCanvas = function () {
    let e = document.getElementById("application-canvas");
    (e.style.width = innerWidth + "px"),
      (e.style.height = innerHeight / 2 + "px"),
      (e.style.position = "relative");
  }),
  (Index.prototype.update = function (e) {});
var Altd = pc.createScript("altd");
function AltDolabi(
  t = "",
  i = 1,
  s = 0.9,
  h = 0.6,
  a = m(8),
  e = m(18),
  o = m(18),
  l = 3,
  d = 1
) {
  (this.model = t),
    (this.adet = d),
    (this.raf = l),
    (this.w = i),
    (this.h = s),
    (this.l = h),
    (this.arka = a),
    (this.govde = e),
    (this.kapak = o),
    (this.root = new pc.Entity()),
    (this.botom = cubeEntity()),
    (this.left = cubeEntity()),
    (this.right = cubeEntity()),
    (this.sabit1 = cubeEntity()),
    (this.sabit2 = cubeEntity()),
    (this.arkalik = cubeEntity()),
    (this.raflar = []);
  for (let t = 0; t < this.raf; t++) this.raflar.push(cubeEntity());
}
(AltDolabi.prototype.setSize = function (t, i, s, h, a, e) {
  this.botom.setLocalScale(t, a, s - (e + m(2))),
    this.botom.setLocalPosition(0, a / 2, 0),
    this.left.setLocalScale(a, i - a, s - (e + m(2))),
    this.left.setLocalPosition(-(t / 2 - a / 2), i / 2 + a / 2, 0),
    this.right.setLocalScale(a, i - a, s - (e + m(2))),
    this.right.setLocalPosition(t / 2 - a / 2, i / 2 + a / 2, 0),
    this.sabit1.setLocalScale(t - 2 * a, a, m(100)),
    this.sabit1.setLocalPosition(0, i - a / 2, s / 2 - m(50) - (e + m(2)) / 2),
    this.sabit2.setLocalScale(t - 2 * a, a, m(100)),
    this.sabit2.setLocalPosition(
      0,
      i - a / 2,
      -(s / 2 - m(50) - (e + m(2)) / 2)
    ),
    this.arkalik.setLocalScale(t - m(19), i - m(19), h),
    this.arkalik.setLocalPosition(
      0,
      this.arkalik.getLocalScale().y / 2,
      -this.botom.getLocalScale().z / 2 + h / 2 + m(12)
    ),
    this.raflar.forEach((h, o) => {
      console.log(h),
        h.setLocalScale(t - 2 * a - m(2), a, s - m(30) - e - m(2)),
        h.setLocalPosition(0, (i / (this.raf + 1)) * (o + 1), 0);
    });
}),
  (AltDolabi.prototype.draw = function (t = new pc.Entity()) {
    this.root.addChild(this.botom),
      this.root.addChild(this.left),
      this.root.addChild(this.right),
      this.root.addChild(this.sabit1),
      this.root.addChild(this.sabit2),
      this.root.addChild(this.arkalik),
      this.raflar.forEach((t) => {
        this.root.addChild(t);
      }),
      t.addChild(this.root),
      this.setSize(this.w, this.h, this.l, this.arka, this.govde, this.kapak);
  }),
  (AltDolabi.prototype.toData = function () {
    return {
      model: this.model,
      modelSize: {
        cNames: ["EN", "BOY", "DERINLIK", "RAF", "ADET"],
        cValues: [mm(this.w), mm(this.h), mm(this.l), this.raf, this.adet],
      },
      materialsSizes: {
        govde: {
          kalinlik: mm(this.govde),
          cNames: [
            "P",
            "BOY",
            "EN",
            "ADET",
            "KENAR BANDI",
            "KENAR BANDI(M)",
            "M2",
          ],
          cValues: [
            {
              name: "ALT",
              value: [
                mm(this.w),
                mm(this.l) - (mm(this.kapak) + 2),
                this.adet,
                "2 BOY 2 EN",
                kB(this.w, this.l, 2, 2, this.adet),
                m2(this.w, this.l, this.adet),
              ],
            },
            {
              name: "YAN",
              value: [
                mm(this.h) - mm(this.govde),
                mm(this.l) - (mm(this.kapak) + 2),
                2 * this.adet,
                "2 BOY 1 EN",
                kB(
                  this.h - this.govde,
                  this.l - (this.kapak + m(2)),
                  2,
                  1,
                  2 * this.adet
                ),
                m2(
                  this.h - this.govde,
                  this.l - (this.kapak + m(2)),
                  2 * this.adet
                ),
              ],
            },
            {
              name: "RAF",
              value: [
                mm(this.w - (2 * this.govde - m(2))).toFixed(0),
                mm(this.l - m(30) - (this.kapak + m(2))).toFixed(0),
                this.raf * this.adet,
                "2 BOY 2 EN",
                kB(this.w, this.l, 2, 2, this.adet * this.raf),
                m2(
                  this.w - 2 * this.govde,
                  this.l - m(30),
                  this.adet * this.raf
                ),
              ],
            },
            {
              name: "SABIT",
              value: [
                mm(this.w) - mm(2 * this.govde),
                mm(0.1),
                2 * this.adet,
                "2 BOY",
                kB(this.w, m(100), 2, 0, 2 * this.adet),
                m2(this.w - 2 * this.govde, m(100), 2 * this.adet),
              ],
            },
          ],
        },
        arkalik: {
          kalinlik: mm(this.arka),
          cNames: ["EN", "BOY", "ADET", "M2"],
          cValues: [
            [
              mm(this.w - m(30)).toFixed(0),
              mm(this.h - m(19)).toFixed(0),
              this.adet,
              m2(this.w - m(19), this.h - m(19), this.adet),
            ],
          ],
        },
      },
    };
  });
var Librerias = pc.createScript("librerias");
function cubeEntity() {
  let e = new pc.Entity();
  return e.addComponent("render", { type: "box" }), e;
}
function m(e) {
  return e / 1e3;
}
function mm(e) {
  return 1e3 * e;
}
function m2(e, n, t) {
  return (e * n * t).toFixed(2);
}
function kB(e, n, t, r, c) {
  return ((e * t + n * r) * c).toFixed(2);
}
function createMesh(e = [[]]) {
  let n = [];
  return (
    e.forEach((e) => {
      let t = new pc.Mesh(app.graphicsDevice);
      t.setPositions(e), t.update();
      let r = new pc.StandardMaterial();
      r.update(), n.push(new pc.MeshInstance(t, r));
    }),
    n
  );
}
function cncModel1(e = 1, n = 1, t = 0.5, r = 0.018) {
  let c = createMesh([
      [e, 0, 0, 0, 0, 0, e, 0, t],
      [0, 0, t, e, 0, t, 0, 0, 0],
      [0, 0, t, 0, 0, n, t, 0, n],
      [t, 0, n, t, 0, t, 0, 0, t],
      [t, 0, t, t, 0, n, e, 0, t],
      [e, -r, t, 0, -r, 0, e, -r, 0],
      [0, -r, 0, e, -r, t, 0, -r, t],
      [t, -r, n, 0, -r, n, 0, -r, t],
      [0, -r, t, t, -r, t, t, -r, n],
      [e, -r, t, t, -r, n, t, -r, t],
      [0, 0, n, 0, -r, n, t, -r, n],
      [t, -r, n, t, 0, n, 0, 0, n],
      [0, 0, n, 0, 0, 0, 0, -r, 0],
      [0, -r, 0, 0, -r, n, 0, 0, n],
      [0, 0, 0, e, 0, 0, e, -r, 0],
      [e, -r, 0, 0, -r, 0, 0, 0, 0],
      [e, 0, 0, e, 0, t, e, -r, t],
      [e, -r, t, e, -r, 0, e, 0, 0],
      [t, 0, n, t, -r, n, e, -r, t],
      [e, -r, t, e, 0, t, t, 0, n],
    ]),
    i = new pc.Entity();
  return i.addComponent("render", { meshInstances: c }), i;
}
var SetData = pc.createScript("setData");
function DataModel() {}
function DataModels(e) {
  (this.name = e), (this.modelsSize = []);
}
function Data() {
  (this.name = "null"), (this.models = []);
}
function setData(e = [[]]) {
  const l = new Data();
  for (let s = 0; s < e.length; s++)
    for (let o = 0; o < e.length; o++) {
      let d = e[s][o],
        m = "" + d,
        t = m.toLowerCase();
      if (d && "null" == l.name) l.name = d;
      else if (
        ("null" !== m && t.includes("ALT DOLABI".toLowerCase())) ||
        t.includes("ÇEKMECE DOLABI".toLowerCase()) ||
        t.includes("ALT KÖŞE DOLAP".toLowerCase()) ||
        t.includes("ÜST DOLAP".toLowerCase()) ||
        t.includes("VATRIN  DOLAP".toLowerCase()) ||
        t.includes("RAF ".toLowerCase())
      )
        l.addNewModel(t);
      else if (
        !(
          "null" === m ||
          t.includes("MODÜL  ÖLÇÜLERİ".toLowerCase()) ||
          t.includes("EN".toLowerCase()) ||
          t.includes("DERİNLİK".toLowerCase()) ||
          t.includes("BOY".toLowerCase()) ||
          t.includes("ÇEKMECE".toLowerCase()) ||
          t.includes("Miktar".toLowerCase()) ||
          t.includes("ARKALIK(mm)".toLowerCase()) ||
          t.includes("GÖVDE(mm)".toLowerCase()) ||
          t.includes("KAPAK(mm)".toLowerCase()) ||
          t.includes("RAF".toLowerCase())
        ) &&
        l.models[l.models.length - 1]
      ) {
        if (l.models[l.models.length - 1].name.includes("alt dolabi"))
          switch (o) {
            case 0:
              l.models[l.models.length - 1].modelsSize.push(new DataModel()),
                (l.models[l.models.length - 1].modelsSize[
                  l.models[l.models.length - 1].modelsSize.length - 1
                ].en = Number(m)),
                (l.models[l.models.length - 1].modelsSize[
                  l.models[l.models.length - 1].modelsSize.length - 1
                ].model = "altDolabi");
              break;
            case 1:
              l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].derinlik = Number(m);
              break;
            case 2:
              l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].boy = Number(m);
              break;
            case 3:
              l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].raf = Number(m);
              break;
            case 4:
              l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].arkalik = Number(m);
              break;
            case 5:
              l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].govde = Number(m);
              break;
            case 6:
              l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].kapak = Number(m);
              break;
            case 7:
              l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].adet = Number(m);
          }
        if (l.models[l.models.length - 1].name.includes("çekmece dolabi"))
          switch (o) {
            case 0:
              l.models[l.models.length - 1].modelsSize.push(new DataModel()),
                (l.models[l.models.length - 1].modelsSize[
                  l.models[l.models.length - 1].modelsSize.length - 1
                ].en = Number(m)),
                (l.models[l.models.length - 1].modelsSize[
                  l.models[l.models.length - 1].modelsSize.length - 1
                ].model = "cekmeceDolabi");
              break;
            case 1:
              l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].derinlik = Number(m);
              break;
            case 2:
              l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].boy = Number(m);
              break;
            case 3:
              l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].cekmece = Number(m);
              break;
            case 4:
              l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].arkalik = Number(m);
              break;
            case 5:
              l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].govde = Number(m);
              break;
            case 6:
              l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].kapak = Number(m);
              break;
            case 7:
              l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].adet = Number(m);
          }
        if (l.models[l.models.length - 1].name.includes("alt köşe dolap"))
          switch (o) {
            case 0:
              l.models[l.models.length - 1].modelsSize.push(new DataModel());
              let e = m.split("*");
              (l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].en = Number(e[0])),
                (l.models[l.models.length - 1].modelsSize[
                  l.models[l.models.length - 1].modelsSize.length - 1
                ].en2 = Number(e[1])),
                (l.models[l.models.length - 1].modelsSize[
                  l.models[l.models.length - 1].modelsSize.length - 1
                ].model = "altKoseDolabi");
              break;
            case 1:
              l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].derinlik = Number(m);
              break;
            case 2:
              l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].boy = Number(m);
              break;
            case 3:
              l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].raf = Number(m);
              break;
            case 4:
              l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].arkalik = Number(m);
              break;
            case 5:
              l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].govde = Number(m);
              break;
            case 6:
              l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].kapak = Number(m);
              break;
            case 7:
              l.models[l.models.length - 1].modelsSize[
                l.models[l.models.length - 1].modelsSize.length - 1
              ].adet = Number(m);
          }
      }
    }
  return l;
}
Data.prototype.addNewModel = function (e) {
  this.models.push(new DataModels(e));
};
var ModelTest = pc.createScript("modelTest");
let app;
function createMESH4(t = [[]], i = new Float32Array(), e = []) {
  let s = [];
  return (
    t.forEach((t) => {
      let o = new pc.Mesh(app.graphicsDevice);
      o.setPositions(new Float32Array(t)),
        o.setUvs(0, i),
        o.setIndices(e),
        o.update();
      let n = new pc.StandardMaterial();
      s.push(new pc.MeshInstance(o, n));
    }),
    s
  );
}
function MDFP(t = 1, i = 1, e = 1, s = 0.5, o = 0.5, n = 0.5) {
  (this.w = t),
    (this.h = i),
    (this.l = e),
    (this.orgX = s * t),
    (this.orgY = o * i),
    (this.orgZ = n * e),
    (this.positions = []),
    (this.uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])),
    (this.indices = [0, 1, 2, 0, 2, 3]),
    (this.entity = new pc.Entity()),
    this.entity.addComponent("render", {}),
    this.draw();
}
(MDFP.prototype.draw = function () {
  let { w: t, h: i, l: e, orgX: s, orgY: o, orgZ: n } = this;
  (this.positions = [
    [-s, -o, -n, -s + t, -o, -n, -s + t, -o, -n + e, -s, -o, -n + e],
    [
      -s,
      -o + i,
      -n + e,
      -s + t,
      -o + i,
      -n + e,
      -s + t,
      -o + i,
      -n,
      -s,
      -o + i,
      -n,
    ],
    [-s, -o, -n, -s, -o + i, -n, -s + t, -o + i, -n, -s + t, -o, -n],
    [-s, -o, -n, -s, -o, -n + e, -s, -o + i, -n + e, -s, -o + i, -n],
    [
      -s,
      -o,
      -n + e,
      -s + t,
      -o,
      -n + e,
      -s + t,
      -o + i,
      -n + e,
      -s,
      -o + i,
      -n + e,
    ],
    [
      -s + t,
      -o,
      -n,
      -s + t,
      -o + i,
      -n,
      -s + t,
      -o + i,
      -n + e,
      -s + t,
      -o,
      -n + e,
    ],
  ]),
    this.entity.removeComponent("render"),
    this.entity.addComponent("render", {
      meshInstances: createMESH4(this.positions, this.uvs, this.indices),
    });
}),
  (MDFP.prototype.setOrigin = function (t = -0.5, i = 0, e = -0.5) {
    (this.orgX = t), (this.orgY = i), (this.orgZ = e), this.draw();
  }),
  (MDFP.prototype.setSize = function (t, i, e) {
    (this.w = t), (this.h = i), (this.l = e), this.draw();
  }),
  (MDFP.prototype.setPosition = function (t, i, e) {
    this.entity.setLocalPosition(t, i, e);
  }),
  ModelTest.attributes.add("material", { type: "asset" }),
  (ModelTest.prototype.initialize = function () {
    app = this.app;
    let t = new MDFP(0.5, 0.018, 1, 0, 0, 0),
      i = new MDFP(0.018, 0.7, 1),
      e = new MDFP(0.5, 0.018, 1, 0, 0, 0);
    i.setOrigin(0, 0, 0),
      i.setPosition(0, m(18), 0),
      e.setPosition(0, m(718), 0),
      this.app.root.addChild(t.entity),
      this.app.root.addChild(i.entity),
      this.app.root.addChild(e.entity);
  });
var Cekmeced = pc.createScript("cekmeced");
function Cekmece(
  t = 1,
  i = 0.2,
  s = 0.5,
  h = 0.008,
  e = 0.018,
  a = 0.018,
  o = 3
) {
  (this.adet = o),
    (this.w = t),
    (this.h = i),
    (this.l = s),
    (this.arkaK = h),
    (this.govde = e),
    (this.kapak = a),
    (this.root = new pc.Entity()),
    (this.left = cubeEntity()),
    (this.right = cubeEntity()),
    (this.on = cubeEntity()),
    (this.arka = cubeEntity()),
    (this.arkalik = cubeEntity());
}
function CekmeceDolabi(
  t = "",
  i = 1,
  s = 0.9,
  h = 0.6,
  e = m(8),
  a = m(18),
  o = m(18),
  l = 3,
  c = 1
) {
  (this.model = t),
    (this.adet = c),
    (this.cekmece = l),
    (this.w = i),
    (this.h = s),
    (this.l = h),
    (this.arka = e),
    (this.govde = a),
    (this.kapak = o),
    (this.root = new pc.Entity()),
    (this.botom = cubeEntity()),
    (this.left = cubeEntity()),
    (this.right = cubeEntity()),
    (this.sabit1 = cubeEntity()),
    (this.sabit2 = cubeEntity()),
    (this.arkalik = cubeEntity()),
    (this.cekmeceler = []);
  for (; h < this.cekmece; h++)
    this.cekmeceler.push(
      new Cekmece(
        this.w - 2 * this.govde - m(20),
        m(200),
        this.l - m(50),
        this.arka,
        this.govde,
        this.kapak,
        this.cekmece
      )
    );
}
(Cekmece.prototype.setSize = function () {
  this.left.setLocalScale(this.govde, this.h, this.l),
    this.left.setLocalPosition(-(this.w / 2 - this.govde / 2), 0, 0),
    this.right.setLocalScale(this.govde, this.h, this.l),
    this.right.setLocalPosition(this.w / 2 - this.govde / 2, 0, 0),
    this.on.setLocalScale(this.w - 2 * this.govde, this.h - m(20), this.govde),
    this.on.setLocalPosition(0, m(10), this.l / 2 - this.govde / 2),
    this.arka.setLocalScale(
      this.w - 2 * this.govde,
      this.h - m(20),
      this.govde
    ),
    this.arka.setLocalPosition(0, m(10), -(this.l / 2 - this.govde / 2)),
    this.arkalik.setLocalScale(this.w - m(19), this.arkaK, this.l),
    this.arkalik.setLocalPosition(0, -(this.h / 2 - m(20) + this.arkaK / 2), 0);
}),
  (Cekmece.prototype.draw = function (t) {
    this.root.addChild(this.left),
      this.root.addChild(this.right),
      this.root.addChild(this.on),
      this.root.addChild(this.arka),
      this.root.addChild(this.arkalik),
      t.addChild(this.root),
      this.setSize(this.w, this.h, this.l, this.arka, this.govde, this.kapak);
  }),
  (CekmeceDolabi.prototype.setSize = function (t, i, s, h, e, a) {
    this.botom.setLocalScale(t, e, s - (a + m(2))),
      this.botom.setLocalPosition(0, e / 2, 0),
      this.left.setLocalScale(e, i - e, s - (a + m(2))),
      this.left.setLocalPosition(-(t / 2 - e / 2), i / 2 + e / 2, 0),
      this.right.setLocalScale(e, i - e, s - (a + m(2))),
      this.right.setLocalPosition(t / 2 - e / 2, i / 2 + e / 2, 0),
      this.sabit1.setLocalScale(t - 2 * e, e, m(100)),
      this.sabit1.setLocalPosition(
        0,
        i - e / 2,
        s / 2 - m(50) - (a + m(2)) / 2
      ),
      this.sabit2.setLocalScale(t - 2 * e, e, m(100)),
      this.sabit2.setLocalPosition(
        0,
        i - e / 2,
        -(s / 2 - m(50) - (a + m(2)) / 2)
      ),
      this.arkalik.setLocalScale(t - m(19), i - m(19), h),
      this.arkalik.setLocalPosition(
        0,
        this.arkalik.getLocalScale().y / 2,
        -this.botom.getLocalScale().z / 2 + h / 2 + m(12)
      ),
      this.cekmeceler.forEach((t, i) => {
        let s = t.left.getLocalScale();
        t.root.setLocalPosition(
          0,
          (this.h / this.cekmece) * (i + 1) - s.y / 1.3,
          (this.l - this.kapak - s.z) / 2 + m(100) * (1 * i)
        );
      });
  }),
  (CekmeceDolabi.prototype.draw = function (t = new pc.Entity()) {
    this.root.addChild(this.botom),
      this.root.addChild(this.left),
      this.root.addChild(this.right),
      this.root.addChild(this.sabit1),
      this.root.addChild(this.sabit2),
      this.root.addChild(this.arkalik),
      this.cekmeceler.forEach((t) => {
        t.draw(this.root);
      }),
      t.addChild(this.root),
      this.setSize(this.w, this.h, this.l, this.arka, this.govde, this.kapak);
  }),
  (CekmeceDolabi.prototype.toData = function () {
    return {
      model: this.model,
      modelSize: {
        cNames: ["EN", "BOY", "DERINLIK", "RAF", "ADET"],
        cValues: [mm(this.w), mm(this.h), mm(this.l), this.raf, this.adet],
      },
      materialsSizes: {
        govde: {
          kalinlik: mm(this.govde),
          cNames: [
            "P",
            "BOY",
            "EN",
            "ADET",
            "KENAR BANDI",
            "KENAR BANDI(M)",
            "M2",
          ],
          cValues: [
            {
              name: "ALT",
              value: [
                mm(this.w),
                mm(this.l) - (mm(this.kapak) + 2),
                this.adet,
                "2 BOY 2 EN",
                kB(this.w, this.l, 2, 2, this.adet),
                m2(this.w, this.l, this.adet),
              ],
            },
            {
              name: "YAN",
              value: [
                mm(this.h) - mm(this.govde),
                mm(this.l) - (mm(this.kapak) + 2),
                2 * this.adet,
                "2 BOY 1 EN",
                kB(
                  this.h - this.govde,
                  this.l - (this.kapak + m(2)),
                  2,
                  1,
                  2 * this.adet
                ),
                m2(
                  this.h - this.govde,
                  this.l - (this.kapak + m(2)),
                  2 * this.adet
                ),
              ],
            },
            {
              name: "SABIT",
              value: [
                mm(this.w) - mm(2 * this.govde),
                mm(0.1),
                2 * this.adet,
                "2 BOY",
                kB(this.w, m(100), 2, 0, 2 * this.adet),
                m2(this.w - 2 * this.govde, m(100), 2 * this.adet),
              ],
            },
          ],
        },
        arkalik: {
          kalinlik: mm(this.arka),
          cNames: ["EN", "BOY", "ADET", "M2"],
          cValues: [
            [
              mm(this.w - m(30)).toFixed(0),
              mm(this.h - m(19)).toFixed(0),
              this.adet,
              m2(this.w - m(19), this.h - m(19), this.adet),
            ],
          ],
        },
      },
    };
  });
var AltKD = pc.createScript("altkd");
function AltKoseDolabi(
  t = "",
  i = 1,
  s = 1,
  h = 0.9,
  a = 0.6,
  e = m(8),
  o = m(18),
  l = m(18),
  d = 3,
  c = 1
) {
  (this.model = t),
    (this.adet = c),
    (this.raf = d),
    (this.w1 = i),
    (this.w2 = s),
    (this.h = h),
    (this.l = a),
    (this.arka = e),
    (this.govde = o),
    (this.kapak = l),
    (this.root = new pc.Entity()),
    (this.botom = cncModel1(this.w1, this.w2, this.l, this.govde)),
    (this.top = cncModel1(this.w1, this.w2, this.l, this.govde)),
    (this.left = cubeEntity()),
    (this.right = cubeEntity()),
    (this.sabit1 = cubeEntity()),
    (this.sabit2 = cubeEntity()),
    (this.arkalik1 = cubeEntity()),
    (this.arkalik2 = cubeEntity()),
    (this.raflar = []);
  for (let t = 0; t < this.raf; t++) this.raflar.push(cubeEntity());
}
(AltKoseDolabi.prototype.setSize = function (t, i, s, h, a, e) {
  this.botom.setLocalPosition(0, this.govde, 0),
    this.top.setLocalPosition(0, this.h, 0),
    this.left.setLocalScale(this.l, this.h - 2 * this.govde, this.govde),
    this.left.setLocalPosition(
      this.l / 2,
      (this.h - 2 * this.govde) / 2 + this.govde,
      this.w2 - this.govde / 2
    ),
    this.right.setLocalScale(this.govde, this.h - 2 * this.govde, this.l),
    this.right.setLocalPosition(
      this.w1 - this.govde / 2,
      (this.h - 2 * this.govde) / 2 + this.govde,
      this.l / 2
    ),
    this.sabit1.setLocalScale(m(100), this.h, this.govde),
    this.sabit1.setLocalPosition(m(50), this.h / 2, m(100) + this.govde / 2),
    this.sabit2.setLocalScale(this.govde, this.h, m(100)),
    this.sabit2.setLocalPosition(m(100) - this.govde / 2, this.h / 2, m(50)),
    this.arkalik1.setLocalScale(
      this.w1 - m(100) + m(18),
      this.h - m(19),
      this.arka
    ),
    this.arkalik1.setLocalPosition(this.w1 / 2 + m(50 - this.govde / 2), 0, 0),
    this.raflar.forEach((h, o) => {
      console.log(h),
        h.setLocalScale(t - 2 * a - m(2), a, s - m(30) - e - m(2)),
        h.setLocalPosition(0, (i / (this.raf + 1)) * (o + 1), 0);
    });
}),
  (AltKoseDolabi.prototype.draw = function (t = new pc.Entity()) {
    this.root.addChild(this.botom),
      this.root.addChild(this.top),
      this.root.addChild(this.left),
      this.root.addChild(this.right),
      this.root.addChild(this.sabit1),
      this.root.addChild(this.sabit2),
      this.root.addChild(this.arkalik1),
      t.addChild(this.root),
      this.setSize(this.w, this.h, this.l, this.arka, this.govde, this.kapak);
  }),
  (AltKoseDolabi.prototype.toData = function () {
    return {
      model: this.model,
      modelSize: {
        cNames: ["EN", "BOY", "DERINLIK", "RAF", "ADET"],
        cValues: [mm(this.w), mm(this.h), mm(this.l), this.raf, this.adet],
      },
      materialsSizes: {
        govde: {
          kalinlik: mm(this.govde),
          cNames: [
            "P",
            "BOY",
            "EN",
            "ADET",
            "KENAR BANDI",
            "KENAR BANDI(M)",
            "M2",
          ],
          cValues: [
            {
              name: "ALT",
              value: [
                mm(this.w),
                mm(this.l) - (mm(this.kapak) + 2),
                this.adet,
                "2 BOY 2 EN",
                kB(this.w, this.l, 2, 2, this.adet),
                m2(this.w, this.l, this.adet),
              ],
            },
            {
              name: "YAN",
              value: [
                mm(this.h) - mm(this.govde),
                mm(this.l) - (mm(this.kapak) + 2),
                2 * this.adet,
                "2 BOY 1 EN",
                kB(
                  this.h - this.govde,
                  this.l - (this.kapak + m(2)),
                  2,
                  1,
                  2 * this.adet
                ),
                m2(
                  this.h - this.govde,
                  this.l - (this.kapak + m(2)),
                  2 * this.adet
                ),
              ],
            },
            {
              name: "RAF",
              value: [
                mm(this.w - (2 * this.govde - m(2))).toFixed(0),
                mm(this.l - m(30) - (this.kapak + m(2))).toFixed(0),
                this.raf * this.adet,
                "2 BOY 2 EN",
                kB(this.w, this.l, 2, 2, this.adet * this.raf),
                m2(
                  this.w - 2 * this.govde,
                  this.l - m(30),
                  this.adet * this.raf
                ),
              ],
            },
            {
              name: "SABIT",
              value: [
                mm(this.w) - mm(2 * this.govde),
                mm(0.1),
                2 * this.adet,
                "2 BOY",
                kB(this.w, m(100), 2, 0, 2 * this.adet),
                m2(this.w - 2 * this.govde, m(100), 2 * this.adet),
              ],
            },
          ],
        },
        arkalik: {
          kalinlik: mm(this.arka),
          cNames: ["EN", "BOY", "ADET", "M2"],
          cValues: [
            [
              mm(this.w - m(30)).toFixed(0),
              mm(this.h - m(19)).toFixed(0),
              this.adet,
              m2(this.w - m(19), this.h - m(19), this.adet),
            ],
          ],
        },
      },
    };
  });
var Root = pc.createScript("root");
Root.attributes.add("index_css", { type: "asset", assetType: "css" }),
  (Root.prototype.initialize = function () {
    (document.head.innerHTML += this.app.assets.find("icons", "text").resource),
      (this.style = createElement({
        container: document.head,
        tagName: "style",
      })),
      this.styleUpdate(),
      window.addEventListener("keydown", (e) => {
        85 == e.keyCode && this.styleUpdate();
      }),
      appContext.set("app", this.app);
    new App();
  }),
  (Root.prototype.styleUpdate = function () {
    (this.style.innerHTML = this.app.assets.find("index", "css").resource),
      (this.style.innerHTML += this.app.assets.find(
        "container",
        "css"
      ).resource),
      (this.style.innerHTML += this.app.assets.find("menu", "css").resource),
      (this.style.innerHTML += this.app.assets.find("models", "css").resource),
      (this.style.innerHTML += this.app.assets.find(
        "createNewModel",
        "css"
      ).resource),
      (this.style.innerHTML += this.app.assets.find(
        "newModel",
        "css"
      ).resource);
  }),
  (Root.prototype.update = function (e) {});
function App() {
  (this.menuOptions = [{ name: "MODELS", action: "modelsSetDisplay" }]),
    (this.container = new Container()),
    (this.menu = new Menu(this.menuOptions)),
    (this.models = new Models()),
    appContext.set("appContainer_s", this.container.container_s),
    appContext.set("appContainer", this.container.container),
    (this.newModel = new NewModel()),
    (this.createNewModel = new CreateNewModel());
}
function createElement(
  e = {
    container: document.body,
    tagName: "div",
    innerHTML: "",
    className: "container",
    id: "container",
    style: "",
    type: "",
    value: "",
    placeholder: "",
    href: "",
    attributs: [{ name: "", value: "" }],
  }
) {
  let t;
  return (
    e.tagName && (t = document.createElement(e.tagName)),
    e.style && (t.style.cssText = e.style),
    e.container ? e.container.appendChild(t) : document.body.appendChild(t),
    e.id && (t.id = e.id),
    e.href && (t.href = e.href),
    e.className && (t.className = e.className),
    e.innerHTML && (t.innerHTML = e.innerHTML),
    e.type && (t.type = e.type),
    e.value && (t.value = e.value),
    e.placeholder && (t.placeholder = e.placeholder),
    e.attributs &&
      e.attributs.forEach((e) => {
        t.setAttribute(e.name, e.value);
      }),
    t
  );
}
function Context() {
  this.context = {};
}
(Context.prototype.get = function (t = "") {
  return this.context[t];
}),
  (Context.prototype.set = function (t = "name", n = "value") {
    this.context[t] = n;
  });
const appContext = new Context();
const HOST = "http://localhost:4000/";
function httpPost(e = "", t = [{ name: "", value: "" }]) {
  return new Promise((n) => {
    let a = new FormData();
    t.forEach((e) => {
      a.append(e.name, e.value);
    });
    let o = new XMLHttpRequest();
    o.open("POST", HOST + e, !0),
      (o.onreadystatechange = function () {
        4 == o.readyState && 200 == o.status && n(o.responseText);
      }),
      o.send(a);
  });
}
function Container() {
  (this.container = createElement({
    container: document.body,
    tagName: "div",
    className: "app_container",
  })),
    (this.divsContainer1 = createElement({
      container: this.container,
      tagName: "div",
      className: "app_divsContainer",
    })),
    (this.div1 = createElement({
      container: this.divsContainer1,
      tagName: "div",
      className: "app_divs",
      style: "width:60vh;height:40vh;border-radius:0 0 5vw 0",
    })),
    (this.div2 = createElement({
      container: this.divsContainer1,
      tagName: "div",
      className: "app_divs",
      style: "width:70vh;height:40vh;border-radius:0 0 0 5vw",
    })),
    (this.divsContainer2 = createElement({
      container: this.container,
      tagName: "div",
      className: "app_divsContainer",
    })),
    (this.div3 = createElement({
      container: this.divsContainer2,
      tagName: "div",
      className: "app_divs",
      style: "width:70vh;height:40vh;border-radius:0 5vw 0 0",
    })),
    (this.div4 = createElement({
      container: this.divsContainer2,
      tagName: "div",
      className: "app_divs",
      style: "width:60vh;height:40vh;border-radius:5vw 0 0 0",
    })),
    (this.container_s = createElement({
      container: this.container,
      tagName: "div",
      className: "app_container_s",
    })),
    (this.logo = createElement({
      container: this.container,
      tagName: "h1",
      className: "app_logo",
      innerHTML: "CAPPAC",
    })),
    this.setLogoPosition(),
    window.addEventListener("resize", () => {
      this.setLogoPosition();
    });
}
Container.prototype.setLogoPosition = function () {
  let e = this.logo.getBoundingClientRect();
  this.logo.style.left = innerWidth - e.width + "px";
};
function MenuOption(
  t,
  e = { name: "MATERIALS", action: "materialsSetDisplay" }
) {
  (this.data = e),
    (this.container = createElement({
      container: t,
      tagName: "a",
      href: "javascript:;",
      className: "menuOption_container",
      innerHTML: e.name,
    })),
    this.container.addEventListener("click", async () => {
      appContext.get("appContainer_s").innerHTML = "";
      let t = await httpPost("downloadData", [
        { name: "name", value: this.data.name.toLowerCase() },
      ]);
      appContext.get(this.data.action)(appContext.get("appContainer_s"), t);
    });
}
function Menu(t = [{ name: "MATERIALS", action: "materialsSetDisplay" }]) {
  (this.display = !0),
    (this.container = createElement({
      container: document.body,
      tagName: "div",
      className: "menu_container",
    })),
    (this.optionsContainer = createElement({
      container: this.container,
      tagName: "div",
      className: "menu_optionsContainer",
    })),
    (this.div1 = createElement({
      container: this.container,
      tagName: "div",
      className: "menu_div1",
    })),
    (this.button = createElement({
      container: this.container,
      tagName: "a",
      className: "menu_button",
      innerHTML: "<div><div></div><div></div><div></div></div>",
      href: "javascript:;",
    })),
    this.button.addEventListener("click", () => {
      this.setDisplay();
    }),
    (this.name = createElement({
      container: this.optionsContainer,
      tagName: "h1",
      className: "menu_name",
      innerHTML: "MENU",
    })),
    (this.options = t.map((t) => new MenuOption(this.optionsContainer, t))),
    this.setDisplay(),
    appContext.set("menuContainer", this.container);
}
Menu.prototype.setDisplay = function () {
  let t = -(
    this.container.getBoundingClientRect().width -
    this.button.getBoundingClientRect().width
  );
  this.display
    ? ((this.container.style.left = t + "px"), (this.display = !1))
    : ((this.container.style.left = "0px"), (this.display = !0));
};
function Models() {
  (this.display = !1),
    appContext.set("modelsSetDisplay", this.setDisplay.bind(this));
}
(Models.prototype.setDisplay = function (
  t = t.container_s,
  e = JSON.stringify([
    { name: "Alt dolabi", id: "1324355689", descripcion: "18mm beyaz mdflam" },
  ])
) {
  (this.data = JSON.parse(e)),
    (this.container = createElement({
      container: t,
      tagName: "div",
      className: "models_container",
    })),
    (this.addButton = createElement({
      container: t,
      tagName: "span",
      className: "material-symbols-rounded",
      innerHTML: "add",
      id: "models_addButton",
    })),
    window.addEventListener("resize", this.setAddButtonPosition),
    this.setAddButtonPosition(),
    this.addButton.addEventListener("click", () => {
      appContext.get("createNewModel").style.visibility = "visible";
    });
}),
  (Models.prototype.setAddButtonPosition = function () {
    let t = this.addButton.getBoundingClientRect();
    (this.addButton.style.top = innerHeight - t.height + "px"),
      (this.addButton.style.left = innerWidth - t.width + "px");
  });
function CreateNewModel() {
  function Input(e, t, n, a, i, s) {
    (this.container = createElement({
      container: e,
      tagName: "div",
      className: "createNewModel_input",
    })),
      (this.name = createElement({
        container: this.container,
        tagName: "h1",
        innerHTML: a + ":",
        style: `font-size:${i}`,
      })),
      (this.input = createElement({
        container: this.container,
        tagName: "input",
        type: t,
        placeholder: n,
        style: `width:${s};font-size:${i}`,
      }));
  }
  (this.container = createElement({
    container: document.body,
    tagName: "div",
    className: "createNewModel_container",
  })),
    (this.container_s = createElement({
      container: this.container,
      tagName: "div",
      className: "createNewModel_container_s",
    })),
    (this.error = createElement({
      container: this.container_s,
      tagName: "h1",
      className: "createNewModel_error",
    })),
    (this.name = new Input(this.container_s, "text", "", "NAME", "2vw", "80%")),
    (this.l = new Input(this.container_s, "number", "mm", "L", "2vw", "5vw")),
    (this.w = new Input(this.l.container, "number", "mm", "W", "2vw", "5vw")),
    (this.h = new Input(this.l.container, "number", "mm", "H", "2vw", "5vw")),
    (this.save = createElement({
      container: this.container_s,
      tagName: "input",
      type: "button",
      value: "SAVE",
      className: "createNewModel_save",
    })),
    this.save.addEventListener("click", () => {
      this.createNewModelData();
    }),
    this.container.addEventListener("click", (e) => {
      let t = this.container_s.getBoundingClientRect(),
        n = e.clientX,
        a = e.clientY;
      (n < t.x || n > t.x + t.width || a < t.y || a > t.y + t.height) &&
        (this.container.style.visibility = "hidden");
    }),
    appContext.set("createNewModel", this.container);
}
(CreateNewModel.prototype.modelNameSearch = function (e = "", t = []) {
  let n = null;
  return (
    t.forEach((t) => {
      t == e && (n = e);
    }),
    n
  );
}),
  (CreateNewModel.prototype.createNewModelData = async function () {
    if (
      "" == this.name.input.value ||
      "" == this.l.input.value ||
      "" == this.w.input.value ||
      "" == this.h.input.value
    )
      this.error.innerHTML = "Please enter a value for all required fields";
    else {
      let e = JSON.parse(
        await httpPost("downloadData", [{ name: "name", value: "modelsNames" }])
      );
      if (this.modelNameSearch(this.name.input.value, e))
        this.error.innerHTML = "this name already exists.";
      else {
        this.container.style.display = "none";
        let e = {
          name: this.name.input.value,
          l: this.l.input.value,
          w: this.w.input.value,
          h: this.h.input.value,
        };
        (appContext.get("appContainer").style.display = "none"),
          (appContext.get("menuContainer").style.display = "none"),
          appContext.get("setNewModelData")(e);
      }
    }
  });
function NewModel() {
  (this.container = null),
    appContext.set("setNewModelData", this.setNewModelData.bind(this));
}
NewModel.prototype.setNewModelData = function (
  e = { name: "", l: 1, w: 1, h: 1 }
) {
  this.container && this.container.remove(),
    (this.container = createElement({
      container: document.body,
      tagName: "div",
      className: "newModel_container",
    })),
    (this.dataList = new DataList(this.container, e));
  let t = e;
  console.log(t);
};
function DataList(t = document.body, a = {}) {
  this.container = createElement({
    container: t,
    tagName: "div",
    className: "dataList_container",
  });
}
function MeshList(n = document.body, o = "") {}
function MeshData(
  a = 1,
  t = 1,
  e = 1,
  n = 1,
  b = 1,
  c = 1,
  f = 1,
  h = 1,
  i = 1,
  m = 0,
  o = 0,
  s = 0,
  u = "beyaz mat"
) {}
