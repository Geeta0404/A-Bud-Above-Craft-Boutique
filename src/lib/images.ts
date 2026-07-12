function unsplash(id: string, w = 1200) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
}

export const IMG = {
  // Flower
  flowerBud1: unsplash("1503262028195-93c528f03218"),
  flowerBud2: unsplash("1590682751946-a65099676151"),
  flowerBud3: unsplash("1518469669531-9b8c528f909d"),
  flowerBud4: unsplash("1589141986943-5578615fdef2"),
  flowerBud5: unsplash("1520224855316-280b2e6afca1"),
  // Pre-Rolls
  preRoll1: unsplash("1649127472726-5396b1e85a31"),
  preRoll2: unsplash("1625565828426-c4b6ce15b76d"),
  preRoll3: unsplash("1695866648575-843558bd6293"),
  preRoll4: unsplash("1605570380656-fbf9e534ac78"),
  // Vaporizers
  vapePen1: unsplash("1545095088-26a59e3f2717"),
  vapePen2: unsplash("1579165466814-e646cfa4a3be"),
  vapePen3: unsplash("1666402666733-b6e4443dc4de"),
  vapePen4: unsplash("1616093053570-0143f27b994d"),
  // Edibles
  gummies1: unsplash("1582058091505-f87a2e55a40f"),
  gummies2: unsplash("1635342219731-4ae2bf39e1e9"),
  gummies3: unsplash("1617627191898-1408bf607b4d"),
  gummies4: unsplash("1675437434916-fd6d0b03749d"),
  // Concentrates
  concentrate1: unsplash("1696192410531-dc179772a0e8"),
  concentrate2: unsplash("1619870514532-280e4c479e8f"),
  concentrate3: unsplash("1655892832074-4768d61f0431"),
  concentrate4: unsplash("1647505310170-04aeadc30aeb"),
  // Topicals
  topical1: unsplash("1631438420064-8f1b2b52b2e6"),
  topical2: unsplash("1643123158391-8543727c85f5"),
  topical3: unsplash("1622618991227-412b19e4fef9"),
  topical4: unsplash("1763709546912-62e898c99d7c"),
  // Beverages
  beverage1: unsplash("1554866585-cd94860890b7"),
  beverage2: unsplash("1592892111425-15e04305f961"),
  beverage3: unsplash("1581098365948-6a5a912b7a49"),
  beverage4: unsplash("1585498154575-3db0fda49f1d"),
  // Accessories
  accessory1: unsplash("1776846763275-4b4d1f13fae2"),
  accessory2: unsplash("1765120828124-f3217ba51a09"),
  accessory3: unsplash("1598052162797-ba3530cc75b1"),
  accessory4: unsplash("1627157720831-e65362d40142"),
};
