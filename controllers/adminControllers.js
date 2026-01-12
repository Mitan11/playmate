import Sport from "../models/Sport";

const getAllSports = async (req, res) => {
    const connection = await db.getConnection();
    try {
        connection.beginTransaction();
        const sports = await Sport.getAllSports(connection);
        await connection.commit();
        res.status(200).json(
            Response.success(200, "Sports fetched successfully", sports)
        );
    } catch (error) {
        await connection.rollback();
        res.status(500).json(
            Response.error(500, "Failed to fetch sports")
        );
    } finally {
        connection.release();
    }
}