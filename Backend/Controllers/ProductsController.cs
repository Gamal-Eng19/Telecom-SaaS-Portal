using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TelecomProject.services; // مسار الـ Service
using TelecomProject.DTOs;

namespace TelecomProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _productService;

        // بنعمل Inject للـ Service مش للـ DbContext
        public ProductsController(ProductService productService)
        {
            _productService = productService;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string keyword)
        {
            var results = await _productService.SearchProductsAsync(keyword);
            return Ok(results);
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _productService.GetAllProductsAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null) return NotFound(new { message = "Product not found" });
            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] ProductCreateDto dto)
        {
            var product = await _productService.CreateProductAsync(dto);
            return Ok(product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductCreateDto dto)
        {
            var product = await _productService.UpdateProductAsync(id, dto);
            if (product == null) return NotFound(new { message = "Product not found" });
            return Ok(product);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var success = await _productService.DeleteProductAsync(id);
            if (!success) return NotFound(new { message = "Product not found" });
            return Ok(new { message = "Product Deleted" });
        }
    }
}