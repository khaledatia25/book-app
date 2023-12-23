const queries = require('../db/quiries');
const dbConnection = require('../db/connection');
const util = require('../util/utility');

exports.getStoreList = async (req, res) => {
    try{
        const StoreListQuery = queries.queryList.GET_STORE_LIST_QUERY;
        const result = await dbConnection.query(StoreListQuery);
        return res.status(200).send(JSON.stringify(result.rows));
    }catch(e){
        console.log(e);
        return res.status(500).send({error: 'Failed to list Store'});
    }
}

exports.saveStore = async (req, res) => {
    try {
        const createdBy = 'admin';
        const createdOn = new Date();
        
        const storeName = req.body.storeName;
        const address = req.body.address;
        console.log(storeName);
        if(!storeName||!address){
            return res.status(500).send({error: 'Store name and address must be provided'});
        }
        const storCode = util.generateStoreCode();
        const values = [storeName, storCode, address, createdBy, createdOn];
        const saveStoreQuery = queries.queryList.SAVE_STORE_QUERY;
        await dbConnection.query(saveStoreQuery, values);
        return res.status(201).send('Store Created Successfully.');
    }catch(e){
        console.log(e);
        return res.status(500).send({error: 'Failed to Create Store'});
    }

}