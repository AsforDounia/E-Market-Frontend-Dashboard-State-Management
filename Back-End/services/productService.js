import { ProductCategory, ProductImage } from "../models/Index.js";

/**
 * Récupère les catégories d'un produit
 * @param {String} productId - L'ID du produit
 * @returns {Promise<Array>} - Liste des catégories
 */
async function getProductCategories(productId) {
    const links = await ProductCategory.find({ product: productId }).populate({
        path: "category",
        strictPopulate: false,
    });

    return links.map((link) => link.category);
}

async function getProductImages(productId) {
    const images = await ProductImage.find({
        product: productId,
        deletedAt: null
    }).sort({ isPrimary: -1, createdAt: 1 });

    return images.map((img) => ({
        imageUrl: img.imageUrl,
        isPrimary: img.isPrimary
    }));
}

export { getProductCategories, getProductImages };
