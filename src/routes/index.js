const { Router } = require('express');
const router = Router();

const Photo = require('../models/Photo');
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const fs = require('fs-extra');

router.get('/', async (req, res)=>{
    const photos = await Photo.find().lean();
    res.render('images', {photos});
});

router.get('/images/add', async (req,res)=>{
    const photos = await Photo.find().lean();
    res.render('image_form', {photos});
});

router.post('/images/add', async (req, res)=>{
    const {title, description} = req.body;
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const newPhoto = new Photo({
        title,
        description,
        imageURL: result.secure_url,
        public_id: result.public_id
    })
    await newPhoto.save();
    fs.unlink(req.file.path);
    res.redirect('/');
});

router.post('/images/files', async (req,res)=>{
    const {file} = req.body;
    const result = cloudinary.v2.uploader.upload(file,{folder:'Coseinco/Pruebas/AlessandraPruebas'})
    res.status(200).json({
        status: 'success',
        msj: result
    });
});

router.get('/images/delete/:photo_id', async (req, res)=>{
    const {photo_id} = req.params;
    const photo = await Photo.findByIdAndDelete(photo_id);
    const result = cloudinary.v2.uploader.destroy(phpto.public_id);
    console.log(result);
    res.redirect('/images/add');
});

router.get('/images/saludos', async (req,res)=>{
    res.status(200).json({
        status: 'success',
        msj: 'Hola a todos :v'
    });
});



module.exports = router