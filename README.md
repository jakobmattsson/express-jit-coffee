### What
An express middleware to automatically compile and serve coffeescript files just in time.

Make sure to include it before any regular file serving.

### How

    var jitCoffee = require('express-jit-coffee');

    // express mumbo-jumbo here...

    app.use(jitCoffee(__dirname + '/public'));
