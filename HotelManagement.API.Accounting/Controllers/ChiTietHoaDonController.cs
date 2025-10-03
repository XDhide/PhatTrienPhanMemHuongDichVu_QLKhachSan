using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.API.Accounting.Controllers
{
    public class ChiTietHoaDonController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
