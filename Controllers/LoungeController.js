const sql = require("mssql");
const { connectDB } = require("../DB");

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
        const pool = await connectDB();

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

//تعديل صالة معينة
 async function UpdateLounge(req, res) {

    const loungeID = req.params.loungeID;

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
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, loungeID)
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
                UPDATE Lounge SET
                    Name = @Name,
                    Address = @Address,
                    Latetude = @Latetude,
                    Longtude = @Longtude,
                    Description = @Description,
                    Has_car = @Has_car,
                    _360_image = @_360_image,
                    Mobile = @Mobile,
                    Phone = @Phone,
                    Max_Of_Guest = @Max_Of_Guest,
                    Price_Of_One_Guest = @Price_Of_One_Guest,
                    Price_Of_Services = @Price_Of_Services,
                    Total_Price = @Total_Price,
                    Admin_ID = @Admin_ID,
                    Status = @Status
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send("لم يتم العثور على صالة بهذا الرقم");
        }

        res.send("تم تعديل بيانات الصالة بنجاح ✔");
    } catch (err) {
        console.error(err);
        res.status(500).send("حدث خطأ أثناء تعديل بيانات الصالة");
    }
 };

 //إلغاء تفعيل صالة عوضاً عن حذفها بشكل نهائي
 async function InActiveLounge(req, res) {
    const loungeID = req.params.loungeID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, loungeID)
            .input('Status', sql.Int, 0) // 0 = NotActive
            .query(`
                UPDATE Lounge
                SET Status = @Status
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send("لم يتم العثور على صالة بهذا الرقم");
        }

        res.send("تم تغيير حالة الصالة إلى NotActive بنجاح ✔");
    } catch (err) {
        console.error(err);
        res.status(500).send("حدث خطأ أثناء تعديل حالة الصالة");
    }
 };

//عرض جميع الصالات
 async function SelectAllLounge(req, res) {
      try {
        const pool = await connectDB();

        const result = await pool.request().query(`
            SELECT 
                L.ID,
                L.Name,
                L.Address,
                L.Latetude,
                L.Longtude,
                L.Description,
                L.Has_car,
                L._360_image,
                L.Mobile,
                L.Phone,
                L.Max_Of_Guest,
                L.Price_Of_One_Guest,
                L.Price_Of_Services,
                L.Total_Price,

                A.Name AS Admin_Name,

                CASE 
                    WHEN L.Status = 1 THEN 'Active'
                    WHEN L.Status = 0 THEN 'InActive'
                    ELSE 'Unknown'
                END AS Status
            FROM Lounge L
            LEFT JOIN Admins A
                ON L.Admin_ID = A.ID
        `);

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("حدث خطأ أثناء جلب بيانات الصالات");
    }
 };

 // عرض جميع الصالات التي يمتلكها ادمن واحد
 async function SelectAllLoungeToServiceAdmin(req, res) {
     const adminID = req.params.adminID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('AdminID', sql.Int, adminID)
            .query(`
                SELECT 
                    L.ID,
                    L.Name,
                    L.Address,
                    L.Latetude,
                    L.Longtude,
                    L.Description,
                    L.Has_car,
                    L._360_image,
                    L.Mobile,
                    L.Phone,
                    L.Max_Of_Guest,
                    L.Price_Of_One_Guest,
                    L.Price_Of_Services,
                    L.Total_Price,

                    A.Name AS Admin_Name,

                    CASE 
                        WHEN L.Status = 1 THEN 'Active'
                        WHEN L.Status = 0 THEN 'InActive'
                        ELSE 'Unknown'
                    END AS Status

                FROM Lounge L
                LEFT JOIN Admins A ON L.Admin_ID = A.ID
                WHERE L.Admin_ID = @AdminID AND L.Status = 1
            `);

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("حدث خطأ أثناء جلب بيانات الصالات");
    }
 };

 //  إضافة صور جديدة
async function AddLoungeImage(req, res) {
 const { Src_Image, Lounge_ID } = req.body;

    try {
        const pool = await connectDB();

        await pool.request()
            .input('Src_Image', sql.VarChar, Src_Image)
            .input('Lounge_ID', sql.Int, Lounge_ID)
            .query(`
                INSERT INTO Lounge_Images (Src_Image, Lounge_ID)
                VALUES (@Src_Image, @Lounge_ID)
            `);

        res.send("تمت إضافة صورة الصالة بنجاح ✔");
    } catch (err) {
        console.error(err);
        res.status(500).send("حدث خطأ أثناء إضافة الصورة");
    }
};

//  تعديل صور 
async function UpdateLoungeImage(req, res) {
    const imageID = req.params.imageID;
    const { Src_Image, Lounge_ID } = req.body;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, imageID)
            .input('Src_Image', sql.VarChar, Src_Image)
            .input('Lounge_ID', sql.Int, Lounge_ID)
            .query(`
                UPDATE Lounge_Images
                SET Src_Image = @Src_Image,
                    Lounge_ID = @Lounge_ID
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("الصورة غير موجودة");

        res.send("تم تعديل صورة الصالة بنجاح ✔");
    } catch (err) {
        console.error(err);
        res.status(500).send("حدث خطأ أثناء تعديل الصورة");
    }
};

//  حذف صور
async function DeleteLoungeImage(req, res) {
     const imageID = req.params.imageID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, imageID)
            .query(`
                DELETE FROM Lounge_Images
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("الصورة غير موجودة");

        res.send("تم حذف صورة الصالة بنجاح ✔");
    } catch (err) {
        console.error(err);
        res.status(500).send("حدث خطأ أثناء حذف الصورة");
    }
};

//  عرض صور
async function ShowLoungeImage(req, res) {
      const loungeID = req.params.loungeID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('LoungeID', sql.Int, loungeID)
            .query(`
                SELECT *
                FROM Lounge_Images
                WHERE Lounge_ID = @LoungeID
            `);

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("حدث خطأ أثناء جلب صور الصالة");
    }
};


module.exports = { AddLounge,UpdateLounge,InActiveLounge,SelectAllLounge,SelectAllLoungeToServiceAdmin ,AddLoungeImage,UpdateLoungeImage,DeleteLoungeImage,ShowLoungeImage};

