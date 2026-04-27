import {Catalog} from 'react-planner';

let catalog = new Catalog();

import * as Areas from './areas/**/planner-element.jsx';
import * as Lines from './lines/**/planner-element.jsx';
import * as Holes from './holes/**/planner-element.jsx';
import * as Items from './items/**/planner-element.jsx';

for( let x in Areas ) catalog.registerElement( Areas[x] );
for( let x in Lines ) catalog.registerElement( Lines[x] );
for( let x in Holes ) catalog.registerElement( Holes[x] );
for( let x in Items ) catalog.registerElement( Items[x] );

catalog.registerCategory('windows', 'Windows', [Holes.window, Holes.sashWindow, Holes.venetianBlindWindow, Holes.windowCurtain] );
catalog.registerCategory('doors', 'Doors', [Holes.door, Holes.doorDouble, Holes.panicDoor, Holes.panicDoorDouble, Holes.slidingDoor] );
catalog.registerCategory('kitchen', '厨房', [
  Items.kitchenBaseCabinet,
  Items.kitchenWallCabinet,
  Items.kitchenCountertop,
  Items.kitchenCooktop,
  Items.kitchenGasWaterHeater,
  Items.kitchenSink,
  Items.kitchenRangeHood,
  Items.fridge,
]);

export default catalog;
