﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class Translations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Translations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Key = table.Column<string>(type: "TEXT", nullable: false),
                    Value = table.Column<string>(type: "TEXT", nullable: false),
                    LanguageCode = table.Column<string>(type: "TEXT", nullable: false),
                    CustomerConfigDomain = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Translations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Translations_CustomerConfigs_CustomerConfigDomain",
                        column: x => x.CustomerConfigDomain,
                        principalTable: "CustomerConfigs",
                        principalColumn: "Domain",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Translations_CustomerConfigDomain",
                table: "Translations",
                column: "CustomerConfigDomain");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Translations");
        }
    }
}
