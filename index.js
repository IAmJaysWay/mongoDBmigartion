const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const dbName = 'parse';
const collectionName = 'Food'

const MONGO_HOST = 'xx';  
const MONGO_PORT = 'xx';
const newMongo = 'xx';

const client = new MongoClient(`mongodb://${MONGO_HOST}:${MONGO_PORT}`, { useUnifiedTopology:true });
const newClient = new MongoClient(newMongo, { useUnifiedTopology:true });


client.connect(function(err) {
    console.log('Connected successfully to server');
    const db = client.db(dbName);

    getDocuments(db, function(docs) {
    
        console.log('Closing connection.');
        client.close();
        
        // Write to file
        try {
            fs.writeFileSync('out_file.json', JSON.stringify(docs));
            console.log('Done writing to file.');
        }
        catch(err) {
            console.log('Error writing to file', err)
        }
    });
})

const getDocuments = function(db, callback) {
    const query = { };  // this is your query criteria
    db.collection(collectionName)
      .find(query)
      .toArray(function(err, result) { 
          if (err) throw err; 
          callback(result); 
    }); 
};


newClient.connect(function(err) {

    const db = newClient.db(dbName);
    const data = fs.readFileSync('out_file.json');
    const docs = JSON.parse(data.toString());
    
    db.collection(collectionName)
        .insertMany(docs, function(err, result) {
            if (err) throw err;
            console.log('Inserted docs:', result.insertedCount);
            newClient.close();
    });
});