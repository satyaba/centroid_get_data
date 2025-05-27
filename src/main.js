import { Client, Databases, Storage, Query } from "node-appwrite";

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // You can use the Appwrite SDK to interact with other services
  // For this example, we're using the Users service
  const client = new Client()
  
  client
        .setEndpoint(process.env.APPWRITE_URL)
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(req.headers['x-appwrite-key'] ?? process.env.APPWRITE_API_KEY) // Your secret API key
    ;

  const paths = req.path.split("/")

  // The req object contains the request data
  if (paths[1] === "api" && paths[2] ==="file" && paths.length == 4) {
    // Use res object to respond with text(), json(), or binary()
    // Don't forget to return a response!
    const storage = new Storage(client)
    const db = new Databases(client)

    const docsList = await db.listDocuments(
        env.APPWRITE_DB_ID,
        env.APPWRITE_COLLECTION_FILES_ID,
        [
            Query.equal('filename', [`${paths[3]}.csv`])
        ]
    ).catch(e => e)

    const fileID = docsList.documents[0]['fileID'] 
    
    const file = await storage.getFileDownload(env.APPWRITE_BUCKET_ID, fileID)

    var enc = new TextDecoder("utf-8");
    const csv = enc.decode(file);

    return res.json({
        fileContent: csv
    });
  }

  return res.json({
    error: "An error occured"
  });
};
