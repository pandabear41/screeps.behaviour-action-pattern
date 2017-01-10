module.exports = {
    name: 'claimer',
    run: function(creep) {
        // Assign next Action
        let oldTargetId = creep.data.targetId;
        if( creep.action == null || creep.action.name == 'idle') {
            this.nextAction(creep);
        }
        if( creep.data.targetId != oldTargetId ) {
            delete creep.data.path;
        }
        // Do some work
        if( creep.action && creep.target ) {
            creep.action.step(creep);
        } else {
            logError('Creep without action/activity!\nCreep: ' + creep.name + '\ndata: ' + JSON.stringify(creep.data));
        }
        if( creep.hits < creep.hitsMax ) { // creep injured. move to next owned room
            let nextHome = Room.bestSpawnRoomFor(creep.pos.roomName);
            if( nextHome )
                creep.drive( nextHome.controller.pos, 3, 5);
        }
    },
    nextAction: function(creep){
      
/*
        if( creep.data.destiny.task = 'claim') {
            Creep.action.claiming
        }

        if( creep.data.destiny.task = 'reserve') {
            Creep.action.reserving
        }   else  {
            logError('Creep without action/activity!\nCreep: ' + creep.name + '\ndata: ' + JSON.stringify(creep.data));
        }

            */
        let priority = [
         //  Creep.action.claiming,
            Creep.action.reserving,
            Creep.action.idle
        ];
        for(var iAction = 0; iAction < priority.length; iAction++) {
            var action = priority[iAction];
            if(action.isValidAction(creep) &&
                action.isAddableAction(creep) &&
                action.assign(creep)) {
                    return;
            }
        } 
    }
}