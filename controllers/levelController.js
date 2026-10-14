import pool from '../db.js';

// @desc Get all levels or filter by name
// @route GET /api/levels
export const getLevels = async (req, res, next) => {
    try {
        const { level_name } = req.query;

        // If there is a level name, then validate it 
        if ( (level_name !== undefined) && (typeof level_name !== 'string' || level_name.length > 100) ) {
            return res.status(400).json({
                error: 'Level must be a string and no longer than 100 characters'
            });
        }

        let query = 'SELECT * FROM levels';
        const values = []

        // If the user supplies a name, then add this search functionality to the SQL statement
        if (level_name) {
            query += ' WHERE level_name ILIKE $1';
            values.push(`%${level_name}%`);
        }

        query += ' ORDER BY level_id';

        // Get levels from database
        const result = await pool.query(query, values);

        // Check if the level was actually found with that level_name
        if (result.rows.length === 0) {
            return res.status(200).json({
                error: `Level with name of ${level_name} was not found` 
            });
        };
        
        res.status(200).json(result.rows);
    } catch (error) {
        // Go to next piece of middleware 
        next(error);
    };
};

// @desc Get single level
// @route GET /api/levels/:id
export const getLevel = async (req, res, next) => {
    try {
        // Assign the sent data to variable(s)
        const level_id = Number(req.params.id);

        // Validate the level id (make sure its a number, and is an integer)
        if (!Number.isInteger(level_id)) {
            return res.status(400).json({
                error: `Invalid level ID: ${req.params.id}`
            });
        }

        // Parameterized query
        const result = await pool.query(
            'SELECT * FROM levels WHERE level_id = $1',
            [level_id]
        );
        
        // Check if the level was actually found with that level_id
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: `Level with id of ${req.params.id} was not found` 
            });
        };

        // Set rows[0] instead of just rows since this should only return 1 object
        res.status(200).json(result.rows[0]);
    } catch (error) {
        // Go to next piece of middleware 
        next(error);
    };
};

// @desc Create new level
// @route POST /api/levels/
export const createLevel = async (req, res, next) => {
    try {
        const level_name = req.body.level_name;

        // Validate level name (make sure its a string and is not more than 100 character long)
        if (typeof level_name !== 'string' || level_name.length > 100) {
            return res.status(400).json({
                error: 'Level must be a string and no longer than 100 characters'
            });
        }

        // Parameterized query
        const result = await pool.query(
            'INSERT INTO levels (level_name) VALUES ($1) RETURNING *',
            [level_name]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Go to next piece of middleware 
        next(error);
    };
};

// @desc Update a level
// @route PUT /api/levels/:id with level_name in the body
export const updateLevel = async (req, res, next) => {
    console.log("update controller running")
    try {
        // Assign the sent data to variable(s)
        const level_id = Number(req.params.id);

        // Validate the level id (make sure its a number, and is an integer)
        if (!Number.isInteger(level_id)) {
            return res.status(400).json({
                error: `Invalid level ID: ${level_id}`
            });
        }

        const { level_name } = req.body;

        // Make sure there is a level name and then validate it 
        if ( level_name === undefined ) {
            return res.status(400).json({
                error: 'Level name undefined'
            });
        }

        if (typeof level_name !== 'string' || level_name.length > 100) {
            return res.status(400).json({
                error: 'Level must be a string and no longer than 100 characters'
            });
        }

        const result = await pool.query(
            'UPDATE levels SET level_name = $1 WHERE level_id = $2 RETURNING *',
            [level_name, level_id]
        );

        // Check if the level was actually found with that level_id
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: `Level with id of ${req.params.id} was not found` 
            });
        };

        return res.status(200).json(result.rows[0]);

    } catch (error) {
        // Go to next piece of middleware 
        next(error);
    }
};


// @desc Delete a level
// @route DELETE /api/levels/:id
export const deleteLevel = async (req, res, next) => {
    try {
        const level_id = Number(req.params.id);

        // Validate the level id (make sure its a number, and is an integer)
        if (!Number.isInteger(level_id)) {
            return res.status(400).json({
                error: `Invalid level ID: ${level_id}`
            });
        }

        const result = await pool.query(
            'DELETE FROM levels WHERE level_id = $1 RETURNING *',
            [level_id]
        );

        // Check if the level was actually found with that level_id
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: `Level with id of ${level_id} was not found` 
            });
        };
        
        return res.status(200).json({
            message: `Level with id of ${level_id} successfully deleted`
        })
    } catch (error) {
        
    }
};