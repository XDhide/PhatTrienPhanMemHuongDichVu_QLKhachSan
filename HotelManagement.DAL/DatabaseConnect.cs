using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;


namespace DAL
{
    public class DatabaseConnect
    {
        private static string query = @"Data Source=DESKTOP-3GIS5H1\SQLEXPRESS;Initial Catalog=QLKhachSan;Integrated Security=True;Trust Server Certificate=True";
        

        public static SqlConnection Conn { get { return conn; } }

        private static SqlConnection conn = new SqlConnection(query);
        public static string OpenDatabase()
        {
            if(conn.State == System.Data.ConnectionState.Closed)
            {
                try
                {
                    conn.Open();
                }
                catch
                {
                    return "Ket Noi That Bai";
                }
                return "Ket Noi Thanh Cong";
                
            }
            return "Ket Noi Da Duoc Mo";
        }
        public static string CloseDatabase()
        {
            if (conn.State == System.Data.ConnectionState.Open)
            {
                try
                {
                    conn.Close();
                    return "Dong Thanh Cong";
                }
                catch
                {
                    return "Dong That Bai";
                }

            }
            return "Ket Noi Da Duoc Dong";
        }

    }
    public class OtherSystem
    {
        private static DateTime now ;
        public static string Createcode(string table)
        {
            now = DateTime.Now;
            string formattedTime = now.ToString("yyMMddHHmmss");
            return table + formattedTime+ Randomcode();
        }
        public static string GetDate()
        {
            now = DateTime.Now;
            string formattedDate = now.ToString("yyyy-MM-dd");
            return formattedDate;
        }
        private static char Randomcode()
        {
            Random random = new Random();
            char randomChar;

            while (true)
            {
                int randomNumber = random.Next(49, 123);
                randomChar = (char)randomNumber;

                if ((randomChar >= '1' && randomChar <= '9') || (randomChar >= 'a' && randomChar <= 'z'))
                {
                    break; 
                }
            }
            return randomChar;
        }
    }
}
