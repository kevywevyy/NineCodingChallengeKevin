const express = require('express');
const bodyParser = require('body-parser');
const { restart } = require('nodemon');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

// default route
app.get('/', (req, res) => res.send('Nine Coding Challenge'));

// POST request
app.post('/', function(req, res, next) {
    // reference: using reduce() to create new object https://jonsadka.com/blog/using-reduce-to-create-arrays-and-objects-in-javascript
    try {
        const result = req.body.payload.reduce((previous, current) => {
            if (current.drm === true && current.episodeCount > 0) {
                previous.push({
                    image: current.image.showImage,
                    slug: current.slug,
                    title: current.title
                });
            }
            return previous;
        }, []);
        console.log(result);
        res.status(200).json({response: result});
    } catch (error) {
        // Reference: https://expressjs.com/en/guide/error-handling.html 
        // Passes errors to Express
        next(error);
    }
});

// Error Handling. Reference: https://expressjs.com/en/guide/error-handling.html 
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        res.status(400).json({"error": "Could not decode request: JSON parsing failed."})
    } else if (!req.body.payload) {
        res.status(400).json({error: "Invalid Payload. `Payload` field doesn't exist."});
    } else {
        res.status(400).json({error: err.message});
    }
})

app.listen(port, () => console.log(`Server running on port: http://localhost:${port}`));
