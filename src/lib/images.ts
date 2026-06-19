function unsplash(id: string, w = 1200) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
}

function unsplashPlus(id: string, w = 1200) {
  return `https://plus.unsplash.com/premium_photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
}

export const IMG = {
  potteryBowls: unsplash("1530006498959-b7884e829a04"),
  potteryStack: unsplash("1523367438061-01c055ce790c"),
  ceramicCups: unsplash("1610701596007-11502861dcfa"),
  candleJar: unsplash("1663089889826-0575c6ae19de"),
  woodworkers: unsplashPlus("1664474571876-4eb77e1bba98"),
  woodenSpoons: unsplashPlus("1668432373919-1ff0c6325326"),
  macrame: unsplash("1633594308237-3dcfa56b4e69"),
  wreath: unsplash("1639334317586-ced6c3ce407a"),
  chunkyKnit: unsplashPlus("1681506544815-99c5e57e8fb9"),
  mittens: unsplash("1680420562679-74976cfbc0dc"),
  pressedFlower: unsplash("1748803798842-f179b4b61c90"),
  linenPillow: unsplash("1618221118493-9cfa1a1c00da"),
  vaseFlower: unsplash("1689108124698-35311874609a"),
  giftBox: unsplash("1513201099705-a9746e1e201f"),
  woodenBox: unsplash("1655820023276-3c3c7c7e8869"),
  soap: unsplash("1542038335240-86aea625b913"),
  mapleSyrup: unsplash("1635351373171-40bf0c83e1eb"),
  candleChristmas: unsplash("1575549593677-012f18048ea1"),
};
