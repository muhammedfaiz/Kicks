const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const middleware = require('../middlewares/adminMiddleware');


router.get('/',middleware.notLogin,adminController.loginLoad);

router.post('/',adminController.loginSubmit);

router.get('/dashboard',middleware.isLogin,adminController.dashboardLoad);

router.get('/logout',adminController.adminLogout);

router.get('/product-list',adminController.productList);

router.get('/product-add',adminController.productAddLoad);

router.post('/product-add',middleware.upload.array("images"),adminController.productAdd);

router.patch('/product-status/:id',adminController.productStatusHandle);

router.get('/product-edit/:id',adminController.productEditHandler);

router.put('/product-edit/:id',middleware.upload.array('images'),adminController.productEdit);

router.delete('/product-delete/:id',adminController.productDeletion);

router.get('/category-list',adminController.categoryList);

router.get('/category-add',adminController.categoryAddLoad);

router.post('/category-add',adminController.categoryAdd);

router.get('/category-edit/:id',adminController.categoryEditLoad);

router.put('/category-edit/:id',adminController.categoryEdit);  

router.patch('/category-remove/:id',adminController.categoryRemove);

router.get("/user-list",adminController.userList);

router.patch('/user-status/:id',adminController.userStatus);


module.exports = router;