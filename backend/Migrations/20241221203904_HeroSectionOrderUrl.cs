using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class HeroSectionOrderUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "HeroImage",
                table: "SiteSectionHeros",
                newName: "OrderUrl");

            migrationBuilder.AddColumn<string>(
                name: "Image",
                table: "SiteSectionHeros",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Image",
                table: "SiteSectionHeros");

            migrationBuilder.RenameColumn(
                name: "OrderUrl",
                table: "SiteSectionHeros",
                newName: "HeroImage");
        }
    }
}
