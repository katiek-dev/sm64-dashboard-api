const errorHandler = (err, req, res, next) => {
    // Log error message
    console.error(err.message);

    console.log("error handler middleware test");

    // Check if the error has a status, if it does respond with that status
    if (err.status) {
        res.status(err.status).json({message: err.message});
    } else { // Otherwise just send the error message
        res.status(500).json({ msg: err.message });
    }
}

export default errorHandler;