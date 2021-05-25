const express = require('express');
const app = express();

app.get('/', (request, response) => {

    let responseBody = {
        "STATUS": "SUCCESS"
    }
    response.status(200).send(JSON.stringify(responseBody));

});

app.listen(3000);