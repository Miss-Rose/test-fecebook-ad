import { Application, Assets, Container, Sprite } from 'pixi.js';
import { showFirstScreen } from './src/showFirstScreen.js';

const app = new Application();
const sceneContainer = new Container();
const hintContainer = new Container();

async function setup() {
  await app.init({
    backgroundColor: 0x1099bb,
    width: 640,
    height: 960,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });
  document.body.appendChild(app.canvas);

  const aspectRatio = 640 / 960;
  const currentAspectRatio = window.innerWidth / window.innerHeight;

  if (currentAspectRatio > aspectRatio) {
    app.canvas.style.width = window.innerHeight * aspectRatio + 'px';
    app.canvas.style.height = window.innerHeight + 'px';
  } else {
    app.canvas.style.width = window.innerWidth + 'px';
    app.canvas.style.height = window.innerWidth / aspectRatio + 'px';
  }

  globalThis.__PIXI_APP__ = app;
  app.stage.addChild(sceneContainer);
  app.stage.addChild(hintContainer);
}

async function preload() {
  const assets = [
    { alias: 'logoImg', src: 'assets/LOGO_BB.png' },
    { alias: 'kitchenImg', src: 'assets/Kitchen.png' },
    { alias: 'plateImg', src: 'assets/plate1.png' },
    { alias: 'lidImg', src: 'assets/lid1.png' },
    { alias: 'winStampImg', src: 'assets/winStamp.png' },
    { alias: 'failStampImg', src: 'assets/failStamp.png' },
    { alias: 'blitzyImg', src: 'assets/blitzy.png' },
    { alias: 'handImg', src: 'assets/hand.png' },
    { alias: 'copyright', src: 'assets/copyright.png' },
  ];
  await Assets.load(assets);
}

(async () => {
  await setup();
  await preload();

  const copyright = Sprite.from('copyright');
  copyright.anchor.set(0.5, 1);
  copyright.x = app.screen.width / 2;
  copyright.y = app.screen.height;
  app.stage.addChild(copyright);

  await showFirstScreen({ app, sceneContainer, hintContainer });
})();
