import pool from '../db.js';

// @desc Get all individual levels or filter by name
// @route GET /api/individual-levels
export const getIndividualLevels = async (req, res, next) => {
    try {
        const { individual_level_name } = req.query;

        // If there is a level name, then validate it 
        if ( (individual_level_name !== undefined) && (typeof individual_level_name !== 'string' || individual_level_name.length > 100) ) {
            return res.status(400).json({
                error: 'Level must be a string and no longer than 100 characters'
            });
        }

        let query = 'SELECT * FROM individual_levels';
        const values = []

        // If the user supplies a name, then add this search functionality to the SQL statement
        if (individual_level_name) {
            query += ' WHERE individual_level_name ILIKE $1';
            values.push(`%${individual_level_name}%`);
        }

        query += ' ORDER BY individual_level_id';

        // Get levels from database
        const result = await pool.query(query, values);

        // Check if the level was actually found with that individual_level_name
        if (result.rows.length === 0) {
            return res.status(200).json({
                error: `Individual Level with name of ${individual_level_name} was not found` 
            });
        };
        
        res.status(200).json(result.rows);
    } catch (error) {
        // Go to next piece of middleware 
        next(error);
    };
};

// @desc Get single individual level
// @route GET /api/individual-levels/:id
export const getIndividualLevel = async (req, res, next) => {
    try {
        // Assign the sent data to variable(s)
        const individual_level_id = Number(req.params.id);

        // Validate the individual level id (make sure its a number)
        if (!Number.isInteger(individual_level_id)) {
            return res.status(400).json({
                error: `Invalid individual level ID: ${req.params.id}`
            });
        }

        // Parameterized query
        const result = await pool.query(
            'SELECT * FROM individual_levels WHERE individual_level_id = $1',
            [individual_level_id]
        );
        
        // Check if the level was actually found with that individual level_id
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: `Individual Level with id of ${req.params.id} was not found` 
            });
        };

        // Set rows[0] instead of just rows since this should only return 1 object
        res.status(200).json(result.rows[0]);
    } catch (error) {
        // Go to next piece of middleware 
        next(error);
    };
};

// @desc Create new individual level
// @route POST /api/individual-levels/
export const createIndividualLevel = async (req, res, next) => {
    try {
        
        const individual_level_name = req.body.individual_level_name;
        // level id is a foreign key to reference the level that this IL is a part of
        const level_id = Number(req.body.level_id);

        // Validate the level id (make sure its a number, and is an integer)
        if (!Number.isInteger(level_id)) {
            return res.status(400).json({
                error: `Invalid level ID: ${level_id}`
            });
        }

        // Validate individual level name (make sure its a string and is not more than 100 character long)
        if (typeof individual_level_name !== 'string' || individual_level_name.length > 100) {
            return res.status(400).json({
                error: 'Individual Level name must be a string and no longer than 100 characters'
            });
        }

        // Parameterized query
        const result = await pool.query(
            'INSERT INTO individual_levels (individual_level_name, level_id) VALUES ($1, $2) RETURNING *',
            [individual_level_name, level_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Go to next piece of middleware 
        next(error);
    };
};

// @desc Update an individual level
// @route PUT /api/individual-levels/:id with individual_level_name in the body
export const updateIndividualLevel = async (req, res, next) => {
    try {

        // Use Number to convert string to integer if it is a string
        const individual_level_id = Number(req.params.id);

        // Validate the level id (make sure its a number, and is an integer)
        if (!Number.isInteger(individual_level_id)) {
            return res.status(400).json({
                error: `Invalid individual level ID: ${individual_level_id}`
            });
        }

        const { individual_level_name } = req.body;

        // Make sure there is a level name and then validate it 
        if ( individual_level_name === undefined ) {
            return res.status(400).json({
                error: 'Individual Level name undefined'
            });
        }

        if (typeof individual_level_name !== 'string' || individual_level_name.length > 100) {
            return res.status(400).json({
                error: 'Individual Level must be a string and no longer than 100 characters'
            });
        }

        const result = await pool.query(
            'UPDATE individual_levels SET individual_level_name = $1 WHERE individual_level_id = $2 RETURNING *',
            [individual_level_name, individual_level_id]
        );

        // Check if the level was actually found with that level_id
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: `Individual Level with id of ${req.params.id} was not found` 
            });
        };

        return res.status(200).json(result.rows[0]);

    } catch (error) {
        // Go to next piece of middleware 
        next(error);
    }
};

// @desc delete a level
// @route DELETE /api/individiual-levels/:id
export const deleteIndividualLevel = async (req, res, next) => {
    try {
        // Get the id from params (URL params)
        const individual_level_id = Number(req.params.id);

        // Validate that it's a valid level id (make sure its an integer that is positive)
        if (!Number.isInteger(individual_level_id) || individual_level_id <= 0) {
            return res.status(400).json({
                error: `Invalid level ID: ${individual_level_id}`
            });
        };

        const result = await pool.query(
            'DELETE FROM individual_levels WHERE individual_level_id = $1 RETURNING *',
            [individual_level_id]
        );

        // Check if individual level was found with that individual level id
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: `Individual level with id of ${individual_level_id} was not ofund`
            })
        }

        // If we are here, that means it was successful, we can return a success message
        res.status(200).json({
            message: `Individual level with id of ${individual_level_id} successfully deleted`
        });

    } catch (error) {
        // Go to next piece of middleware
        next(error);
    }
}