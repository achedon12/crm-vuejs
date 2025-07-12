module.exports.Catch = (error) => {
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        res.status(400).json({message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`});
    } else {
        res.status(400).json({message: error.message});
    }
}