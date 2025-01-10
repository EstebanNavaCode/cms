import { getConnection } from "../../sis/database/conection.js";

export const renderHomeWithUsers = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`SELECT * FROM USR_T`);

        if (result.recordset.length > 0) {
            console.log("Users found:", result.recordset);
            res.render("home/home", { data: result.recordset }); // Pass user data to the view
        } else {
            res.render("home/home", { data: [], message: "No users found" });
        }
    } catch (err) {
        console.error("Error fetching users:", err.message);
        res.status(500).send("An error occurred while loading the page.");
    }
};

