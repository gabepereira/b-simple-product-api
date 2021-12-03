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
    const {
      selectedCategories,
      selectedPriceRange,
      selectedSortingOptions: [sortingOption = "price"],
      sortingOrder,
    } = req.body;

    console.log(sortingOption, sortingOrder);

    let { products } = data;

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

    // Filter by category
    if (selectedCategories.length && !selectedPriceRange.length) {
      products = filterByCategory(products);
    }

    // Filter by price range
    if (selectedPriceRange.length && !selectedCategories.length) {
      products = filterByPriceRange(products);
    }

    // Filter both
    if (selectedCategories.length && selectedPriceRange.length) {
      products = filterByCategory(filterByPriceRange(products));
    }

    // Sort by price
    if (sortingOption === "price") {
      products.sort((a, b) =>
        sortingOrder === "ASC"
          ? Number(a.price) < Number(b.price)
          : Number(a.price) > Number(b.price)
      );
    }

    // Sort by alphabet
    if (sortingOption === "alpha") {
      products.sort((a, b) =>
        sortingOrder === "ASC"
          ? a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          : b.name.toLowerCase().localeCompare(a.name.toLowerCase())
      );
    }

    res.status(200).json({
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

module.exports = app;
