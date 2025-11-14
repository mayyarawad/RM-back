const express = require('express');
const cors = require('cors');
const { sql, config } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// إضافة صالة جديدة
 async function AddLounge(req, res) {
    const {
        Name,
        Address,
        Latetude,
        Longtude,
        Description,
        Has_car,
        image360,
        Mobile,
        Phone,
        Max_Of_Guest,
        Price_Of_One_Guest,
        Price_Of_Services,
        Total_Price,
        Admin_ID,
        Status
    } = req.body;

    try {
        let pool = await sql.connect(config);

        await pool.request()
            .input('Name', sql.VarChar, Name)
            .input('Address', sql.VarChar, Address)
            .input('Latetude', sql.Float, Latetude)
            .input('Longtude', sql.Float, Longtude)
            .input('Description', sql.VarChar, Description)
            .input('Has_car', sql.Int, Has_car)
            .input('_360_image', sql.VarChar, image360)
            .input('Mobile', sql.VarChar, Mobile)
            .input('Phone', sql.VarChar, Phone)
            .input('Max_Of_Guest', sql.Int, Max_Of_Guest)
            .input('Price_Of_One_Guest', sql.Money, Price_Of_One_Guest)
            .input('Price_Of_Services', sql.Money, Price_Of_Services)
            .input('Total_Price', sql.Money, Total_Price)
            .input('Admin_ID', sql.Int, Admin_ID)
            .input('Status', sql.Int, Status)
            .query(`
                INSERT INTO Lounge (
                    Name, Address, Latetude, Longtude, Description, Has_car,
                    _360_image, Mobile, Phone, Max_Of_Guest,
                    Price_Of_One_Guest, Price_Of_Services, Total_Price,
                    Admin_ID, Status
                )
                VALUES (
                    @Name, @Address, @Latetude, @Longtude, @Description, @Has_car,
                    @_360_image, @Mobile, @Phone, @Max_Of_Guest,
                    @Price_Of_One_Guest, @Price_Of_Services, @Total_Price,
                    @Admin_ID, @Status
                )
            `);

        res.send("تمت إضافة الصالة بنجاح ✔");
    } catch (err) {
        console.error(err);
        res.status(500).send("حدث خطأ أثناء إضافة الصالة");
    }
};

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
