document.getElementById('image1').addEventListener('change',(e)=>{
    let img = e.target.files[0];
    let preview = document.getElementById('preview-img1');
    preview.src = URL.createObjectURL(img);
});

document.getElementById('image2').addEventListener('change',(e)=>{
    let img = e.target.files[0];
    let preview = document.getElementById('preview-img2');
    preview.src = URL.createObjectURL(img);
});
document.getElementById('image3').addEventListener('change',(e)=>{
    let img = e.target.files[0];
    let preview = document.getElementById('preview-img3');
    preview.src = URL.createObjectURL(img);
});
document.getElementById('image4').addEventListener('change',(e)=>{
    let img = e.target.files[0];
    let preview = document.getElementById('preview-img4');
    preview.src = URL.createObjectURL(img);
});

