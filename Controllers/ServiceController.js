const sql = require("mssql");
const { connectDB } = require("../DB");

// إضافة سيارة جديدة
async function AddCar(req, res) {
     const { Name, Number, Color, Price, Center_ID } = req.body;

    try {
        const pool = await connectDB();

        await pool.request()
            .input('Name', sql.VarChar, Name)
            .input('Number', sql.VarChar, Number)
            .input('Color', sql.VarChar, Color)
            .input('Price', sql.Money, Price)
            .input('Center_ID', sql.Int, Center_ID)
            .query(`
                INSERT INTO Cars (Name, Number, Color, Price, Center_ID)
                VALUES (@Name, @Number, @Color, @Price, @Center_ID, @Status)
            `);

        res.send("✔ تم إضافة السيارة بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء إضافة السيارة");
    }
};

// تعديل سيارة
async function UpdateCar(req, res) {
     const carID = req.params.carID;
    const { Name, Number, Color, Price, Center_ID } = req.body;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, carID)
            .input('Name', sql.VarChar, Name)
            .input('Number', sql.VarChar, Number)
            .input('Color', sql.VarChar, Color)
            .input('Price', sql.Money, Price)
            .input('Center_ID', sql.Int, Center_ID)
            .query(`
                UPDATE Cars
                SET Name = @Name,
                    Number = @Number,
                    Color = @Color,
                    Price = @Price,
                    Center_ID = @Center_ID
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ لم يتم العثور على السيارة");

        res.send("✔ تم تعديل السيارة بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء تعديل بيانات السيارة");
    }
};

// حذف سيارة
async function DeleteCar(req, res) {
      const carID = req.params.carID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, carID)
            .query(`
                DELETE FROM Cars
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ السيارة غير موجودة");

        res.send("✔ تم حذف السيارة");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء حذف السيارة");
    }
};

// عرض جميع السيارات
async function ShowALLCar(req, res) {
    try {
        const pool = await connectDB();

        const result = await pool.request().query(`
            SELECT 
                C.ID,
                C.Name,
                C.Number,
                C.Color,
                C.Price,

                SC.Name AS Center_Name,

            FROM Cars C
            LEFT JOIN Service_Center SC ON C.Center_ID = SC.ID
        `);

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء جلب السيارات");
    }
};

// عرض جميع السيارات الخاصة بمركز معين 
async function ShowALLCarToServiceCenter(req, res) {
    const centerID = req.params.centerID;
    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('CenterID', sql.Int, centerID)
            .query(`
                SELECT 
                    C.ID,
                    C.Name,
                    C.Number,
                    C.Color,
                    C.Price,

                    SC.Name AS Center_Name,
                FROM Cars C
                INNER JOIN Service_Center SC ON C.Center_ID = SC.ID
                WHERE  C.Center_ID = @CenterID
            `);

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء جلب سيارات الأدمن");
    }
};

//  إضافة صور سيارة جديدة
async function AddCarImage(req, res) {
 const { Src_Image, Service_ID } = req.body;

    try {
        const pool = await connectDB();

        await pool.request()
            .input('Src_Image', sql.VarChar, Src_Image)
            .input('Service_ID', sql.Int, Service_ID)
            .query(`
                INSERT INTO Service_Images (Src_Image, Service_Type, Service_ID)
                VALUES (@Src_Image, 'Car', @Service_ID)
            `);

        res.send("✔ تم إضافة صورة السيارة بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء إضافة الصورة");
    }
};

//  تعديل صور سيارات 
async function UpdateCarImage(req, res) {
    const imageID = req.params.imageID;
    const { Src_Image, Service_ID } = req.body;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, imageID)
            .input('Src_Image', sql.VarChar, Src_Image)
            .input('Service_ID', sql.Int, Service_ID)
            .query(`
                UPDATE Service_Images
                SET 
                    Src_Image = @Src_Image,
                    Service_Type = 'Car',
                    Service_ID = @Service_ID
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ الصورة غير موجودة");

        res.send("✔ تم تعديل الصورة بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء تعديل الصورة");
    }
};

//  حذف صور سيارات
async function DeleteCarImage(req, res) {
     const imageID = req.params.imageID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, imageID)
            .query(`
                DELETE FROM Service_Images
                WHERE ID = @ID AND Service_Type = 'Car'
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ الصورة غير موجودة");

        res.send("✔ تم حذف صورة السيارة بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء حذف الصورة");
    }
};

