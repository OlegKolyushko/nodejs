const { promises: fs } = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

async function imageminify(req,res,next) {
    try {
        const destination = path.join("public", "images");
        const {filename, path: tmpPath} = req.file;
        await imagemin([`tmp/${filename}`], {
            destination: destination,
            plugins: [
              imageminJpegtran(),
              imageminPngquant({
                quality: [0.6, 0.8],
              }),
            ],
          });
          await fs.unlink(tmpPath);
          req.file = {...req.file,
            path: path.join(destination, filename),
            destination
        };
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = imageminify;