import fs from "fs";
import path from "path";
import type { Request, Response, NextFunction } from "express";

const clearDirectoryMW = (req: Request, res: Response, next: NextFunction) => {
    const directory = path.join(__dirname, "../..", "/public/logo"); // Path to your images directory

    fs.readdir(directory, (err, files) => {
        if (err) {
            return next(err); // Pass the error to Express
        }

        Promise.all(
            files.map((file) => fs.promises.unlink(path.join(directory, file)))
        )
            .then(() => next()) // Proceed to the next middleware if successful
            .catch(next); // Pass any error that occurs to Express
    });
};

export default clearDirectoryMW;
