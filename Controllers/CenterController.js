
const sql = require("mssql");
const { connectDB } = require("../DB");

//إضافة نوع مركز جديد
async function AddCenterType(req, res) {
    const { Name, Description, Status } = req.body;

    try {
         const pool = await connectDB();

        await pool.request()
            .input('Name', sql.VarChar, Name)
            .input('Description', sql.VarChar, Description)
            .input('Status', sql.Int, Status)
            .query(`
                INSERT INTO Center_Type (Name, Description, Status)
                VALUES (@Name, @Description, @Status)
            `);

        res.send("تمت إضافة نوع المركز بنجاح ✔");
    } catch (err) {
        console.error(err);
        res.status(500).send("خطأ أثناء إضافة نوع المركز");
    }
};

//تعديل نوع مركز 
async function UpdateCenterType(req, res) {
    const typeID = req.params.typeID;
    const { Name, Description, Status } = req.body;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, typeID)
            .input('Name', sql.VarChar, Name)
            .input('Description', sql.VarChar, Description)
            .input('Status', sql.Int, Status)
            .query(`
                UPDATE Center_Type
                SET Name = @Name,
                    Description = @Description,
                    Status = @Status
                WHERE ID = @ID
            `);
            
        if (result.rowsAffected[0] === 0)
            return res.status(404).send("نوع المركز غير موجود");

        res.send("تم تعديل نوع المركز بنجاح ✔");
    } catch (err) {
        console.error(err);
        res.status(500).send("خطأ أثناء تعديل نوع المركز");
    }
};

//إلغاء تفعيل نوع مركز عوضاً عن حذفه
async function InActiveCenterType(req, res) {
    const typeID = req.params.typeID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, typeID)
            .input('Status', sql.Int, 0) // 0 = InActive
            .query(`
                UPDATE Center_Type
                SET Status = @Status
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("نوع المركز غير موجود");

        res.send("تم تغيير الحالة إلى InActive بنجاح ✔");
    } catch (err) {
        console.error(err);
        res.status(500).send("خطأ أثناء تغيير الحالة");
    }
};

//عرض جميع أنواع المراكز
async function SelectCenterType(req, res) {
    try {
        const pool = await connectDB();

        const result = await pool.request().query(`
            SELECT 
                ID,
                Name,
                Description,
                CASE 
                    WHEN Status = 1 THEN 'Active'
                    WHEN Status = 0 THEN 'InActive'
                END AS Status
            FROM Center_Type
        `);

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("خطأ أثناء جلب البيانات");
    }
};

//إضافة مركز جديد
async function AddServiceCenter(req, res) {
    const {
        Name,
        Address,
        Latetude,
        Longtude,
        Description,
        Mobile,
        Phone,
        Center_Type,
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
            .input('Mobile', sql.VarChar, Mobile)
            .input('Phone', sql.VarChar, Phone)
            .input('Center_Type', sql.Int, Center_Type)
            .input('Admin_ID', sql.Int, Admin_ID)
            .input('Status', sql.Int, Status)
            .query(`
                INSERT INTO Service_Center
                (Name, Address, Latetude, Longtude, Description, Mobile, Phone, Center_Type, Admin_ID, Status)
                VALUES
                (@Name, @Address, @Latetude, @Longtude, @Description, @Mobile, @Phone, @Center_Type, @Admin_ID, @Status)
            `);

        res.send("تمت إضافة مركز الخدمة بنجاح ✔");
    } catch (err) {
        console.error(err);
        res.status(500).send("حدث خطأ أثناء إضافة المركز");
    }
};

//تعديل مركز 
async function UpdateServiceCenter(req, res) {
    const centerID = req.params.centerID;
    const {
        Name,
        Address,
        Latetude,
        Longtude,
        Description,
        Mobile,
        Phone,
        Center_Type,
        Admin_ID,
        Status
    } = req.body;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, centerID)
            .input('Name', sql.VarChar, Name)
            .input('Address', sql.VarChar, Address)
            .input('Latetude', sql.Float, Latetude)
            .input('Longtude', sql.Float, Longtude)
            .input('Description', sql.VarChar, Description)
            .input('Mobile', sql.VarChar, Mobile)
            .input('Phone', sql.VarChar, Phone)
            .input('Center_Type', sql.Int, Center_Type)
            .input('Admin_ID', sql.Int, Admin_ID)
            .input('Status', sql.Int, Status)
            .query(`
                UPDATE Service_Center
                SET Name = @Name,
                    Address = @Address,
                    Latetude = @Latetude,
                    Longtude = @Longtude,
                    Description = @Description,
                    Mobile = @Mobile,
                    Phone = @Phone,
                    Center_Type = @Center_Type,
                    Admin_ID = @Admin_ID,
                    Status = @Status
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("لم يتم العثور على هذا المركز");

        res.send("تم تعديل المركز بنجاح ✔");
    } catch (err) {
        console.error(err);
        res.status(500).send("حدث خطأ أثناء تعديل المركز");
    }
};

