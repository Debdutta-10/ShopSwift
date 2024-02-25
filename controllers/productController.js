import productModel from "../models/productModel.js";
import fs from 'fs/promises'; // Use fs promises for async file reading
import slugify from 'slugify';

export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        // Validation
        switch (true) {
            case !name:
                return res.status(400).send({ error: "Name is required" });
            case !description:
                return res.status(400).send({ error: "Description is required" });
            case !price:
                return res.status(400).send({ error: "Price is required" });
            case !category:
                return res.status(400).send({ error: "Category is required" });
            case !quantity:
                return res.status(400).send({ error: "Quantity is required" });
            case photo && photo.size > 2500000:
                return res.status(400).send({ error: "Photo size must be less than 2.5MB" });
        }

        const product = new productModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
            product.photo.data = await fs.readFile(photo.path);
            product.photo.contentType = photo.type;
        }
        await product.save();
        res.status(201).send({
            success: true,
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error: error.message,
            message: "Error in creating product",
        });
    }
};

//get all products
export const getProductController = async (req, res) => {
    try {
        const products = await productModel
            .find({})
            .populate("category")
            .select("-photo")
            .limit(12)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            countTotal: products.length,
            message: "All products",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting products",
            error: error.message,
        });
    }
};


export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug })
            .select("-photo")
            .populate("category");

        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Single product fetched",
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting product",
            error: error.message,
        });
    }
};

export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Erorr while getting photo",
            error,
        });
    }
};

export const deleteProductController = async (req, res) => {
    try {
        
        const deletedProduct = await productModel.findByIdAndDelete(req.params.pid);

        if (!deletedProduct) {
            return res.status(404).send({
                success: false,
                message: "Product not found and not deleted",
            });
        }

        res.status(200).send({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while deleting product",
            error: error.message, 
        });
    }
};

export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        // Validation
        switch (true) {
            case !name:
                return res.status(400).send({ error: "Name is required" });
            case !description:
                return res.status(400).send({ error: "Description is required" });
            case !price:
                return res.status(400).send({ error: "Price is required" });
            case !category:
                return res.status(400).send({ error: "Category is required" });
            case !quantity:
                return res.status(400).send({ error: "Quantity is required" });
            case photo && photo.size > 2500000:
                return res.status(400).send({ error: "Photo is required and should be less than 2.5MB" });
        }

        let updateData = { ...req.fields, slug: slugify(name) };

        const product = await productModel.findById(req.params.pid);
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }

        if (photo) {
            const photoData = await fs.readFile(photo.path);
            const contentType = photo.type;
            updateData.photo = { data: photoData, contentType };
        }

        const updatedProduct = await productModel.findByIdAndUpdate(req.params.pid, updateData, { new: true });

        res.status(200).send({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.log(`Error updating product: ${error.message}`);
        res.status(500).send({
            success: false,
            message: "Error in updating product",
            error: error.message,
        });
    }
};
