import Product from "../models/product.js";
import slugify from "slugify";
import fs from "fs";

export const create = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name.trim():
        return res.json({ error: "Name is required" });
      case !description.trim():
        return res.json({ error: "Description is required" });
      case !price.trim():
        return res.json({ error: "Price is required" });
      case !category.trim():
        return res.json({ error: "Category is required" });
      case !quantity.trim():
        return res.json({ error: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res.json({ error: "Image should be less than 1mb in size" });
    }

    const product = new Product({ ...req.fields, slug: slugify(name) });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.log(err);
    return res.status(401).json(err);
  }
};

export const list = async (req, res) => {
    try {
        const products = await Product.find({}).populate('category').select("-photo").limit(12).sort({createdAt: -1})
        res.json(products)

    } catch (err) {
        console.log(err)
    }
}

export const read = async (req, res) => {
    try {
        const products = await Product.findOne({slug: req.params.slug}).populate("category").select('-photo')
        res.json(products)
    } catch (err) {
        console.log(err)
    }
}

export const photo = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId).select("photo");
        if(product.photo.data){
            res.set('Content-Type', product.photo.contentType)
            return res.send(product.photo.data)
        }
    } catch (err) {
        console.log(err)
    }
}

export const remove = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.productId).select("-photo")
        res.json(product)
    } catch (err) {
        console.log(err)
    }
}

export const update = async (req, res) => {
    try {
      const { name, description, price, category, quantity, shipping } =
        req.fields;
      const { photo } = req.files;
  
      switch (true) {
        case !name.trim():
          res.json({ error: "Name is required" });
        case !description.trim():
          res.json({ error: "Description is required" });
        case !price.trim():
          res.json({ error: "Price is required" });
        case !category.trim():
          res.json({ error: "Category is required" });
        case !quantity.trim():
          res.json({ error: "Quantity is required" });
        case photo && photo.size > 1000000:
          res.json({ error: "Image should be less than 1mb in size" });
      }
  
      const product = await Product.findByIdAndUpdate(req.params.productId, {
        ...req.fields,
        slug: slugify(name),
      }, {new: true});
      
      if (photo) {
        product.photo.data = fs.readFileSync(photo.path);
        product.photo.contentType = photo.type;
      }
  
      await product.save();
      res.json(product);
    } catch (err) {
      console.log(err);
      return res.status(401).json(err);
    }
  };

  export const filteredProducts = async (req, res) =>{
    try {
      const {checked, radio} = req.body;

      let args = {}
      if(checked.length > 0){
        args.category = checked;
      }
      if(radio.length > 0){
        args.price = { $gte: radio[0], $lte: radio[1] };
      }

      console.log(args)

      const products = await Product.find(args)
      res.json(products)

    } catch (error) {
      console.log(error)
    }
  }

  export const productsCount = async (req, res) => {
    try {
      const total = await Product.find({}).estimatedDocumentCount();
      res.json(total)
    } catch (error) {
      console.log(error)
    }
  }

  export const listProducts = async (req, res) => {
    try {
      const perPage = 6;
      const page = req.params.page ? req.params.page: 1;
      const products = await Product.find({}).select('-photo').skip((page - 1) * perPage).limit(perPage).sort({createdAt: -1}) 
      res.json(products)
    } catch (error) {
      console.log(error)
    }
  }

  export const productSearch = async (req, res) => {
    try {
      const {keyword} = req.params;
      const results = await Product.find({
        $or : [
          {name: {$regex: keyword, $options: "i"}}
        ]
      }).select("-photo");

      res.json(results)
    } catch (error) {
      console.log(error)
    }
  }
