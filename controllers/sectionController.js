import pool from '../db.js';

// @desc get all sections, filter by section name, or optionally include levels with a query parameter
// @route GET /api/sections/
export const getSections = async (req, res, next) => {
    try {
        const { section_name, include } = req.query;

        // If there is a section name, then validate it
        if ( (section_name !== undefined) && (typeof section_name !== 'string' || section_name.length > 100) ) {
            return res.status(400).json({
                error: `Invalid section name, must be a string and less than 100 characters`
            });
        };

        // If there is an include parameter, validate it (it can only be levels and has to be defined)
        if (include !== undefined && include !== 'levels') {
            return res.status(400).json({
                message: `Invalid include parameter, support value is levels`
            });
        };

        
        let query;
        const values = [];

        // If user did add the include parameter for levels, include them by joining tables
        if (include === 'levels') {
            query = `
              SELECT
	            sections.section_id, 
	            sections.section_name, 
	            JSON_AGG(
		            JSON_BUILD_OBJECT('level_id', levels.level_id, 'level_name', levels.level_name)
	            ) FILTER (WHERE levels.level_id IS NOT NULL) 
	            AS levels
            FROM sections LEFT JOIN levels 
            ON sections.section_id = levels.section_id GROUP BY sections.section_id
            `;
        } else { 
            query = 'SELECT * FROM sections';
        }

        // If the user did supply a section name, then add that to the search functionality
        if (section_name !== undefined) {
            if (include === 'levels') {
                query += ' WHERE sections.section_name ILIKE $1';
            } else {
                query += " WHERE section_name ILIKE $1";
            }
            values.push(`%${section_name}%`);
        }

        // Sort results
        query += ' ORDER BY section_id'

        // Run the query
        const result = await pool.query(query, values);

        // Check if the section was actually found
        if (result.rows.length === 0) {
            return res.status(200).json({
                error: `Section with the name of ${section_name} was not found`
            });
        };

        // Return response
        res.status(200).json(result.rows);

    } catch (error) {
        next(error);
    }
}

// @desc Get section by id
// @route GET /api/sections/:id
export const getSection = async (req, res, next) => {
    try {
        // Get the id from the params
        const section_id = Number(req.params.id);

        // Validate the id
        if (!Number.isInteger(section_id)) {
            return res.status(400).json({
                error: `Invalid Section ID: ${req.params.id}`
            })
        };

        // Parameterized query
        const result = await pool.query(
            'SELECT * FROM sections WHERE section_id = $1',
            [section_id]
        );

        // Check if the section was actually found with this id
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: `Section with id of ${req.params.id} was not found`
            })
        };

        // Set rows[0] since this should only return 1 object
        res.status(200).json(result.rows[0]);
    } catch (error) {
        // Go to next piece of middleware
        next(error);
    }
}

// @desc Create new section
// @route POST /api/sections/
export const createSection = async (req, res, next) => {
    try {
        const section_name = req.body.section_name;

        // Validate the section name
        if (typeof section_name !== 'string' || section_name.length > 100) {
            return res.status(400).json({
                error: 'Section name must be a string and no longer than 100 characters'
            })
        };

        // Parameterized query
        const result = await pool.query(
            'INSERT INTO sections (section_name) VALUES ($1) RETURNING *',
            [section_name]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Go to next piece of middleware
        next(error);
    }
}

// @desc Update a section
// @route PUT /api/sections/:id with section_name in the bod    y
export const updateSection = async (req, res, next) => {
    try {
        // Assign the sent data to variable(s)
        const section_id = Number(req.params.id);

        // Validate the section id (make sure its a number, and is an integer)
        if (!Number.isInteger(section_id)) {
            return res.status(400).json({
                error: `Invalid section ID: ${section_id}`
            });
        };

        const { section_name } = req.body;

        // Make sure there is a section name and then validate it 
        if ( section_name === undefined ) {
            return res.status(400).json({
                error: 'Section name undefined'
            });
        };

        if (typeof section_name !== 'string' || section_name.length > 100) {
            return res.status(400).json({
                error: 'Section must be a string and no longer than 100 characters'
            });
        }

        const result = await pool.query(
            'UPDATE sections SET section_name = $1 WHERE section_id = $2 RETURNING *',
            [section_name, section_id]
        );

        // Check if the section was actually found with that section_id
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: `Section with id of ${req.params.id} was not found` 
            });
        };

        return res.status(200).json(result.rows[0]);

    } catch (error) {
        // Go to next piece of middleware 
        next(error);
    }
};


// @desc Delete a section
// @route DELETE /api/sections/:id
export const deleteSection = async (req, res, next) => {
    try {
        const section_id = Number(req.params.id);

        // Validate the section id (make sure its a number, and is an integer)
        if (!Number.isInteger(section_id)) {
            return res.status(400).json({
                error: `Invalid section ID: ${section_id}`
            });
        }

        const result = await pool.query(
            'DELETE FROM sections WHERE section_id = $1 RETURNING *',
            [section_id]
        );

        // Check if the section was actually found with that section id
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: `Section with id of ${section_id} was not found` 
            });
        };
        
        return res.status(200).json({
            message: `Section with id of ${section_id} successfully deleted`
        })
    } catch (error) {
        // Go to next piece of middleware 
        next(error);
    }
};