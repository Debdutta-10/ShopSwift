import categoryModel from '../models/categoryModel.js';
import slugify from 'slugify';
import userModel from '../models/userModel.js';

export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({ message: "Name required" });
        }
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(401).send({ 
                success: true,
                message: "Category already exists",
            });
        }
        const slug = slugify(name, { lower: true, strict: true }); 
        const category = await new categoryModel({ name, slug }).save();
        res.status(201).send({
            success: true,
            message: 'New category created',
            category,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in creating category",
            error: error.message,
        });
    }
};

export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body; 
        const { id } = req.params; 

        if (!name) {
            return res.status(400).send({ message: "Name required for update." });
        }

        const slug = slugify(name, { lower: true, strict: true });
        const updatedCategory = await categoryModel.findByIdAndUpdate(
            id,
            { name, slug },
            { new: true } 
        );

        if (!updatedCategory) {
            return res.status(404).send({ success: false, message: "Category not found." });
        }

        res.status(200).send({
            success: true,
            message: "Category updated successfully.",
            category: updatedCategory,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error updating category",
            error: error.message,
        });
    }
};

export const categoryController = async(req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.send({
            message: "Categories retrieved successfully",
            success: true,
            categories,
        });
    } catch (error) {
        console.error(error); 
        res.status(500).send({ 
            error: error.message, 
            message: 'Error in retrieving categories',
            success: false,
        });
    }
};

export const singlecategoryController = async(req, res) => {
    try {
        const category = await categoryModel.findOne({slug:req.params.slug});
        res.send({
            message: "Category retrieved successfully",
            success: true,
            category,
        });
    } catch (error) {
        console.error(error); 
        res.status(500).send({ 
            error: error.message, 
            message: 'Error in retrieving categories',
            success: false,
        });
    }
};

export const deletecategoryController = async(req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).send({
                message: "Category not found",
                success: false,
            });
        }
        res.send({
            message: "Category deleted successfully",
            success: true,
            category, 
        });
    } catch (error) {
        console.error(error); 
        res.status(500).send({ 
            error: error.message, 
            message: 'Error in deleting category',
            success: false,
        });
    }
};
