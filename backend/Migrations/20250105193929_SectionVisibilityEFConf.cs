using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class SectionVisibilityEFConf : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SectionVisibility",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ContactFormVisible = table.Column<bool>(type: "INTEGER", nullable: false),
                    CustomerConfigDomain = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SectionVisibility", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SectionVisibility_CustomerConfigs_CustomerConfigDomain",
                        column: x => x.CustomerConfigDomain,
                        principalTable: "CustomerConfigs",
                        principalColumn: "Domain",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SectionVisibility_CustomerConfigDomain",
                table: "SectionVisibility",
                column: "CustomerConfigDomain",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SectionVisibility");
        }
    }
}
