const events = require('events');
const audit = require('../model/auditModel');
const queries = require('../db/quiries');
const dbConnection = require('../db/connection');

const emitter = new events.EventEmitter();

const auditEvent = "aduit";
emitter.on(auditEvent, async (audit) => {
    // steps of actions -> save into db 
    console.log("Audit Event Emitter Audit : "+ JSON.stringify(audit));
    try{
        const auditQuery = queries.queryList.AUDIT_QUERY;
        const values = [audit.auditAction, JSON.stringify(audit.data), audit.status, audit.error, audit.auditBy, audit.audirOn];
        return await dbConnection.query(auditQuery, values);    
    }catch(e){
        console.log("Audit Event Emitter Error : "+ e);
    }
   
});


exports.prepareAduit = (auditAction, data, error, auditBy, audirOn) => {
    let status = 200;
    if(error)
        status = 500;
    const auditO = new audit.Audit(auditAction, data, status, error, auditBy, audirOn);    
    emitter.emit(auditEvent, auditO);     
}