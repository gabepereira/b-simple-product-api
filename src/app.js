const express = require("express");

const filters = require("./database/filters.json");
const featuredProduct = require("./database/featuredProduct.json");
const products = require("./database/products.json");

const app = express();

app.get("/", async (req, res) => {
  res.status(200).json({ ok: true });
});

app.get("/filters", async (req, res) => {
  res.status(200).json(filters);
});

app.get("/featuredProduct", async (req, res) => {
  res.status(200).json(featuredProduct);
});

app.post("/products", async (req, res) => {
  try {
    const { selectedCategories, selectedPriceRange } = req.body;

    const { products } = data;

    const filterByCategory = (items) => {
      return items.filter(({ category }) =>
        selectedCategories.includes(category.id)
      );
    };

    const filterByPriceRange = (items) => {
      const selectedPriceMatchers = priceRangeMatchers.filter((matcher) =>
        selectedPriceRange.includes(matcher.id)
      );

      return items.filter(({ price }) => {
        const priceValue = Number(price);

        return selectedPriceMatchers.some(
          ({ min, max }) => priceValue > min && priceValue < max
        );
      });
    };

    if (selectedCategories.length && !selectedPriceRange.length) {
      return res.status(200).json({
        products: filterByCategory(products),
      });
    }

    if (selectedPriceRange.length && !selectedCategories.length) {
      return res.status(200).json({
        products: filterByPriceRange(products),
      });
    }

    if (selectedCategories.length && selectedPriceRange.length) {
      return res.status(200).json({
        products: filterByCategory(filterByPriceRange(products)),
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = app;