//  عرض صور سيارات
async function ShowCarImage(req, res) {
    const carID = req.params.carID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('CarID', sql.Int, carID)
            .query(`
                SELECT 
                    ID,
                    Src_Image,
                    Service_Type,
                    Service_ID
                FROM Service_Images
                WHERE Service_ID = @CarID AND Service_Type = 'Car'
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ حدث خطأ أثناء جلب صور السيارة");
    }
};

//إضافة باقة ورود جديدة
async function AddFlower(req, res) {
const { Name, Type, Color, Price, Center_ID } = req.body;

    try {
        const pool = await connectDB();

        await pool.request()
            .input('Name', sql.VarChar, Name)
            .input('Type', sql.VarChar, Type)
            .input('Color', sql.VarChar, Color)
            .input('Price', sql.Money, Price)
            .input('Center_ID', sql.Int, Center_ID)
            .query(`
                INSERT INTO Flowers (Name, Type, Color, Price, Center_ID)
                VALUES (@Name, @Type, @Color, @Price, @Center_ID)
            `);

        res.send("✔ تم إضافة الباقة بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء إضافة الباقة");
    }
};

//تعديل باقة ورود 
async function UpdateFlower(req, res) {
    const flowerID = req.params.flowerID;
    const { Name, Type, Color, Price, Center_ID } = req.body;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, flowerID)
            .input('Name', sql.VarChar, Name)
            .input('Type', sql.VarChar, Type)
            .input('Color', sql.VarChar, Color)
            .input('Price', sql.Money, Price)
            .input('Center_ID', sql.Int, Center_ID)
            .query(`
                UPDATE Flowers
                SET Name = @Name,
                    Type = @Type,
                    Color = @Color,
                    Price = @Price,
                    Center_ID = @Center_ID
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ الباقة غير موجودة");

        res.send("✔ تم تعديل الباقة بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء تعديل الباقة");
    }
};

//حذف باقي ورود
async function DeleteFlower(req, res) {
    const flowerID = req.params.flowerID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, flowerID)
            .query(`
                DELETE FROM Flowers
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ الباقة غير موجودة");

        res.send("✔ تم حذف الباقة");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء حذف الباقة");
    }
};

// عرض جميع الباقات
async function ShowAllFlower(req, res) {
     try {
        const pool = await connectDB();

        const result = await pool.request().query(`
            SELECT 
                F.ID,
                F.Name,
                F.Type,
                F.Color,
                F.Price,

                SC.Name AS Center_Name,

            FROM Flowers F
            LEFT JOIN Service_Center SC ON F.Center_ID = SC.ID
        `);

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء جلب الباقات");
    }
};

// عرض جميع الباقات الخاصة بمركز معين 
async function ShowAllFlowerToServiceCenter(req, res) {
    const centerID = req.params.centerID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('CenterID', sql.Int, centerID)
            .query(`
                SELECT 
                    F.ID,
                    F.Name,
                    F.Type,
                    F.Color,
                    F.Price,

                    SC.Name AS Center_Name,

                FROM Flowers F
                INNER JOIN Service_Center SC ON F.Center_ID = SC.ID
                WHERE  C.Center_ID = @CenterID

            `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء جلب باقات الأدمن");
    }
};

//  إضافة صور باقة جديدة
async function AddFlowerImage(req, res) {
 const { Src_Image, Service_ID } = req.body;

    try {
        const pool = await connectDB();

        await pool.request()
            .input('Src_Image', sql.VarChar, Src_Image)
            .input('Service_ID', sql.Int, Service_ID)
            .query(`
                INSERT INTO Service_Images (Src_Image, Service_Type, Service_ID)
                VALUES (@Src_Image, 'Flower', @Service_ID)
            `);

        res.send("✔ تم إضافة صورة باقة بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء إضافة الصورة");
    }
};

//  تعديل صور باقة 
async function UpdateFlowerImage(req, res) {
    const imageID = req.params.imageID;
    const { Src_Image, Service_ID } = req.body;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, imageID)
            .input('Src_Image', sql.VarChar, Src_Image)
            .input('Service_ID', sql.Int, Service_ID)
            .query(`
                UPDATE Service_Images
                SET 
                    Src_Image = @Src_Image,
                    Service_Type = 'Flower',
                    Service_ID = @Service_ID
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ الصورة غير موجودة");

        res.send("✔ تم تعديل الصورة بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء تعديل الصورة");
    }
};

