import { Sprite, Ticker } from 'pixi.js';

export async function showHint({
  app,
  sceneContainer,
  hintContainer,
  handTicker,
}) {
  const blitzy = Sprite.from('blitzyImg');
  blitzy.x = hintContainer.width;
  blitzy.y = hintContainer.height;

  const hand = Sprite.from('handImg');
  hand.x = blitzy.x + blitzy.width / 2 - 28;
  hand.y = blitzy.y + blitzy.height;
  hand.anchor.set(1, 1);

  hintContainer.x = sceneContainer.width - blitzy.width - hand.width + 30;
  hintContainer.y = sceneContainer.height - blitzy.height;

  hintContainer.addChild(hand);
  hintContainer.addChild(blitzy);

  let rotationDirection = 1;
  handTicker.add(() => {
    hand.rotation += 0.005 * rotationDirection;
    if (hand.rotation > 0.1 || hand.rotation < -0.1) {
      rotationDirection *= -1;
    }
  });

  hintContainer.y = app.screen.height;
  const slideTicker = new Ticker();
  slideTicker.add(() => {
    if (hintContainer.y >= sceneContainer.height - blitzy.height) {
      hintContainer.y -= 50;
    } else {
      slideTicker.stop();
      hintContainer.y = sceneContainer.height - blitzy.height;
      handTicker.start();
    }
  });
  slideTicker.start();
}
