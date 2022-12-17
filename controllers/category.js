import Category from "../models/category.js";
import slugify from "slugify";

export const create = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name.trim()) {
      return res.json({ error: "Name is required" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.json({ error: "Already existe" });
    }

    const caregory = await new Category({ name, slug: slugify(name) }).save();
    res.json(caregory);
  } catch (err) {
    console.log(err);
    return res.status(401).json(err);
  }
};

export const update = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.categoryId,
      {
        name,
        slug: slugify(name),
      },
      { new: true }
    );
    res.json(category);
  } catch (err) {
    console.log(err);
    return res.status(401).json(err.message);
  }
};

export const remove = async (req, res) => {
  try {
    const removed = await Category.findByIdAndDelete(req.params.categoryId);
    res.json(removed);
  } catch (err) {
    console.log(err);
    return res.status(401).json(err.message);
  }
};

export const list = async (req, res) => {
  try {
    const all = await Category.find({});
    res.json(all);
  } catch (err) {
    console.log(err);
    return res.status(401).json(err.message);
  }
};

export const read = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    return res.json(category);
  } catch (err) {
    console.log(err);
    return res.status(401).json(err.message);
  }
};
