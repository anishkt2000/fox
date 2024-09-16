const Router =require('express');

const router = Router();

router.post("/login",loginController);
router.post("/addUser", addUserController);
router.patch("/updateUser/:id", updateUserController);
router.delete("/deleteUser/:id", deleteUserController);
router.get("/getAllUser", getAllUserController);
router.get("/getUserInfo/:id", getUserController);
router.get("/getAllDocs",getAllDocsController);


export default router;