//إلغاء تفعيل مركز عوضاً عن حذفه 
async function InactiveServiceCenter(req, res) {
    const centerID = req.params.centerID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, centerID)
            .input('Status', sql.Int, 0)
            .query(`
                UPDATE Service_Center
                SET Status = @Status
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("لم يتم العثور على مركز بهذا الرقم");

        res.send("تم تغيير حالة المركز إلى InActive بنجاح ✔");
    } catch (err) {
        console.error(err);
        res.status(500).send("حدث خطأ أثناء تغيير حالة المركز");
    }
};

//  عرض جميع المراكز
async function SelectAllServiceCenter(req, res) {
    try {
        const pool = await connectDB();

        const result = await pool.request().query(`
            SELECT
                S.ID,
                S.Name,
                S.Address,
                S.Latetude,
                S.Longtude,
                S.Description,
                S.Mobile,
                S.Phone,
                S.Center_Type,
                A.Name AS Admin_Name,
                CASE 
                    WHEN S.Status = 1 THEN 'Active'
                    WHEN S.Status = 0 THEN 'InActive'
                END AS Status
            FROM Service_Center S
            LEFT JOIN Admins A ON S.Admin_ID = A.ID
        `);

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("حدث خطأ أثناء جلب المراكز");
    }
};

//  عرض جميع المراكز لمدير معين
async function SelectAllServiceCenterToServiceAdmin(req, res) {
    const adminID = req.params.adminID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('AdminID', sql.Int, adminID)
            .query(`
                SELECT
                    S.ID,
                    S.Name,
                    S.Address,
                    S.Latetude,
                    S.Longtude,
                    S.Description,
                    S.Mobile,
                    S.Phone,
                    S.Center_Type,
                    A.Name AS Admin_Name,
                    CASE 
                        WHEN S.Status = 1 THEN 'Active'
                        WHEN S.Status = 0 THEN 'InActive'
                    END AS Status
                FROM Service_Center S
                LEFT JOIN Admins A ON S.Admin_ID = A.ID
                WHERE S.Admin_ID = @AdminID AND S.Status = 1
            `);

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("حدث خطأ أثناء جلب المراكز الخاصة بالأدمن");
    }
};

//  إضافة صور جديدة
async function AddServiceCenterImage(req, res) {
    const { Src_Image, Center_ID } = req.body;

    try {
        const pool = await connectDB();

        await pool.request()
            .input('Src_Image', sql.VarChar, Src_Image)
            .input('Center_ID', sql.Int, Center_ID)
            .query(`
                INSERT INTO Center_Images (Src_Image, Center_ID)
                VALUES (@Src_Image, @Center_ID)
            `);

        res.send("تمت إضافة الصورة بنجاح ✔");
    } catch (err) {
        console.error(err);
        res.status(500).send("خطأ أثناء إضافة الصورة");
    }
};

//  تعديل صور 
async function UpdateServiceCenterImage(req, res) {
    const imageID = req.params.imageID;
    const { Src_Image, Center_ID } = req.body;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, imageID)
            .input('Src_Image', sql.VarChar, Src_Image)
            .input('Center_ID', sql.Int, Center_ID)
            .query(`
                UPDATE Center_Images
                SET Src_Image = @Src_Image,
                    Center_ID = @Center_ID
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("الصورة غير موجودة");

        res.send("تم تعديل الصورة بنجاح ✔");
    } catch (err) {
        console.error(err);
        res.status(500).send("خطأ أثناء تعديل الصورة");
    }
};

//  حذف صور
async function DeleteServiceCenterImage(req, res) {
    const imageID = req.params.imageID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, imageID)
            .query(`
                DELETE FROM Center_Images
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("الصورة غير موجودة");

        res.send("تم حذف الصورة بنجاح ✔");
    } catch (err) {
        console.error(err);
        res.status(500).send("خطأ أثناء حذف الصورة");
    }
};

//  عرض صور
async function ShowServiceCenterImage(req, res) {
    const centerID = req.params.centerID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('CenterID', sql.Int, centerID)
            .query(`
                SELECT *
                FROM Center_Images
                WHERE Center_ID = @CenterID
            `);

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("خطأ أثناء جلب صور المركز");
    }
};


module.exports = { AddCenterType, UpdateCenterType, InActiveCenterType, SelectCenterType, AddServiceCenterImage, UpdateServiceCenterImage, DeleteServiceCenterImage, ShowServiceCenterImage, AddServiceCenter, UpdateServiceCenter, InactiveServiceCenter, SelectAllServiceCenter, SelectAllServiceCenterToServiceAdmin };

