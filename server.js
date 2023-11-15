import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import 'dotenv/config.js'

const app = express(); 
app.use(cors()); // Enable CORS for all routes

// Retrieve client ID and client secret from environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
var access_token = null;

app.get('/', (req, res) =>{
    res.send('Welcome to BMELT server')
});

// HTTP request to obtain an access token
app.get('/connect-spotify', async (req, res) =>{
    const options = {
        method: 'POST',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        },
        body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
    };
    
    try{
        let response = await fetch('https://accounts.spotify.com/api/token', options)

        //Connected to api but not expected response
        if (response.ok) {
            let responseJson = await response.json();
            access_token = responseJson.access_token;
            res.send('Token generated');
        } else {
            console.error('Failed to generate token:', response.status, response.statusText);
            res.status(response.status).send('Failed to generate token');
        };
    } catch (error) {
        //Can't connect to api due to internal error
        console.error('Error generating token:', error.message);
        res.status(500).send('Internal server error');
    }
});

// Route for fetching tracks 
app.get('/track', async (req, res)=>{
    
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
        }
    };

   let response = await fetch('https://api.spotify.com/v1/search?q=regular&type=track&market=US&limit=5&offset=0&include_external=audio', options)
   let responseJson = await response.json()
   res.send(responseJson)
});

// Set the port for the server to listen on
const PORT = 3030.
app.listen(PORT, ()=> console.log(`server is listening on port ${PORT}`));