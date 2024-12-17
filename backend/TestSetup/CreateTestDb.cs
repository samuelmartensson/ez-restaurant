using Microsoft.Data.Sqlite;

public static class CreateTestDb
{
    public static bool createTestDbWithData(string path)
    {
        string createCustomerTable = @"CREATE TABLE IF NOT EXISTS customer(
        id INTEGER PRIMARY KEY,
        subscription TEXT NOT NULL,
        contact_name TEXT NOT NULL,
        contact_email TEXT NOT NULL UNIQUE,
        register_date TEXT NOT NULL
        )";

        string insertCustomerData = @"INSERT INTO
        customer(
        subscription,
        contact_name,
        contact_email,
        register_date)
        VALUES(@subscription,@contact_name,@contact_email, @register_date)";

        string createCustomerConfTable = @"CREATE TABLE IF NOT EXISTS customer_config(
        customer_id INTEGER NOT NULL,
        domain TEXT NOT NULL UNIQUE,
        hero_type INT NOT NULL,
        theme TEXT NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customer(id)
        )";

        string createMenuItemsTable = @"CREATE TABLE IF NOT EXISTS menu_item(
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        description,
        tags,
        image,
        project_id TEXT NOT NULL,
        FOREIGN KEY (project_id) REFERENCES customer_config(domain)
        )";

        string insertMenuItemsData = @"INSERT INTO
        menu_item(
        name,
        price,
        category,
        description,
        tags,
        image,
        project_id)
        VALUES(@name,@price,@category,@description,@tags,@image,@project_id)";

        string getCustomerData = @"SELECT * FROM customer";
        string getMenuData = @"SELECT * FROM menu_item";

        string insertCustomerConfigurations = @"INSERT INTO
        customer_config(
        customer_id,
        domain,
        hero_type,
        theme)
        VALUES(@customer_id, @domain, @hero_type, @theme)";

        string[] tables = { createCustomerTable, createCustomerConfTable, createMenuItemsTable };

        try
        {
            using (var connection = new SqliteConnection(path))
            {

                connection.Open();
                foreach (string table in tables)
                {
                    using (var cmd = new SqliteCommand(table, connection))
                    {
                        cmd.ExecuteNonQuery();
                    };

                }
                connection.Close();

                connection.Open();
                try
                {

                    using (var cmd = new SqliteCommand(insertCustomerData, connection))
                    {
                        cmd.Parameters.AddWithValue("@subscription", "base");
                        cmd.Parameters.AddWithValue("@contact_name", "Namn Förnamn");
                        cmd.Parameters.AddWithValue("@contact_email", "test@test.com");
                        cmd.Parameters.AddWithValue("@register_date", "2024-02-03");
                        cmd.ExecuteNonQuery();

                        cmd.Parameters["@subscription"].Value = "premium";
                        cmd.Parameters["@contact_name"].Value = "Samuel Sås";
                        cmd.Parameters["@contact_email"].Value = "samuel@adflow.se";
                        cmd.Parameters["@register_date"].Value = "2024-12-13";
                        cmd.ExecuteNonQuery();

                        cmd.Parameters["@subscription"].Value = "vip";
                        cmd.Parameters["@contact_name"].Value = "Wilhelm Durr";
                        cmd.Parameters["@contact_email"].Value = "wilhelm@helptype.se";
                        cmd.Parameters["@register_date"].Value = "2024-05-01";
                        cmd.ExecuteNonQuery();
                    }
                }
                catch (SqliteException ex)
                {
                    Console.WriteLine(ex.Message);
                }

                connection.Close();
                connection.Open();

                using (var cmd = new SqliteCommand(createCustomerConfTable, connection))
                {
                    cmd.ExecuteNonQuery();
                };

                connection.Close();
                connection.Open();

                List<Customer> customers = new List<Customer>();

                using (var cmd = new SqliteCommand(getCustomerData, connection))
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var customer = new Customer(Convert.ToInt32(reader["id"].ToString()),
                            reader["subscription"],
                            reader["contact_name"],
                            reader["contact_email"],
                            reader["register_date"]);

                            customers.Add(customer);

                        }
                    }
                }
                string[] domains = ["tidochplats.se", "adflow.se", "burrito.com"];
                try
                {
                    using (var cmd = new SqliteCommand(insertCustomerConfigurations, connection))
                    {

                        int[] heroTypes = [1, 2, 1];
                        string[] themes = ["rustic", "modern", "rustic"];

                        for (int i = 0; i < customers.Count; i++)
                        {
                            cmd.Parameters.Clear();
                            cmd.Parameters.AddWithValue("@customer_id", customers[i].Id);
                            cmd.Parameters.AddWithValue("@domain", domains[i]);
                            cmd.Parameters.AddWithValue("@hero_type", heroTypes[i]);
                            cmd.Parameters.AddWithValue("@theme", themes[i]);
                            cmd.ExecuteNonQuery();

                        }
                    }
                }
                catch (SqliteException ex)
                {
                    Console.WriteLine(ex);
                }

                int menuItemCount = 0;
                using (var cmd = new SqliteCommand(getMenuData, connection))
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            menuItemCount++;
                        }
                    }
                }
                try
                {
                    if (menuItemCount > 0)
                    {

                    }
                    else
                    {
                        using (var cmd = new SqliteCommand(insertMenuItemsData, connection))
                        {
                            string[] names =
                            {
                            "Classic Cheeseburger",
                            "Margherita Pizza",
                            "Spaghetti Carbonara",
                            "Caesar Salad",
                            "BBQ Ribs"
                        };

                            decimal[] prices =
                            {
                            8.99m,
                            12.99m,
                            14.50m,
                            7.49m,
                            18.99m
                        };
                            string[] categories =
                            {
                            "Burger",
                            "Pizza",
                            "Pasta",
                            "Salad",
                            "Grill"
                        };

                            for (int j = 0; j < domains.Length; j++)
                            {
                                for (int i = 0; i < names.Length; i++)
                                {
                                    cmd.Parameters.Clear();
                                    cmd.Parameters.AddWithValue("@name", names[i]);
                                    cmd.Parameters.AddWithValue("@price", prices[i]);
                                    cmd.Parameters.AddWithValue("@category", categories[i]);
                                    cmd.Parameters.AddWithValue("@description", "");
                                    cmd.Parameters.AddWithValue("@tags", "");
                                    cmd.Parameters.AddWithValue("@image", "");
                                    cmd.Parameters.AddWithValue("@project_id", domains[j]);
                                    cmd.ExecuteNonQuery();
                                }
                            }
                        }
                    }



                }
                catch (SqliteException ex)
                {
                    Console.WriteLine(ex);
                }
            };
        }
        catch (SqliteException ex)
        {
            Console.WriteLine(ex.Message);
            return false;
        }
        return true;
    }
}