//  حذف صور باقة
async function DeleteFlowerImage(req, res) {
     const imageID = req.params.imageID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, imageID)
            .query(`
                DELETE FROM Service_Images
                WHERE ID = @ID AND Service_Type = 'Flower'
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ الصورة غير موجودة");

        res.send("✔ تم حذف صورة الباقة بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء حذف الصورة");
    }
};

//  عرض صور الباقات
async function ShowFlowerImage(req, res) {
    const flowerID = req.params.flowerID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('FlowerID', sql.Int, flowerID)
            .query(`
                SELECT 
                    ID,
                    Src_Image,
                    Service_Type,
                    Service_ID
                FROM Service_Images
                WHERE Service_ID = @FlowerID AND Service_Type = 'Flower'
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ حدث خطأ أثناء جلب صور الباقة");
    }
};

// إضافة تسريحة شعر جديدة
async function AddHairModels(req, res) {
     const { Type, Price, Center_ID } = req.body;

    try {
        const pool = await connectDB();

        await pool.request()
            .input('Type', sql.VarChar, Type)
            .input('Price', sql.Int, Price)
            .input('Center_ID', sql.Int, Center_ID)
            .query(`
                INSERT INTO Hair_Models (Type, Price, Center_ID)
                VALUES (@Type, @Price, @Center_ID)
            `);

        res.send("✔ تم إضافة تسريحة الشعر بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء إضافة التسريحة");
    }
};

// تعديل تسريحة شعر
async function UpdateHairModels(req, res) {
     const hairID = req.params.hairID;
    const { Type, Price, Center_ID } = req.body;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, hairID)
            .input('Type', sql.VarChar, Type)
            .input('Price', sql.Int, Price)
            .input('Center_ID', sql.Int, Center_ID)
            .query(`
                UPDATE Hair_Models
                SET 
                    Type = @Type,
                    Price = @Price,
                    Center_ID = @Center_ID
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ لم يتم العثور على التسريحة");

        res.send("✔ تم تعديل التسريحة بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء تعديل التسريحة");
    }
};

//حذف تسريحة شعر
async function DeleteHairModels(req, res) {
    const hairID = req.params.hairID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, hairID)
            .query(`
                DELETE FROM Hair_Models
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ لم يتم العثور على التسريحة");

        res.send("✔ تم حذف التسريحة بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء حذف التسريحة");
    }
};

// عرض جميع تسريحات الشعر
async function ShowHairModels(req, res) {
    try {
        const pool = await connectDB();

        const result = await pool.request().query(`
            SELECT 
                H.ID,
                H.Type,
                H.Price,
                SC.Name AS Center_Name
            FROM Hair_Models H
            LEFT JOIN Service_Center SC ON H.Center_ID = SC.ID
        `);

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء جلب تسريحات الشعر");
    }
};

//عرض جميع تسريحات الشهر بمركز معين
async function ShowHairModelsToServiceCenter(req, res) {
    const centerID = req.params.centerID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('CenterID', sql.Int, centerID)
            .query(`
                SELECT 
                    H.ID,
                    H.Type,
                    H.Price,
                    SC.Name AS Center_Name
                FROM Hair_Models H
                INNER JOIN Service_Center SC ON H.Center_ID = SC.ID
                WHERE  C.Center_ID = @CenterID
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء جلب تسريحات الأدمن");
    }
};

//  إضافة صور تسريحة شعر جديدة
async function AddHairModelsImage(req, res) {
 const { Src_Image, Service_ID } = req.body;

    try {
        const pool = await connectDB();

        await pool.request()
            .input('Src_Image', sql.VarChar, Src_Image)
            .input('Service_ID', sql.Int, Service_ID)
            .query(`
                INSERT INTO Service_Images (Src_Image, Service_Type, Service_ID)
                VALUES (@Src_Image, 'Hair Model', @Service_ID)
            `);

        res.send("✔ تم إضافة صورة التسريحة بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء إضافة الصورة");
    }
};

//  تعديل صور تسريحة 
async function UpdateHairModelsImage(req, res) {
    const imageID = req.params.imageID;
    const { Src_Image, Service_ID } = req.body;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, imageID)
            .input('Src_Image', sql.VarChar, Src_Image)
            .input('Service_ID', sql.Int, Service_ID)
            .query(`
                UPDATE Service_Images
                SET 
                    Src_Image = @Src_Image,
                    Service_Type = 'Hair Model',
                    Service_ID = @Service_ID
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ الصورة غير موجودة");

        res.send("✔ تم تعديل الصورة بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء تعديل الصورة");
    }
};

