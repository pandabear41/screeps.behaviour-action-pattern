var setup = new Creep.Setup('upgrader');
setup.minControllerLevel = 3;
setup.maxMulti = function(room){
    let multi = 0;
    if( !room.storage || room.storage.store.energy > MIN_STORAGE_ENERGY[room.controller.level])
        multi++;
    if( !room.storage || room.storage.store.energy > ((MAX_STORAGE_ENERGY[room.controller.level]-MIN_STORAGE_ENERGY[room.controller.level])/2)+MIN_STORAGE_ENERGY[room.controller.level])
        multi++;
    if( room.storage && room.storage.store.energy >= MAX_STORAGE_ENERGY[room.controller.level] )
    {
        let surplus = room.storage.store.energy - MAX_STORAGE_ENERGY[room.controller.level];
        multi += Math.ceil( surplus / 20000 ); // one more multi for each 20k surplus (+1)
    }
    // at rcl 8 limit upgrading
    let rclMax = ( room.controller.level == 8 ) ? CONTROLLER_MAX_UPGRADE_PER_TICK / UPGRADE_CONTROLLER_POWER : 50;
    return Math.min(11, multi, rclMax);
};
setup.maxCount = function(room){
    if (room.situation.invasion ||
        room.conserveForDefense ||
        (room.structures.container.controller.length + room.structures.links.controller.length) == 0 )
        return 0;
    // if there is no energy for the upgrader return 0
    let upgraderEnergy = 0;
    let sumCont = cont => upgraderEnergy += cont.store.energy;
    room.structures.container.controller.forEach(sumCont);
    let sumLink = link => upgraderEnergy += link.energy;
    room.structures.links.controller.forEach(sumLink);
    if( upgraderEnergy === 0 ) return 0;
    if( room.controller.level == 8 ) return 1;
    if( room.storage ) return Math.max(1, Math.floor((room.storage.store.energy-MAX_STORAGE_ENERGY[room.controller.level]) / 100000));
    // dont spawn a new upgrader while there are construction sites (and no storage)
    if( room.constructionSites.length > 0 ) return 0;
    // if energy on the ground next to source > 700 return 3
    if( room.droppedResources ) {
        let dropped = 0;
        let isSource = pos => room.sources.some(s => s.pos.x === pos.x && s.pos.y === pos.y);
        let countNearSource = resource => {
            if( resource.resourceType === RESOURCE_ENERGY ) {
                if( resource.pos.adjacent.some(isSource) ) dropped += resource.amount;
            }
        };
        room.droppedResources.forEach(countNearSource);
        if(dropped > 700) return 3;
    }
    return 2;
};
setup.default = {
    fixedBody: [WORK, WORK, CARRY, MOVE],
    multiBody: [WORK, WORK, WORK, MOVE],
    minAbsEnergyAvailable: 400,
    minEnergyAvailable: 0.5,
    maxMulti: setup.maxMulti,
    maxCount: setup.maxCount,
    highPriority: 50,
};
setup.RCL = {
    1: setup.none,
    2: setup.none,
    3: setup.default,
    4: setup.default,
    5: setup.default,
    6: setup.default,
    7: setup.default,
    8: setup.default
};
module.exports = setup;
