import {labRegistry} from "./labs.registry.js";

export function getLab(labId){

    const lab = labRegistry[labId];
    if(!lab){
        throw new Error(`Lab with id ${labId} not found`);
    }
    if (!lab.enabled) {
        throw new Error("Lab is disabled");
    }
    return lab;
}