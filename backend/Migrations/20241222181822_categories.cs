using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class Categories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuItems_CustomerConfigs_CustomerConfigDomain",
                table: "MenuItems");

            migrationBuilder.DropIndex(
                name: "IX_MenuItems_CustomerConfigDomain",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "CustomerConfigDomain",
                table: "MenuItems");

            migrationBuilder.AddColumn<int>(
                name: "MenuCategoryId",
                table: "MenuItems",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "MenuCategorys",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CustomerConfigDomain = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuCategorys", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MenuCategorys_CustomerConfigs_CustomerConfigDomain",
                        column: x => x.CustomerConfigDomain,
                        principalTable: "CustomerConfigs",
                        principalColumn: "Domain",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MenuItems_MenuCategoryId",
                table: "MenuItems",
                column: "MenuCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_MenuCategorys_CustomerConfigDomain",
                table: "MenuCategorys",
                column: "CustomerConfigDomain");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItems_MenuCategorys_MenuCategoryId",
                table: "MenuItems",
                column: "MenuCategoryId",
                principalTable: "MenuCategorys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.Sql(@"
                -- Insert a default category for each customer in CustomerConfigs
                INSERT INTO MenuCategorys (CustomerConfigDomain, Name)
                SELECT Domain, 'Default Category'
                FROM CustomerConfigs;

                -- Update MenuItems to reference the new default category
                UPDATE MenuItems
                SET MenuCategoryId = (
                    SELECT Id
                    FROM MenuCategorys
                    WHERE MenuCategorys.CustomerConfigDomain = (
                        SELECT CustomerConfigDomain
                        FROM CustomerConfigs
                        LIMIT 1 -- Adjust to match the appropriate logic for assigning domain
                    )
                );
            ");

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuItems_MenuCategorys_MenuCategoryId",
                table: "MenuItems");

            migrationBuilder.DropTable(
                name: "MenuCategorys");

            migrationBuilder.DropIndex(
                name: "IX_MenuItems_MenuCategoryId",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "MenuCategoryId",
                table: "MenuItems");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "MenuItems",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CustomerConfigDomain",
                table: "MenuItems",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_MenuItems_CustomerConfigDomain",
                table: "MenuItems",
                column: "CustomerConfigDomain");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItems_CustomerConfigs_CustomerConfigDomain",
                table: "MenuItems",
                column: "CustomerConfigDomain",
                principalTable: "CustomerConfigs",
                principalColumn: "Domain",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
