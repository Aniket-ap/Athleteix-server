import Category from "../models/category.js";
import slugify from "slugify"

export const create = async (req, res) => {
  try {
    const {name} = req.body;
    if(!name.trim()){
        return res.json({error: "Name is required"})
    }
    const existingCategory = await Category.findOne({name});
    if(existingCategory){
        return res.json({error: "Already existe"})
    }

    const caregory = await new Category({name, slug: slugify(name)}).save();
    res.json(caregory)

  } catch (error) {
    console.log(error);
    return res.status(401).json(err);
  }
};
