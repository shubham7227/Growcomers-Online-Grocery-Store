const mongoose = require("mongoose");
const productModel = require("../models/productModel");
const reviewModel = require("../models/reviewModel");
const { cloudinaryUpload } = require("../utils/cloudinary");
const fs = require("fs");
const ObjectId = mongoose.Types.ObjectId;

const addProduct = async (req, res) => {
  try {
    const {
      title,
      brand,
      category,
      price,
      MRP,
      quantity,
      feature,
      description,
    } = req.body;

    const files = req.files;

    if (files.length === 0) {
      res.status(402).json({ message: "Image is required" });
      return;
    }

    const newImageURLs = [];

    for (const file of files) {
      const { path } = file;
      const recevData = await cloudinaryUpload(path, "Products");
      newImageURLs.push(recevData.secure_url);
      fs.unlinkSync(path);
    }

    const newProduct = await productModel.create({
      title,
      brand,
      category,
      price,
      MRP,
      quantity,
      feature,
      description,
      imageURL: newImageURLs,
      imageURLHighRes: newImageURLs,
      mainCategory: "Grocery",
    });
    res.status(200).json({ data: newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchProduct = async (req, res) => {
  try {
    let { query, order } = req.query;
    let price = req.query.price;
    let categories = req.query.categories;
    let brands = req.query.brands;
    let page = req.query.page || 1;
    let limit = req.query.limit || 12;

    page = parseInt(page);
    limit = parseInt(limit);

    // To create a dynamic query based on request query fields
    const aggregateQuery = [];

    // If search query is provided
    if (query) {
      aggregateQuery.push({
        $search: {
          index: "searchIndex",
          text: {
            path: "title",
            // path: ["title", "Product"],
            query: query,
            fuzzy: {
              maxEdits: 1,
              maxExpansions: 100,
            },
          },
        },
      });
    }

    // Dynamic match filter based on request query
    const matchQuery = {};

    if (categories) {
      categories = categories.split(",");
      matchQuery["category"] = { $in: categories };
    } else {
      categories = [];
    }

    if (brands) {
      brands = brands.split(",");
      matchQuery["brand"] = { $in: brands };
    } else {
      brands = [];
    }

    // Calculate the minimum and maximum price after brand/category and search query filter are applied
    const minmaxPrice = await productModel.aggregate([
      ...aggregateQuery,
      {
        $group: {
          _id: null,
          maxPrice: { $max: "$price" },
          minPrice: { $min: "$price" },
        },
      },
    ]);

    const minPrice = Math.floor(minmaxPrice[0]?.minPrice || 0);
    const maxPrice = Math.ceil(minmaxPrice[0]?.maxPrice || 0);

    if (price) {
      price = price.split(",");
      const minPrice = parseInt(price[0]);
      const maxPrice = parseInt(price[1]);
      matchQuery["price"] = { $gte: minPrice, $lte: maxPrice };
    }

    aggregateQuery.push({ $match: matchQuery });

    // Get the total documents that matches all the above filters
    const countResults = await productModel.aggregate([
      ...aggregateQuery,
      {
        $count: "count",
      },
    ]);

    // If sortOrder is not provided then apply the limit early to get a faster result
    if (!order) {
      aggregateQuery.push({ $skip: (page - 1) * limit }, { $limit: limit });
    }

    // Projection and lookup
    aggregateQuery.push(
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "ProductID",
          as: "reviews",
        },
      },
      {
        $addFields: {
          imageUrl: {
            $first: "$imageURLHighRes",
          },
          category: {
            $first: "$category",
          },
          rating: {
            $avg: "$reviews.Rating",
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          brand: 1,
          price: { $round: ["$price", 2] },
          MRP: { $round: ["$MRP", 2] },
          imageUrl: 1,
          category: 1,
          rating: { $round: ["$rating", 1] },
          totalReviews: { $size: "$reviews" },
        },
      }
    );

    // SOrt order is provided then sort accordingly then limit
    if (order) {
      const sortOrder = JSON.parse(order);
      aggregateQuery.push(
        {
          $sort: { ...sortOrder, totalReviews: -1 },
        },
        { $skip: (page - 1) * limit },
        { $limit: limit }
      );
    }

    const products = await productModel.aggregate([...aggregateQuery]);

    res.status(200).json({
      data: products,
      page,
      limit,
      categories,
      brands,
      price: price ? price : [minPrice, maxPrice],
      totalResults: countResults[0]?.count || 0,
      priceRange: [minPrice, maxPrice],
      sortOrder: order,
      query,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const ProductData = await productModel.aggregate([
      {
        $match: {
          _id: id,
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "ProductID",
          as: "reviews",
        },
      },
      {
        $addFields: {
          rating: {
            $avg: "$reviews.Rating",
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          brand: 1,
          price: { $round: ["$price", 2] },
          MRP: { $round: ["$MRP", 2] },
          description: 1,
          feature: 1,
          imageURL: 1,
          imageURLHighRes: 1,
          mainCategory: 1,
          category: 1,
          quantity: 1,
          rating: { $round: ["$rating", 1] },
          totalReviews: { $size: "$reviews" },
        },
      },
    ]);

    if (ProductData.length === 0) {
      res.status(404).json({ message: "No product found" });
      return;
    }
    res.status(200).json({ data: ProductData[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const ProductData = await productModel.aggregate([
      {
        $match: {
          active: true,
        },
      },
      {
        $sample: { size: 5 },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "ProductID",
          as: "reviews",
        },
      },
      {
        $addFields: {
          imageUrl: {
            $first: "$imageURLHighRes",
          },
          category: {
            $first: "$category",
          },
          rating: {
            $avg: "$reviews.Rating",
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          brand: 1,
          price: { $round: ["$price", 2] },
          MRP: { $round: ["$MRP", 2] },
          imageUrl: 1,
          category: 1,
          rating: { $round: ["$rating", 1] },
        },
      },
    ]);
    res.status(200).json({ data: ProductData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bestSelling = async (req, res) => {
  try {
    const products = await reviewModel.aggregate([
      {
        $group: {
          _id: "$ProductID",
          count: { $count: {} },
          rating: { $avg: "$Rating" },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: "$productData",
      },
      {
        $addFields: {
          imageUrl: {
            $first: "$productData.imageURLHighRes",
          },
          category: {
            $first: "$productData.category",
          },
        },
      },
      {
        $project: {
          _id: "$productData._id",
          title: "$productData.title",
          brand: "$productData.brand",
          price: { $round: ["$productData.price", 2] },
          MRP: { $round: ["$productData.MRP", 2] },

          // price: { $round: ["$productData.price", 2] },
          // MRP: { $round: ["$productData.MRP", 2] },
          imageUrl: 1,
          category: 1,
          rating: { $round: ["$rating", 1] },
          count: 1,
        },
      },
    ]);
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    let sortOrder = req.query.sortOrder;

    let nameQuery = req.query.nameQuery;
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;

    page = parseInt(page);
    limit = parseInt(limit);
    const searchQuery = [];

    if (nameQuery) {
      searchQuery.push({
        $match: {
          title: new RegExp(nameQuery, "i"),
        },
      });
    }

    const sortQueryAgg = [];
    if (sortOrder) {
      const _sortOrder = JSON.parse(sortOrder);
      sortQueryAgg.push({
        $sort: { ..._sortOrder },
      });
    }

    const productsData = await productModel.aggregate([
      ...searchQuery,
      {
        $match: { active: true },
      },
      {
        $addFields: {
          imageUrl: {
            $first: "$imageURLHighRes",
          },
          category: {
            $first: "$category",
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          imageUrl: 1,
          category: 1,
          brand: 1,
          quantity: 1,
          price: 1,
        },
      },
      ...sortQueryAgg,
      {
        $facet: {
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          totalCount: [
            {
              $count: "total",
            },
          ],
        },
      },
    ]);

    const allProductsData = productsData[0].data;
    const totalProducts = productsData[0].totalCount[0];

    res.status(200).json({
      data: allProductsData,
      totalProducts: totalProducts?.total || 0,
      currentPage: page,
      limit: limit,
      nameQuery: nameQuery,
      sortOrder: sortOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      title,
      brand,
      category,
      price,
      MRP,
      quantity,
      feature,
      description,
      imageURLHighRes,
    } = req.body;
    const files = req.files;

    if (
      files.length === 0 &&
      (!imageURLHighRes || imageURLHighRes.length === 0)
    ) {
      res.status(402).json({ message: "Image is required" });
      return;
    }

    const newImageURLs = [];

    for (const file of files) {
      const { path } = file;
      const recevData = await cloudinaryUpload(path, "Products");
      newImageURLs.push(recevData.secure_url);
      fs.unlinkSync(path);
    }
    newImageURLs.push(...imageURLHighRes);

    const toUpdateData = await productModel.findById(id);

    toUpdateData.title = title || toUpdateData.title;
    toUpdateData.brand = brand || toUpdateData.brand;
    toUpdateData.category = category || toUpdateData.category;
    toUpdateData.price = price || toUpdateData.price;
    toUpdateData.MRP = MRP || toUpdateData.MRP;
    toUpdateData.quantity = quantity || toUpdateData.quantity;
    toUpdateData.feature = feature || toUpdateData.feature;
    toUpdateData.description = description || toUpdateData.description;
    toUpdateData.imageURL = newImageURLs || toUpdateData.imageURL;
    toUpdateData.imageURLHighRes = newImageURLs || toUpdateData.imageURLHighRes;

    const updatedData = await toUpdateData.save();
    res.status(200).json({ data: updatedData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await productModel.findByIdAndUpdate(id, { active: false });
    res.status(200).json({ id: id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addProduct,
  searchProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  bestSelling,
};
