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
    const centerID = req.params.centerID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('CenterID', sql.Int, centerID)
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
                WHERE  SC.Center_ID = @CenterID
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء جلب الأحذية الخاصة بالأدمن");
    }

}

//  إضافة صور حذاء جديدة
async function AddShoesImage(req, res) {
 const { Src_Image, Service_ID } = req.body;

    try {
        const pool = await connectDB();

        await pool.request()
            .input('Src_Image', sql.VarChar, Src_Image)
            .input('Service_ID', sql.Int, Service_ID)
            .query(`
                INSERT INTO Service_Images (Src_Image, Service_Type, Service_ID)
                VALUES (@Src_Image, 'Shoes', @Service_ID)
            `);

        res.send("✔ تم إضافة صورة الحذاء بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء إضافة الصورة");
    }
};

//  تعديل صور حذاء 
async function UpdateShoesImage(req, res) {
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
                    Service_Type = 'Shoes',
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

//  حذف صور حذاء
async function DeleteShoesImage(req, res) {
     const imageID = req.params.imageID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, imageID)
            .query(`
                DELETE FROM Service_Images
                WHERE ID = @ID AND Service_Type = 'Shoes'
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ الصورة غير موجودة");

        res.send("✔ تم حذف صورة الحذاء بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء حذف الصورة");
    }
};

//  عرض صور الحذاء
async function ShowShoesImage(req, res) {
    const ShoesID = req.params.ShoesID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ShoesID', sql.Int, ShoesID)
            .query(`
                SELECT 
                    ID,
                    Src_Image,
                    Service_Type,
                    Service_ID
                FROM Service_Images
                WHERE Service_ID = @ShoesID AND Service_Type = 'Shoes'
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ حدث خطأ أثناء جلب صور الحذاء");
    }
};

//إضافة إكسسوار جديد
async function AddAccessories(req, res) {
    const { Type, Pieces, Price, Center_ID } = req.body;

    try {
        const pool = await connectDB();

        await pool.request()
            .input('Type', sql.VarChar, Type)
            .input('Pieces', sql.VarChar, Pieces)
            .input('Price', sql.Money, Price)
            .input('Center_ID', sql.Int, Center_ID)
            .query(`
                INSERT INTO Accessories (Type, Pieces, Price, Center_ID)
                VALUES (@Type, @Pieces, @Price, @Center_ID)
            `);

        res.send("✔ تمت إضافة الإكسسوار بنجاح");

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء إضافة الإكسسوار");
    }
};

//تعديل اكسسوار
async function UpdateAccessories(req, res) {
    const accessoryID = req.params.accessoryID;
    const { Type, Pieces, Price, Center_ID } = req.body;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, accessoryID)
            .input('Type', sql.VarChar, Type)
            .input('Pieces', sql.VarChar, Pieces)
            .input('Price', sql.Money, Price)
            .input('Center_ID', sql.Int, Center_ID)
            .query(`
                UPDATE Accessories
                SET Type = @Type,
                    Pieces = @Pieces,
                    Price = @Price,
                    Center_ID = @Center_ID
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ الإكسسوار غير موجود");

        res.send("✔ تم تعديل الإكسسوار بنجاح");

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء تعديل الإكسسوار");
    }
};

//حذف اكسسوار
async function DeleteAccessories(req, res) {
    const accessoryID = req.params.accessoryID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, accessoryID)
            .query(`
                DELETE FROM Accessories
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ الإكسسوار غير موجود");

        res.send("✔ تم حذف الإكسسوار");

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء حذف الإكسسوار");
    }
};

