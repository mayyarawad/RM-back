const express = require("express");
const {
  signIn,
  register,
  getAllUsers,
} = require("../Controllers/userController");

const { AddCenterType, UpdateCenterType, InActiveCenterType, SelectCenterType, AddServiceCenter, UpdateServiceCenter, InactiveServiceCenter, SelectAllServiceCenter, SelectAllServiceCenterToServiceAdmin, AddServiceCenterImage, DeleteServiceCenterImage, UpdateServiceCenterImage, ShowServiceCenterImage } = require("../Controllers/CenterController");
const { AddCar, UpdateCar, ShowALLCar , AddCarImage, UpdateCarImage, DeleteCarImage, ShowCarImage, AddFlower, UpdateFlower, ShowAllFlower, ShowFlowerImage, DeleteFlowerImage, UpdateFlowerImage, AddFlowerImage, AddHairModels, UpdateHairModels, DeleteHairModels, ShowHairModels , DeleteFlower, DeleteCar, AddHairModelsImage, UpdateHairModelsImage, DeleteHairModelsImage, ShowHairModelsImage, ShowALLCarToServiceCenter, ShowAllFlowerToServiceCenter, ShowHairModelsToServiceCenter, AddShoes, UpdateShoes, DeleteShoes, ShowAllShoes , ShowAllShoesToServiceCenter } = require("../Controllers/ServiceController");

const router = express.Router();

// User Registration Route
router.post("/signin", signIn);
router.get("/getUsers", getAllUsers);
router.post("/register", register);


//Center Type Management Route
router.post("/AddCenterType",AddCenterType);
router.put("/UpdateCenterType/:typeID",UpdateCenterType);
router.put("/InActiveCenterType/:typeID",InActiveCenterType);
router.get("/SelectCenterType",SelectCenterType);

//Service Center Management Route
router.post("/AddServiceCenter",AddServiceCenter);
router.put("/UpdateServiceCenter/:centerID",UpdateServiceCenter);
router.put("/InactiveServiceCenter/:centerID",InactiveServiceCenter);
router.get("/SelectAllServiceCenter",SelectAllServiceCenter);
router.get("/SelectAllServiceCenterToServiceAdmin/:adminID",SelectAllServiceCenterToServiceAdmin);

//Service Center Image Management Route
router.post("/AddServiceCenterImage",AddServiceCenterImage);
router.put("/UpdateServiceCenterImage/:imageID",UpdateServiceCenterImage);
router.delete("/DeleteServiceCenterImage/:imageID",DeleteServiceCenterImage);
router.get("/ShowServiceCenterImage/:centerID",ShowServiceCenterImage);

//Car Management Route
router.post("/AddCar",AddCar);
router.put("/UpdateCar/:carID",UpdateCar);
router.delete("/DeleteCar/:carID",DeleteCar);
router.get("/ShowALLCar",ShowALLCar);
router.get("/ShowALLCarToServiceCenter/:centerID",ShowALLCarToServiceCenter);

//Car Image Management Route
router.post("/AddCarImage",AddCarImage);
router.put("/UpdateCarImage/:imageID",UpdateCarImage);
router.delete("/DeleteCarImage/:imageID",DeleteCarImage);
router.get("/ShowCarImage/:carID",ShowCarImage);

//Flower Management Route
router.post("/AddFlower",AddFlower);
router.put("/UpdateFlower/:flowerID",UpdateFlower);
router.delete("/DeleteFlower/:flowerID",DeleteFlower);
router.get("/ShowAllFlower",ShowAllFlower);
router.get("/ShowAllFlowerToServiceCenter/:centerID",ShowAllFlowerToServiceCenter);

//Flower Image Management Route
router.post("/AddFlowerImage",AddFlowerImage);
router.put("/UpdateFlowerImage/:imageID",UpdateFlowerImage);
router.delete("/DeleteFlowerImage/:imageID",DeleteFlowerImage);
router.get("/ShowFlowerImage/:flowerID",ShowFlowerImage);

//Hair Models Management Route
router.post("/AddHairModels",AddHairModels);
router.put("/UpdateHairModels/:hairID",UpdateHairModels);
router.delete("/DeleteHairModels/:hairID",DeleteHairModels);
router.get("/ShowHairModels",ShowHairModels);
router.get("/ShowHairModelsToServiceCenter/:centerID",ShowHairModelsToServiceCenter);

//Hair Models Image Management Route
router.post("/AddHairModelsImage",AddHairModelsImage);
router.put("/UpdateHairModelsImage/:imageID",UpdateHairModelsImage);
router.delete("/DeleteHairModelsImage/:imageID",DeleteHairModelsImage);
router.get("/ShowHairModelsImage/:hairModelID",ShowHairModelsImage);

//Shoes Management Route
router.post("/AddShoes",AddShoes);
router.put("/UpdateShoes/:shoeID",UpdateShoes);
router.delete("/DeleteShoes/:shoeID",DeleteShoes);
router.get("/ShowAllShoes",ShowAllShoes);
router.get("/ShowAllShoesToServiceCenter/:adminID",ShowAllShoesToServiceCenter);



module.exports = router;
