import { Client, Databases, Storage, Query } from 'node-appwrite';
import * as dotenv from 'dotenv';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // You can use the Appwrite SDK to interact with other services
  // For this example, we're using the Users service
  const paths = req.path.split('/');
  const env = dotenv.config()['parsed']

  if (paths[1] === 'api' && paths[2] === 'file' && paths.length == 4) {
    console.log('Logging by console.log');
    log('Logging by log()');
    const client = new Client();

    client
        .setEndpoint(env.APPWRITE_URL)
        .setProject(env.APPWRITE_PROJECT_ID)
        .setKey(env.APPWRITE_API_KEY) // Your secret API key
    ;

    const storage = new Storage(client)
    const db = new Databases(client)

    const name = paths[3]


    const docsList = await db.listDocuments(
        env.APPWRITE_DB_ID,
        env.APPWRITE_COLLECTION_FILES_ID,
        [
            Query.equal('filename', [`${name}.csv`])
        ]
    ).catch(e => e)

    const fileID = docsList.documents[0]['fileID'] 
    
    const file = await storage.getFileDownload(env.APPWRITE_BUCKET_ID, fileID)

    var enc = new TextDecoder("utf-8");
    const csv = enc.decode(file)

    return res.json({
      fileContent: csv,
    });
  }

  return res.json({
    error: 'An error occured',
  });
};
