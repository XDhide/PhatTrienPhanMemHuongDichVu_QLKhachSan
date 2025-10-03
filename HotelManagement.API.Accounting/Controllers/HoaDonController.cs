using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.API.Accounting.Controllers
{
    public class HoaDonController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
