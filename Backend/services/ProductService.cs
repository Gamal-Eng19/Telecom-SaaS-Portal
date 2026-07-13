using System.Collections.Generic;
using System.Linq;
using Backend.Models;

namespace Backend.services
{
	public class ProductService
	{
		private readonly List<Product> _products;

		public ProductService()
		{
			_products = new List<Product>();
		}
	//search bar
		public List<Product> SearchProducts(string keyword)
		{
			return _products
				.Where(p => p.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase))
				.ToList();
		}
		public void AddProduct(Product product)
		{
			_products.Add(product);
		}

		
		public List<Product> GetAllProducts()
		{
			return _products;
		}

		public Product GetProductById(int id)
		{
			return _products.FirstOrDefault(p => p.Id == id);
		}

		
		public void UpdateProduct(Product product)
		{
			var existing = GetProductById(product.Id);
			if (existing != null)
			{
				existing.Name = product.Name;
				existing.Price = product.Price;
				existing.Description = product.Description;
			}
		}

		public void DeleteProduct(int id)
		{
			var product = GetProductById(id);
			if (product != null)
			{
				_products.Remove(product);
			}
		}
	}
}
