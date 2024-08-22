import { Assets, Sprite, Ticker } from 'pixi.js';
import { showHint } from './showHint.js';
import { showFinalScreen } from './showFinalScreen.js';

export async function showFirstScreen({ app, sceneContainer, hintContainer }) {
  const food1 = await Assets.load('assets/win1.png');
  const food2 = await Assets.load('assets/win2.png');
  const food3 = await Assets.load('assets/fail1.png');

  const handTicker = new Ticker();

  sceneContainer.removeChildren();
  hintContainer.visible = true;

  const kitchen = Sprite.from('kitchenImg');
  kitchen.anchor.set(0.5, 0.5);
  kitchen.x = app.screen.width / 2;
  kitchen.y = app.screen.height / 2;
  sceneContainer.addChild(kitchen);

  const logo = Sprite.from('logoImg');
  logo.anchor.set(0.5, 0.5);
  logo.x = app.screen.width / 2;
  logo.y = logo.height / 2 + 10;
  sceneContainer.addChild(logo);

  const lids = [];
  const plateScale = 0.16;
  const plateWidth = Sprite.from('plateImg').texture.width * plateScale;
  const plateHeight = Sprite.from('plateImg').texture.height * plateScale;
  const foodTextures = [food1, food2, food3];

  for (let i = 0; i < 3; i++) {
    let plate = Sprite.from('plateImg');
    plate.scale.set(plateScale);

    const lid = Sprite.from('lidImg');
    lid.scale.set(plateScale);

    if (i === 2) {
      plate.x = (app.screen.width - plateWidth) / 2;
      plate.y = app.screen.height / 2;
    } else {
      plate.x =
        (app.screen.width - plateWidth) / 2 +
        (i === 0 ? -plateWidth + 100 : plateWidth - 100);
      plate.y = app.screen.height / 2 - plateHeight / 2 - 80;
    }

    lid.x = plate.x + (plate.width - lid.width) / 2;
    lid.y = plate.y + (plate.height - lid.height) / 2 - 50;

    lid.interactive = true;
    lid.buttonMode = true;

    let randomIndex = Math.floor(Math.random() * foodTextures.length);
    let randomFoodTexture = foodTextures[randomIndex];
    foodTextures.splice(randomIndex, 1);

    const food = new Sprite(randomFoodTexture);
    food.scale.set(0.08);
    food.x = plate.x + (plate.width - food.width) / 2;
    food.y = plate.y + (plate.height - food.height) / 2 - 30;
    food.visible = false;

    lid.on('pointerdown', () => {
      food.visible = true;
      let ticker = new Ticker();
      let rotationAmount = -0.05;
      ticker.add(() => {
        if (lid.y > plate.y - 120) {
          lid.y -= 3;
          lid.x -= 6;
          lid.rotation += rotationAmount;
        } else {
          ticker.stop();
        }
      });
      ticker.start();

      if (hintContainer) {
        handTicker.stop();
        const slideDownTicker = new Ticker();
        slideDownTicker.add(() => {
          if (hintContainer.y < app.screen.height) {
            hintContainer.y += 50;
          } else {
            slideDownTicker.stop();
            hintContainer.visible = false;
            hintContainer.removeChildren();
          }
        });
        slideDownTicker.start();
      }

      let stamp;
      if (randomFoodTexture === food1 || randomFoodTexture === food2) {
        stamp = Sprite.from('winStampImg');
      } else if (randomFoodTexture === food3) {
        stamp = Sprite.from('failStampImg');
      }

      if (stamp) {
        stamp.anchor.set(0.5, 0.5);
        stamp.x = app.screen.width / 2;
        stamp.y = app.screen.height / 3;
        stamp.scale.set(4);
        sceneContainer.addChild(stamp);

        const scaleTicker = new Ticker();
        scaleTicker.add(() => {
          if (stamp.scale.x >= 1.3) {
            stamp.scale.x -= 0.3;
            stamp.scale.y -= 0.3;
          } else {
            scaleTicker.stop();
          }
        });
        scaleTicker.start();
        lids.forEach((otherLid) => {
          otherLid.interactive = false;
          otherLid.buttonMode = false;
        });

        setTimeout(() => {
          showFinalScreen({ app, sceneContainer, hintContainer });
        }, 1000);
      }
    });

    lids.push(lid);
    sceneContainer.addChild(plate);
    sceneContainer.addChild(food);
    sceneContainer.addChild(lid);
  }

  setTimeout(
    () => showHint({ sceneContainer, hintContainer, handTicker, app }),
    500
  );
}