//  حذف صور تسريحة
async function DeleteHairModelsImage(req, res) {
     const imageID = req.params.imageID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, imageID)
            .query(`
                DELETE FROM Service_Images
                WHERE ID = @ID AND Service_Type = 'Hair Model'
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ الصورة غير موجودة");

        res.send("✔ تم حذف صورة التسريحة بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء حذف الصورة");
    }
};

//  عرض صور التسريحات
async function ShowHairModelsImage(req, res) {
    const hairModelID = req.params.hairModelID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('HairModelID', sql.Int, hairModelID)
            .query(`
                SELECT 
                    ID,
                    Src_Image,
                    Service_Type,
                    Service_ID
                FROM Service_Images
                WHERE Service_ID = @HairModelID AND Service_Type = 'Hair Model'
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ حدث خطأ أثناء جلب صور التسريحة");
    }
};

//إضافة حذاء جديد
async function AddShoes(req, res) {
     const { Type, Color, Size, Price, Center_ID } = req.body;

    try {
        const pool = await connectDB();

        await pool.request()
            .input('Type', sql.VarChar, Type)
            .input('Color', sql.VarChar, Color)
            .input('Size', sql.Int, Size)
            .input('Price', sql.Money, Price)
            .input('Center_ID', sql.Int, Center_ID)
            .query(`
                INSERT INTO Shoes (Type, Color, Size, Price, Center_ID)
                VALUES (@Type, @Color, @Size, @Price, @Center_ID)
            `);

        res.send("✔ تم إضافة الحذاء بنجاح");

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء إضافة الحذاء");
    }
};

//تعديل حذاء
async function UpdateShoes(req, res) {
    const shoeID = req.params.shoeID;
    const { Type, Color, Size, Price, Center_ID } = req.body;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, shoeID)
            .input('Type', sql.VarChar, Type)
            .input('Color', sql.VarChar, Color)
            .input('Size', sql.Int, Size)
            .input('Price', sql.Money, Price)
            .input('Center_ID', sql.Int, Center_ID)
            .query(`
                UPDATE Shoes
                SET 
                    Type = @Type,
                    Color = @Color,
                    Size = @Size,
                    Price = @Price,
                    Center_ID = @Center_ID
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ لم يتم العثور على الحذاء");

        res.send("✔ تم تعديل بيانات الحذاء بنجاح");

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء تعديل الحذاء");
    }
};

//حذف حذاء
async function DeleteShoes(req, res) {
    const shoeID = req.params.shoeID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, shoeID)
            .query(`
                DELETE FROM Shoes
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ لم يتم العثور على هذا الحذاء");

        res.send("✔ تم حذف الحذاء بنجاح");

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء حذف الحذاء");
    }
};

//عرض الأحذية
async function ShowAllShoes(req, res) {
    try {
        const pool = await connectDB();

        const result = await pool.request()
            .query(`
                SELECT 
                    S.ID,
                    S.Type,
                    S.Color,
                    S.Size,
                    S.Price,
                    SC.Name AS Center_Name
                FROM Shoes S
                LEFT JOIN Service_Center SC ON S.Center_ID = SC.ID
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء جلب بيانات الأحذية");
    }
};

//عرض الأحذية لمركز معين
async function ShowAllShoesToServiceCenter(req, res) {
    const adminID = req.params.adminID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('AdminID', sql.Int, adminID)
            .query(`
                SELECT 
                    S.ID,
                    S.Type,
                    S.Color,
                    S.Size,
                    S.Price,
                    SC.Name AS Center_Name
                FROM Shoes S
                INNER JOIN Service_Center SC ON S.Center_ID = SC.ID
                WHERE  C.Center_ID = @CenterID
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء جلب الأحذية الخاصة بالأدمن");
    }

}

module.exports = {
    AddCar,
    UpdateCar,
    DeleteCar,
    ShowALLCar,
    ShowALLCarToServiceCenter,

    AddCarImage,
    UpdateCarImage,
    DeleteCarImage,
    ShowCarImage,

    AddFlower,
    UpdateFlower,
    DeleteFlower,
    ShowAllFlower,
    ShowAllFlowerToServiceCenter,

    AddFlowerImage,
    UpdateFlowerImage,
    DeleteFlowerImage,
    ShowFlowerImage,

    AddHairModels,
    UpdateHairModels,
    DeleteHairModels,
    ShowHairModels,
    ShowHairModelsToServiceCenter,

    AddHairModelsImage,
    UpdateHairModelsImage,
    DeleteHairModelsImage,
    ShowHairModelsImage,

    AddShoes,
    UpdateShoes,
    DeleteShoes,
    ShowAllShoes,
    ShowAllShoesToServiceCenter
};
