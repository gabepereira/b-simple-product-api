const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const filters = require("./database/filters.json");
const featuredProduct = require("./database/featuredProduct.json");
const data = require("./database/products.json");

const priceRangeMatchers = require("./utils/priceRangeMatchers");

const app = express();

app.use(cors());
app.use(bodyParser({ extended: false }));

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
      console.log(selectedPriceMatchers);
      return items.filter(({ price }) => {
        const priceValue = Number(price);

        console.log(priceValue);

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
    console.log(error);
    res.status(400).json(error);
  }
});

module.exports = app;
