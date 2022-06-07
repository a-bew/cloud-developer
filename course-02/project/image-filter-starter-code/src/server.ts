import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import fs from 'fs';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

    // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  app.get("/filteredimage", async (req: any, res: any) => {

    const { image_url } = req.query;
    try {

      if (!image_url){
        return res.status(400).send("An image path is required");
      }

      // 1. validate the image_url query
      if (!fs.existsSync(image_url)) {
        // path exists
          return res.status(400).send("path does not exists: " +image_url)
      }

      // 2. call filterImageFromURL(image_url) to filter the image
      const imageFile = await filterImageFromURL(image_url)

      // 3. send the resulting file in the response
      res.send(imageFile)

      // 4. deletes any files on the server on finish of the response
      deleteLocalFiles([imageFile])

    } catch (error) {
      res.status(500).send("Server Error")
    }

  })
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();