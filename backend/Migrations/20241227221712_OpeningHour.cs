using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class OpeningHour : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OpeningHour_CustomerConfigs_CustomerConfigDomain",
                table: "OpeningHour");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OpeningHour",
                table: "OpeningHour");

            migrationBuilder.RenameTable(
                name: "OpeningHour",
                newName: "OpeningHours");

            migrationBuilder.RenameIndex(
                name: "IX_OpeningHour_CustomerConfigDomain",
                table: "OpeningHours",
                newName: "IX_OpeningHours_CustomerConfigDomain");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OpeningHours",
                table: "OpeningHours",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OpeningHours_CustomerConfigs_CustomerConfigDomain",
                table: "OpeningHours",
                column: "CustomerConfigDomain",
                principalTable: "CustomerConfigs",
                principalColumn: "Domain",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OpeningHours_CustomerConfigs_CustomerConfigDomain",
                table: "OpeningHours");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OpeningHours",
                table: "OpeningHours");

            migrationBuilder.RenameTable(
                name: "OpeningHours",
                newName: "OpeningHour");

            migrationBuilder.RenameIndex(
                name: "IX_OpeningHours_CustomerConfigDomain",
                table: "OpeningHour",
                newName: "IX_OpeningHour_CustomerConfigDomain");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OpeningHour",
                table: "OpeningHour",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OpeningHour_CustomerConfigs_CustomerConfigDomain",
                table: "OpeningHour",
                column: "CustomerConfigDomain",
                principalTable: "CustomerConfigs",
                principalColumn: "Domain",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
