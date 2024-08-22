import { Assets, Sprite, Container, Ticker } from 'pixi.js';
import { showFirstScreen } from './showFirstScreen.js';

async function preload() {
  const assets = [
    { alias: 'girlImg', src: 'assets/Candice.png' },
    { alias: 'catImg', src: 'assets/BlitzyMain.png' },
    { alias: 'finalScreenImg', src: 'assets/backgr.png' },
    { alias: 'sparksImg', src: 'assets/sparks.png' },
    { alias: 'foregraundImg', src: 'assets/foregraund.png' },
    { alias: 'backgrElement1Img', src: 'assets/backgrElement1.png' },
    { alias: 'backgrElement2Img', src: 'assets/backgrElement2.png' },
    { alias: 'playNowImg', src: 'assets/CallToAction.png' },
    { alias: 'restartImg', src: 'assets/restart.png' },
  ];
  await Assets.load(assets);
}

export async function showFinalScreen({ app, sceneContainer, hintContainer }) {
  await preload();
  sceneContainer.removeChildren();

  const bgImage = Sprite.from('finalScreenImg');
  bgImage.anchor.set(0.5, 0.5);
  bgImage.x = app.screen.width / 2;
  bgImage.y = app.screen.height / 2;

  const sparks = Sprite.from('sparksImg');
  sparks.anchor.set(0.5, 0.5);
  sparks.x = app.screen.width / 2;
  sparks.y = app.screen.width / 2 + 70;

  const girl = Sprite.from('girlImg');
  girl.anchor.set(0, 1);
  girl.x = 10;

  const cat = Sprite.from('catImg');
  cat.x = app.screen.width - cat.width + 40;
  cat.y = app.screen.height - cat.height;

  const logo = Sprite.from('logoImg');
  logo.anchor.set(1, 0.5);
  logo.scale.set(1.3);
  logo.x = app.screen.width - 25;

  const bgBottomContainer = new Container();
  const foregraund = Sprite.from('foregraundImg');
  const backgrElement1 = Sprite.from('backgrElement1Img');
  const backgrElement2 = Sprite.from('backgrElement2Img');

  foregraund.anchor.set(0.5, 0);
  foregraund.x = app.screen.width / 2;
  foregraund.y = app.screen.height - foregraund.height;
  backgrElement1.x = app.screen.width - backgrElement1.width / 4;
  backgrElement1.y = app.screen.height - foregraund.height;
  backgrElement2.x = 0 - backgrElement2.width / 2;
  backgrElement2.y = app.screen.height - foregraund.height / 1.5;

  const playButton = Sprite.from('playNowImg');
  playButton.anchor.set(0.5, 0.5);
  playButton.x = app.screen.width / 2;
  playButton.y =
    app.screen.height - foregraund.height - playButton.height / 2 + 10;

  const restartButton = Sprite.from('restartImg');
  restartButton.anchor.set(0.5, 0.5);
  restartButton.x = app.screen.width - 50;
  restartButton.y = app.screen.height - restartButton.height;
  restartButton.interactive = true;
  restartButton.buttonMode = true;
  restartButton.on('pointerdown', () => {
    playButtonTicker.stop();
    showFirstScreen({ app, sceneContainer, hintContainer });
  });

  sceneContainer.addChild(bgImage);
  sceneContainer.addChild(sparks);
  sceneContainer.addChild(logo);
  sceneContainer.addChild(girl);
  bgBottomContainer.addChild(foregraund);
  bgBottomContainer.addChild(backgrElement1);
  bgBottomContainer.addChild(backgrElement2);
  sceneContainer.addChild(bgBottomContainer);
  sceneContainer.addChild(cat);

  bgBottomContainer.y = bgBottomContainer.height;
  const bgBottomTicker = new Ticker();
  bgBottomTicker.add(() => {
    if (bgBottomContainer.y >= 0) {
      bgBottomContainer.y -= 5;
    } else {
      bgBottomContainer.y = 0;
      bgBottomTicker.stop();
    }
  });

  logo.y = -logo.height;
  const logoTicker = new Ticker();
  logoTicker.add(() => {
    if (logo.y < logo.width / 3) {
      logo.y += 15;
    } else {
      logo.y = logo.width / 2;
      logoTicker.stop();
    }
  });

  const girlTicker = new Ticker();
  girlTicker.add(() => {
    if (girl.y < app.screen.height) {
      girl.y += 45;
    } else {
      girl.y = app.screen.height - 10;
      girlTicker.stop();
    }
  });

  cat.y = -cat.height;
  const catTicker = new Ticker();
  catTicker.add(() => {
    if (cat.y <= app.screen.height - cat.height) {
      cat.y += 45;
    } else {
      cat.y = app.screen.height - cat.height;
      catTicker.stop();
    }
  });

  let scaleDirection = 0.5;
  const playButtonTicker = new Ticker();
  playButtonTicker.add(() => {
    playButton.scale.x += 0.009 * scaleDirection;
    playButton.scale.y += 0.009 * scaleDirection;
    if (playButton.scale.x > 1 || playButton.scale.x < 0.9) {
      scaleDirection *= -1;
    }
  });

  bgBottomTicker.start();
  logoTicker.start();

  setTimeout(() => {
    girlTicker.start();
    catTicker.start();
  }, 700);

  setTimeout(() => {
    sceneContainer.addChild(playButton);
    sceneContainer.addChild(restartButton);
    playButtonTicker.start();
  }, 1400);
}
