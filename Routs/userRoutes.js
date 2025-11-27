const express = require("express");
const { signIn,  register,  getAllUsers,} = require("../Controllers/userController");
const { AddLounge, UpdateLounge, InActiveLounge, SelectAllLounge, SelectAllLoungeToServiceAdmin, ShowLoungeImage, DeleteLoungeImage, UpdateLoungeImage, AddLoungeImage } = require("../Controllers/LoungeController");
const { AddCenterType, UpdateCenterType, InActiveCenterType, SelectCenterType, AddServiceCenter, UpdateServiceCenter, InactiveServiceCenter, SelectAllServiceCenter, SelectAllServiceCenterToServiceAdmin, AddServiceCenterImage, DeleteServiceCenterImage, UpdateServiceCenterImage, ShowServiceCenterImage } = require("../Controllers/CenterController");
const { AddCar, UpdateCar, ShowALLCar , AddCarImage, UpdateCarImage, DeleteCarImage, ShowCarImage, AddFlower, UpdateFlower, ShowAllFlower, ShowFlowerImage, DeleteFlowerImage, UpdateFlowerImage, AddFlowerImage, AddHairModels, UpdateHairModels, DeleteHairModels, ShowHairModels , DeleteFlower, DeleteCar, AddHairModelsImage, UpdateHairModelsImage, DeleteHairModelsImage, ShowHairModelsImage, ShowALLCarToServiceCenter, ShowAllFlowerToServiceCenter, ShowHairModelsToServiceCenter, AddShoes, UpdateShoes, DeleteShoes, ShowAllShoes , ShowAllShoesToServiceCenter, ShowShoesImage, DeleteShoesImage, UpdateShoesImage, AddShoesImage, AddAccessories, UpdateAccessories, DeleteAccessories, ShowAccessories, ShowAccessoriesToServiceCenter, AddAccessoriesImage, UpdateAccessoriesImage, DeleteAccessoriesImage, ShowAccessoriesImage, AddDressImage, UpdateDressImage, DeleteDressImage, ShowDressImage, AddWeddingDress, UpdateWeddingDress, DeleteWeddingDress, ShowWeddingDress, ShowWeddingDressToServiceCenter, AddWeddingDressImage, UpdateWeddingDressImage, DeleteWeddingDressImage, ShowWeddingDressImage, AddWeddingSuit, UpdateWeddingSuit, DeleteWeddingSuit, ShowWeddingSuit, ShowWeddingSuitToServiceCenter, AddWeddingSuitImage, UpdateWeddingSuitImage, DeleteWeddingSuitImage, ShowWeddingSuitImage } = require("../Controllers/ServiceController");

const router = express.Router();

// User Registration Route
router.post("/signin", signIn);
router.get("/getUsers", getAllUsers);
router.post("/register", register);

// Lounge Management Route
router.post("/AddLounge",AddLounge);
router.put("/UpdateLounge/:loungeID",UpdateLounge);
router.put("/DeleteLounge/:loungeID",InActiveLounge);
router.get("/SelectAllLounge",SelectAllLounge);
router.get("/SelectAllLoungeToServiceAdmin/:adminID",SelectAllLoungeToServiceAdmin);

//Lounge Image Management Route
router.post("/AddLoungeImage",AddLoungeImage);
router.put("/UpdateLoungeImage/:imageID",UpdateLoungeImage);
router.delete("/DeleteLoungeImage/:imageID",DeleteLoungeImage);
router.get("/ShowLoungeImage/:loungeID",ShowLoungeImage);

//Center Type Management Route
router.post("/AddCenterType",AddCenterType);
router.put("/UpdateCenterType/:typeID",UpdateCenterType);
router.put("/DeleteCenterType/:typeID",InActiveCenterType);
router.get("/SelectCenterType",SelectCenterType);

//Service Center Management Route
router.post("/AddServiceCenter",AddServiceCenter);
router.put("/UpdateServiceCenter/:centerID",UpdateServiceCenter);
router.put("/DeleteServiceCenter/:centerID",InactiveServiceCenter);
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
router.get("/ShowAllShoesToServiceCenter/:centerID",ShowAllShoesToServiceCenter);

//Shoes Image Management Route
router.post("/AddShoesImage",AddShoesImage);
router.put("/UpdateShoesImage/:imageID",UpdateShoesImage);
router.delete("/DeleteShoesImage/:imageID",DeleteShoesImage);
router.get("/ShowShoesImage/:ShoesID",ShowShoesImage);

//Accessories Management Route
router.post("/AddAccessories",AddAccessories);
router.put("/UpdateAccessories/:accessoryID",UpdateAccessories);
router.delete("/DeleteAccessories/:accessoryID",DeleteAccessories);
router.get("/ShowAccessories",ShowAccessories);
router.get("/ShowAccessoriesToServiceCenter/:CenterID",ShowAccessoriesToServiceCenter);

//Accessories Image Management Route
router.post("/AddAccessoriesImage",AddAccessoriesImage);
router.put("/UpdateAccessoriesImage/:imageID",UpdateAccessoriesImage);
router.delete("/DeleteAccessoriesImage/:imageID",DeleteAccessoriesImage);
router.get("/ShowAccessoriesImage/:AccessoriesID",ShowAccessoriesImage);

//Dress Management Route
router.post("/AddDress",AddDress);
router.put("/UpdateDress/:dressID",UpdateDress);
router.delete("/DeleteDress/:dressID",DeleteDress);
router.get("/ShowDress",ShowDress);
router.get("/ShowDressToServiceCenter/:centerID",ShowDressToServiceCenter);

//Dress Image Management Route
router.post("/AddDressImage",AddDressImage);
router.put("/UpdateDressImage/:imageID",UpdateDressImage);
router.delete("/DeleteDressImage/:imageID",DeleteDressImage);
router.get("/ShowDressImage/:DressID",ShowDressImage);

//Wedding Dress Management Route
router.post("/AddWeddingDress",AddWeddingDress);
router.put("/UpdateWeddingDress/:dressID",UpdateWeddingDress);
router.delete("/DeleteWeddingDress/:dressID",DeleteWeddingDress);
router.get("/ShowWeddingDress",ShowWeddingDress);
router.get("/ShowWeddingDressToServiceCenter/:centerID",ShowWeddingDressToServiceCenter);

//Wedding Dress Image Management Route
router.post("/AddWeddingDressImage",AddWeddingDressImage);
router.put("/UpdateWeddingDressImage/:imageID",UpdateWeddingDressImage);
router.delete("/DeleteWeddingDressImage/:imageID",DeleteWeddingDressImage);
router.get("/ShowWeddingDressImage/:DressID",ShowWeddingDressImage);

//Wedding Suit Management Route
router.post("/AddWeddingSuit",AddWeddingSuit);
router.put("/UpdateWeddingSuit/:suitID",UpdateWeddingSuit);
router.delete("/DeleteWeddingSuit/:suitID",DeleteWeddingSuit);
router.get("/ShowWeddingSuit",ShowWeddingSuit);
router.get("/ShowWeddingSuitToServiceCenter/:centerID",ShowWeddingSuitToServiceCenter);

//Wedding Suit Image Management Route
router.post("/AddWeddingSuitImage",AddWeddingSuitImage);
router.put("/UpdateWeddingSuitImage/:imageID",UpdateWeddingSuitImage);
router.delete("/DeleteWeddingSuitImage/:imageID",DeleteWeddingSuitImage);
router.get("/ShowWeddingSuitImage/:DressID",ShowWeddingSuitImage);


module.exports = router;