//عرض جميع الاكسسوارات
async function ShowAccessories(req, res) {
    try {
        const pool = await connectDB();

        const result = await pool.request()
            .query(`
                SELECT 
                    A.ID,
                    A.Type,
                    A.Pieces,
                    A.Price,
                    SC.Name AS Center_Name
                FROM Accessories A
                LEFT JOIN Service_Center SC ON A.Center_ID = SC.ID
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء جلب الإكسسوارات");
    }
};

//عرض جميع الاكسسوارات لمركز معين
async function ShowAccessoriesToServiceCenter(req, res) {
    const CenterID = req.params.CenterID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('CenterID', sql.Int, CenterID)
            .query(`
                SELECT 
                    A.ID,
                    A.Type,
                    A.Pieces,
                    A.Price,
                    SC.Name AS Center_Name
                FROM Accessories A
                INNER JOIN Service_Center SC ON A.Center_ID = SC.ID
                WHERE SC.Center_ID = @CenterID
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء جلب الإكسسوارات الخاصة بمركز");
    }
};

//  إضافة صور اكسسوار جديدة
async function AddAccessoriesImage(req, res) {
 const { Src_Image, Service_ID } = req.body;

    try {
        const pool = await connectDB();

        await pool.request()
            .input('Src_Image', sql.VarChar, Src_Image)
            .input('Service_ID', sql.Int, Service_ID)
            .query(`
                INSERT INTO Service_Images (Src_Image, Service_Type, Service_ID)
                VALUES (@Src_Image, 'Accessories', @Service_ID)
            `);

        res.send("✔ تم إضافة صورة الاكسسوار بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء إضافة الصورة");
    }
};

//  تعديل صور الاكسسوار 
async function UpdateAccessoriesImage(req, res) {
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
                    Service_Type = 'Accessories',
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

//  حذف صور الاكسسوار
async function DeleteAccessoriesImage(req, res) {
     const imageID = req.params.imageID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, imageID)
            .query(`
                DELETE FROM Service_Images
                WHERE ID = @ID AND Service_Type = 'Accessories'
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ الصورة غير موجودة");

        res.send("✔ تم حذف صورة الاكسسوار بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء حذف الصورة");
    }
};

//  عرض صور الاكسسوار
async function ShowAccessoriesImage(req, res) {
    const AccessoriesID = req.params.AccessoriesID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('AccessoriesID', sql.Int, AccessoriesID)
            .query(`
                SELECT 
                    ID,
                    Src_Image,
                    Service_Type,
                    Service_ID
                FROM Service_Images
                WHERE Service_ID = @AccessoriesID AND Service_Type = 'Accessories'
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ حدث خطأ أثناء جلب صور الاكسسوار");
    }
};

//إضافة فستان
async function AddDress(req, res) {
    const {
        Fabric_Type,
        Size,
        Rent,
        Buy,
        Rent_Price,
        Buy_Price,
        Color,
        Length,
        Center_ID
    } = req.body;

    try {
        const pool = await connectDB();

        await pool.request()
            .input('Fabric_Type', sql.VarChar, Fabric_Type)
            .input('Size', sql.Int, Size)
            .input('Rent', sql.Bit, Rent)
            .input('Buy', sql.Bit, Buy)
            .input('Rent_Price', sql.Money, Rent_Price)
            .input('Buy_Price', sql.Money, Buy_Price)
            .input('Color', sql.VarChar, Color)
            .input('Length', sql.Int, Length)
            .input('Center_ID', sql.Int, Center_ID)
            .query(`
                INSERT INTO Dress (
                    Fabric_Type, Size, Rent, Buy, Rent_Price,
                    Buy_Price, Color, Length, Center_ID
                ) VALUES (
                    @Fabric_Type, @Size, @Rent, @Buy, @Rent_Price,
                    @Buy_Price, @Color, @Length, @Center_ID
                )
            `);

        res.send("✔ تم إضافة الفستان بنجاح");

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء إضافة الفستان");
    }
};

// تعديل فستان
async function UpdateDress(req, res) {
    const dressID = req.params.dressID;

    const {
        Fabric_Type,
        Size,
        Rent,
        Buy,
        Rent_Price,
        Buy_Price,
        Color,
        Length,
        Center_ID
    } = req.body;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, dressID)
            .input('Fabric_Type', sql.VarChar, Fabric_Type)
            .input('Size', sql.Int, Size)
            .input('Rent', sql.Bit, Rent)
            .input('Buy', sql.Bit, Buy)
            .input('Rent_Price', sql.Money, Rent_Price)
            .input('Buy_Price', sql.Money, Buy_Price)
            .input('Color', sql.VarChar, Color)
            .input('Length', sql.Int, Length)
            .input('Center_ID', sql.Int, Center_ID)
            .query(`
                UPDATE Dress
                SET Fabric_Type = @Fabric_Type,
                    Size = @Size,
                    Rent = @Rent,
                    Buy = @Buy,
                    Rent_Price = @Rent_Price,
                    Buy_Price = @Buy_Price,
                    Color = @Color,
                    Length = @Length,
                    Center_ID = @Center_ID
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ الفستان غير موجود");

        res.send("✔ تم تعديل الفستان بنجاح");

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء تعديل الفستان");
    }
};

//حذف فستان
async function DeleteDress(req, res) {
    const dressID = req.params.dressID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, dressID)
            .query(`
                DELETE FROM Dress WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ الفستان غير موجود");

        res.send("✔ تم حذف الفستان");

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء حذف الفستان");
    }
};

