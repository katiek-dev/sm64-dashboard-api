import colors from 'colors';
colors.setTheme({
    GET: 'blue',
    POST: 'green',
    PUT: 'yellow',
    DELETE: 'red',
});


/* Logger Middleware to log the method, hostname,
 * path, protocol, and time of the request, and color code it aswell with the colors package */
const logger = (req, res, next) => {
     // Add 'time' attribute to the request object with the current time
    req.time = new Date().toString()

    // Color code the HTTP method
    const color = req.method;

    const message = (`${req.method} ${req.path} ${req.hostname} ${req.time}`)

    // Apply color based on theme or default to white color
    console.log(message[color] || message.white);
    
    // Go to next piece of middleware in the stack
    next();
}

export default logger;