import fs from "fs";
import path from "path";
import type { Request, Response, NextFunction } from "express";

// this function is used to retrieve logo file in public/logo directory, and send it to client
const findLogoMW = (req: Request, res: Response, next: NextFunction) => {
    const directory = path.join(__dirname, "../..", "/public/logo"); // Path to your images directory

    fs.readdir(directory, (err, files) => {
        if (err) {
            return next(err); // Pass the error to Express
        }

        if (err) {
            return next(err);
        }

        if (files.length === 0) {
            return next({ err: "No files found" });
        }
        req.body.logoFile = files;
        next();
    });
};

export default findLogoMW;