//عرض جميع الفساتين
async function ShowDress(req, res) {
    try {
        const pool = await connectDB();

        const result = await pool.request().query(`
            SELECT
                D.ID,
                D.Fabric_Type,
                D.Size,
                D.Rent,
                D.Buy,
                D.Rent_Price,
                D.Buy_Price,
                D.Color,
                D.Length,
                SC.Name AS Center_Name
            FROM Dress D
            LEFT JOIN Service_Center SC ON D.Center_ID = SC.ID
        `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء جلب الفساتين");
    }
};

//عرض جميع الفساتين لمركز معين
async function ShowDressToServiceCenter(req, res) {
    const centerID = req.params.centerID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('CenterID', sql.Int, centerID)
            .query(`
                SELECT
                    D.ID,
                    D.Fabric_Type,
                    D.Size,
                    D.Rent,
                    D.Buy,
                    D.Rent_Price,
                    D.Buy_Price,
                    D.Color,
                    D.Length,
                    SC.Name AS Center_Name
                FROM Dress D
                INNER JOIN Service_Center SC ON D.Center_ID = SC.ID
                WHERE D.Center_ID = @CenterID
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء جلب فساتين المتجر");
    }
};

//  إضافة صور فستان جديدة
async function AddDressImage(req, res) {
 const { Src_Image, Service_ID } = req.body;

    try {
        const pool = await connectDB();

        await pool.request()
            .input('Src_Image', sql.VarChar, Src_Image)
            .input('Service_ID', sql.Int, Service_ID)
            .query(`
                INSERT INTO Service_Images (Src_Image, Service_Type, Service_ID)
                VALUES (@Src_Image, 'Dress', @Service_ID)
            `);

        res.send("✔ تم إضافة صورة فستان بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء إضافة الصورة");
    }
};

//  تعديل صور فستان 
async function UpdateDressImage(req, res) {
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
                    Service_Type = 'Dress',
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

//  حذف صور فستان
async function DeleteDressImage(req, res) {
     const imageID = req.params.imageID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, imageID)
            .query(`
                DELETE FROM Service_Images
                WHERE ID = @ID AND Service_Type = 'Dress'
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ الصورة غير موجودة");

        res.send("✔ تم حذف صورة فستان بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء حذف الصورة");
    }
};

//  عرض صور فستان
async function ShowDressImage(req, res) {
    const DressID = req.params.DressID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('DressID', sql.Int, DressID)
            .query(`
                SELECT 
                    ID,
                    Src_Image,
                    Service_Type,
                    Service_ID
                FROM Service_Images
                WHERE Service_ID = @DressID AND Service_Type = 'Dress'
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ حدث خطأ أثناء جلب صور الفستان");
    }
};

//إضافة فستان زفاف
async function AddWeddingDress(req, res) {
    const {
        Fabric_Type,
        Size,
        Type,
        Rent,
        Buy,
        Rent_Price,
        Buy_Price,
        Bridal_Veil_Length,
        Bridal_Veil_Fabric_Type,
        Center_ID
    } = req.body;

    try {
        const pool = await connectDB();

        await pool.request()
            .input("Fabric_Type", sql.VarChar, Fabric_Type)
            .input("Size", sql.Int, Size)
            .input("Type", sql.VarChar, Type)
            .input("Rent", sql.Bit, Rent)
            .input("Buy", sql.Bit, Buy)
            .input("Rent_Price", sql.Money, Rent_Price)
            .input("Buy_Price", sql.Money, Buy_Price)
            .input("Bridal_Veil_Length", sql.Int, Bridal_Veil_Length)
            .input("Bridal_Veil_Fabric_Type", sql.VarChar, Bridal_Veil_Fabric_Type)
            .input("Center_ID", sql.Int, Center_ID)
            .query(`
                INSERT INTO Wedding_Dress (
                    Fabric_Type, Size, Type, Rent, Buy,
                    Rent_Price, Buy_Price,
                    Bridal_Veil_Length, Bridal_Veil_Fabric_Type,
                    Center_ID
                ) VALUES (
                    @Fabric_Type, @Size, @Type, @Rent, @Buy,
                    @Rent_Price, @Buy_Price,
                    @Bridal_Veil_Length, @Bridal_Veil_Fabric_Type,
                    @Center_ID
                )
            `);

        res.send("✔ تم إضافة فستان الزفاف بنجاح");

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء إضافة فستان الزفاف");
    }
}

//تعديل فستان زفاف
async function UpdateWeddingDress(req, res) {
    const dressID = req.params.dressID;

    const {
        Fabric_Type,
        Size,
        Type,
        Rent,
        Buy,
        Rent_Price,
        Buy_Price,
        Bridal_Veil_Length,
        Bridal_Veil_Fabric_Type,
        Center_ID
    } = req.body;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input("ID", sql.Int, dressID)
            .input("Fabric_Type", sql.VarChar, Fabric_Type)
            .input("Size", sql.Int, Size)
            .input("Type", sql.VarChar, Type)
            .input("Rent", sql.Bit, Rent)
            .input("Buy", sql.Bit, Buy)
            .input("Rent_Price", sql.Money, Rent_Price)
            .input("Buy_Price", sql.Money, Buy_Price)
            .input("Bridal_Veil_Length", sql.Int, Bridal_Veil_Length)
            .input("Bridal_Veil_Fabric_Type", sql.VarChar, Bridal_Veil_Fabric_Type)
            .input("Center_ID", sql.Int, Center_ID)
            .query(`
                UPDATE Wedding_Dress
                SET 
                    Fabric_Type = @Fabric_Type,
                    Size = @Size,
                    Type = @Type,
                    Rent = @Rent,
                    Buy = @Buy,
                    Rent_Price = @Rent_Price,
                    Buy_Price = @Buy_Price,
                    Bridal_Veil_Length = @Bridal_Veil_Length,
                    Bridal_Veil_Fabric_Type = @Bridal_Veil_Fabric_Type,
                    Center_ID = @Center_ID
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ فستان الزفاف غير موجود");

        res.send("✔ تم تعديل فستان الزفاف بنجاح");

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء تعديل فستان الزفاف");
    }
}

//حذف فستان زفاف
async function DeleteWeddingDress(req, res) {
    const dressID = req.params.dressID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input("ID", sql.Int, dressID)
            .query(`DELETE FROM Wedding_Dress WHERE ID = @ID`);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ فستان الزفاف غير موجود");

        res.send("✔ تم حذف فستان الزفاف");

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء حذف فستان الزفاف");
    }
}

