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

router.get('/category-list',adminController.categoryList);

router.get('/category-add',adminController.categoryAddLoad);

router.post('/category-add',adminController.categoryAdd);

router.get('/category-edit/:id',adminController.categoryEditLoad);

router.put('/category-edit/:id',adminController.categoryEdit);  

router.delete('/category-delete/:id',adminController.categoryDelete);

router.get("/user-list",adminController.userList);


module.exports = router;