//عرض جميع فساتين الزفاف
async function ShowWeddingDress(req, res) {
    try {
        const pool = await connectDB();

        const result = await pool.request().query(`
            SELECT 
                W.ID,
                W.Fabric_Type,
                W.Size,
                W.Type,
                W.Rent,
                W.Buy,
                W.Rent_Price,
                W.Buy_Price,
                W.Bridal_Veil_Length,
                W.Bridal_Veil_Fabric_Type,
                SC.Name AS Center_Name
            FROM Wedding_Dress W
            LEFT JOIN Service_Center SC ON W.Center_ID = SC.ID
        `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء جلب فساتين الزفاف");
    }
}

//عرض جميع فساتين الزفاف لمركز معين
async function ShowWeddingDressToServiceCenter(req, res) {
    const centerID = req.params.centerID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input("CenterID", sql.Int, centerID)
            .query(`
                SELECT 
                    W.ID,
                    W.Fabric_Type,
                    W.Size,
                    W.Type,
                    W.Rent,
                    W.Buy,
                    W.Rent_Price,
                    W.Buy_Price,
                    W.Bridal_Veil_Length,
                    W.Bridal_Veil_Fabric_Type,
                    SC.Name AS Center_Name
                FROM Wedding_Dress W
                INNER JOIN Service_Center SC ON W.Center_ID = SC.ID
                WHERE W.Center_ID = @CenterID
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء جلب فساتين الزفاف الخاصة بالمتجر");
    }
}

//  إضافة صور فستان زفاف جديدة
async function AddWeddingDressImage(req, res) {
 const { Src_Image, Service_ID } = req.body;

    try {
        const pool = await connectDB();

        await pool.request()
            .input('Src_Image', sql.VarChar, Src_Image)
            .input('Service_ID', sql.Int, Service_ID)
            .query(`
                INSERT INTO Service_Images (Src_Image, Service_Type, Service_ID)
                VALUES (@Src_Image, 'Wedding Dress', @Service_ID)
            `);

        res.send("✔ تم إضافة صورة فستان زفاف بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء إضافة الصورة");
    }
};

//  تعديل صور فستان زفاف 
async function UpdateWeddingDressImage(req, res) {
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
                    Service_Type = 'Wedding Dress',
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

//  حذف صور فستان زفاف
async function DeleteWeddingDressImage(req, res) {
     const imageID = req.params.imageID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, imageID)
            .query(`
                DELETE FROM Service_Images
                WHERE ID = @ID AND Service_Type = 'Wedding Dress'
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ الصورة غير موجودة");

        res.send("✔ تم حذف صورة فستان بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء حذف الصورة");
    }
};

//  عرض صور فستان زفاف
async function ShowWeddingDressImage(req, res) {
    const DressID = req.params.DressID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('DressID', sql.Int, DressID)
            .query(`
                SELECT 
                    ID,
                    Src_Image,
                    Service_Type,
                    Service_ID
                FROM Service_Images
                WHERE Service_ID = @DressID AND Service_Type = 'Wedding Dress'
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ حدث خطأ أثناء جلب صور الفستان");
    }
};

//إضافة بدلة جديدة
async function AddWeddingSuit(req, res) {
    const {
        Fabric_Type,
        Type,
        Color,
        Price,
        Size,
        Center_ID
    } = req.body;

    try {
        const pool = await connectDB();

        await pool.request()
            .input("Fabric_Type", sql.VarChar, Fabric_Type)
            .input("Type", sql.VarChar, Type)
            .input("Color", sql.VarChar, Color)
            .input("Price", sql.Money, Price)
            .input("Size", sql.Int, Size)
            .input("Center_ID", sql.Int, Center_ID)
            .query(`
                INSERT INTO Wedding_Suit (
                    Fabric_Type, Type, Color, Price, Size, Center_ID
                ) VALUES (
                    @Fabric_Type, @Type, @Color, @Price, @Size, @Center_ID
                )
            `);

        res.send("✔ تم إضافة بدلة الزفاف بنجاح");

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء إضافة بدلة الزفاف");
    }
}

//تعديل بدلة الزفاف
async function UpdateWeddingSuit(req, res) {
    const suitID = req.params.suitID;

    const {
        Fabric_Type,
        Type,
        Color,
        Price,
        Size,
        Center_ID
    } = req.body;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input("ID", sql.Int, suitID)
            .input("Fabric_Type", sql.VarChar, Fabric_Type)
            .input("Type", sql.VarChar, Type)
            .input("Color", sql.VarChar, Color)
            .input("Price", sql.Money, Price)
            .input("Size", sql.Int, Size)
            .input("Center_ID", sql.Int, Center_ID)
            .query(`
                UPDATE Wedding_Suit
                SET 
                    Fabric_Type = @Fabric_Type,
                    Type = @Type,
                    Color = @Color,
                    Price = @Price,
                    Size = @Size,
                    Center_ID = @Center_ID
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ البدلة غير موجودة");

        res.send("✔ تم تعديل بدلة الزفاف بنجاح");

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء تعديل بدلة الزفاف");
    }
}

//حذف بدلة الزفاف
async function DeleteWeddingSuit(req, res) {
    const suitID = req.params.suitID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input("ID", sql.Int, suitID)
            .query(`
                DELETE FROM Wedding_Suit WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ البدلة غير موجودة");

        res.send("✔ تم حذف بدلة الزفاف");

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء حذف بدلة الزفاف");
    }
}

//عرض جميع بدلات الزفاف
async function ShowWeddingSuit(req, res) {
    try {
        const pool = await connectDB();

        const result = await pool.request().query(`
            SELECT
                WS.ID,
                WS.Fabric_Type,
                WS.Type,
                WS.Color,
                WS.Price,
                WS.Size,
                SC.Name AS Center_Name
            FROM Wedding_Suit WS
            LEFT JOIN Service_Center SC ON WS.Center_ID = SC.ID
        `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء جلب بدلات الزفاف");
    }
}

//عرض جميع بدلات الزفاف لمركز معين
async function ShowWeddingSuitToServiceCenter(req, res) {
    const centerID = req.params.centerID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input("CenterID", sql.Int, centerID)
            .query(`
                SELECT
                    WS.ID,
                    WS.Fabric_Type,
                    WS.Type,
                    WS.Color,
                    WS.Price,
                    WS.Size,
                    SC.Name AS Center_Name
                FROM Wedding_Suit WS
                INNER JOIN Service_Center SC ON WS.Center_ID = SC.ID
                WHERE WS.Center_ID = @CenterID
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء جلب بدلات الزفاف الخاصة بالمتجر");
    }
}

//  إضافة صور بدلة زفاف جديدة
async function AddWeddingSuitImage(req, res) {
 const { Src_Image, Service_ID } = req.body;

    try {
        const pool = await connectDB();

        await pool.request()
            .input('Src_Image', sql.VarChar, Src_Image)
            .input('Service_ID', sql.Int, Service_ID)
            .query(`
                INSERT INTO Service_Images (Src_Image, Service_Type, Service_ID)
                VALUES (@Src_Image, 'Wedding Suit', @Service_ID)
            `);

        res.send("✔ تم إضافة صورة بدلة زفاف بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء إضافة الصورة");
    }
};

//  تعديل صور بدلة زفاف 
async function UpdateWeddingSuitImage(req, res) {
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
                    Service_Type = 'Wedding Suit',
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

//  حذف صور بدلة زفاف
async function DeleteWeddingSuitImage(req, res) {
     const imageID = req.params.imageID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('ID', sql.Int, imageID)
            .query(`
                DELETE FROM Service_Images
                WHERE ID = @ID AND Service_Type = 'Wedding Suit'
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).send("❌ الصورة غير موجودة");

        res.send("✔ تم حذف صورة البدلة بنجاح");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ خطأ أثناء حذف الصورة");
    }
};

//  عرض صور بدلة زفاف
async function ShowWeddingSuitImage(req, res) {
    const SuitID = req.params.SuitID;

    try {
        const pool = await connectDB();

        const result = await pool.request()
            .input('SuitID', sql.Int, SuitID)
            .query(`
                SELECT 
                    ID,
                    Src_Image,
                    Service_Type,
                    Service_ID
                FROM Service_Images
                WHERE Service_ID = @SuitID AND Service_Type = 'Wedding Suit'
            `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ حدث خطأ أثناء جلب صور البدلة");
    }
};


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
    ShowAllShoesToServiceCenter,

    AddShoesImage,
    UpdateShoesImage,
    DeleteShoesImage,
    ShowShoesImage,

    AddAccessories,
    UpdateAccessories,
    DeleteAccessories,
    ShowAccessories,
    ShowAccessoriesToServiceCenter,

    AddAccessoriesImage,
    UpdateAccessoriesImage,
    DeleteAccessoriesImage,
    ShowAccessoriesImage,

    AddDress,
    UpdateDress,
    DeleteDress,
    ShowDress,
    ShowDressToServiceCenter,

    AddDressImage,
    UpdateDressImage,
    DeleteDressImage,
    ShowDressImage,

    AddWeddingDress,
    UpdateWeddingDress,
    DeleteWeddingDress,
    ShowWeddingDress,
    ShowWeddingDressToServiceCenter,

    AddWeddingDressImage,
    UpdateWeddingDressImage,
    DeleteWeddingDressImage,
    ShowWeddingDressImage,

    AddWeddingSuit,
    UpdateWeddingSuit,
    DeleteWeddingSuit,
    ShowWeddingSuit,
    ShowWeddingSuitToServiceCenter,

    AddWeddingSuitImage,
    UpdateWeddingSuitImage,
    DeleteWeddingSuitImage,
    ShowWeddingSuitImage
};
