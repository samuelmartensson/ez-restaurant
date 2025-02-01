using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class Postgres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Customers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Subscription = table.Column<int>(type: "integer", nullable: false),
                    IsFirstSignIn = table.Column<bool>(type: "boolean", nullable: false),
                    SubscriptionExpireAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CustomerConfigs",
                columns: table => new
                {
                    Domain = table.Column<string>(type: "text", nullable: false),
                    Languages = table.Column<string>(type: "text", nullable: false),
                    DefaultLanguage = table.Column<string>(type: "text", nullable: false),
                    CustomerId = table.Column<int>(type: "integer", nullable: false),
                    HeroType = table.Column<int>(type: "integer", nullable: false),
                    Theme = table.Column<string>(type: "text", nullable: false),
                    SiteName = table.Column<string>(type: "text", nullable: false),
                    SiteMetaTitle = table.Column<string>(type: "text", nullable: false),
                    Logo = table.Column<string>(type: "text", nullable: false),
                    Currency = table.Column<string>(type: "text", nullable: false),
                    ThemeColorConfig = table.Column<string>(type: "text", nullable: true),
                    Font = table.Column<string>(type: "text", nullable: true),
                    Adress = table.Column<string>(type: "text", nullable: true),
                    Phone = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    CustomDomain = table.Column<string>(type: "text", nullable: true),
                    InstagramUrl = table.Column<string>(type: "text", nullable: true),
                    MapUrl = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerConfigs", x => x.Domain);
                    table.ForeignKey(
                        name: "FK_CustomerConfigs_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    CustomerId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MenuCategorys",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CustomerConfigDomain = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false)
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

            migrationBuilder.CreateTable(
                name: "OpeningHours",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CustomerConfigDomain = table.Column<string>(type: "text", nullable: false),
                    Day = table.Column<int>(type: "integer", nullable: false),
                    OpenTime = table.Column<TimeSpan>(type: "interval", nullable: false),
                    CloseTime = table.Column<TimeSpan>(type: "interval", nullable: false),
                    IsClosed = table.Column<bool>(type: "boolean", nullable: false),
                    Label = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OpeningHours", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OpeningHours_CustomerConfigs_CustomerConfigDomain",
                        column: x => x.CustomerConfigDomain,
                        principalTable: "CustomerConfigs",
                        principalColumn: "Domain",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SectionVisibility",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ContactFormVisible = table.Column<bool>(type: "boolean", nullable: false),
                    CustomerConfigDomain = table.Column<string>(type: "text", nullable: false)
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

            migrationBuilder.CreateTable(
                name: "SiteSectionAbouts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Image = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    CustomerConfigDomain = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteSectionAbouts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SiteSectionAbouts_CustomerConfigs_CustomerConfigDomain",
                        column: x => x.CustomerConfigDomain,
                        principalTable: "CustomerConfigs",
                        principalColumn: "Domain",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SiteSectionGallerys",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Image = table.Column<string>(type: "text", nullable: false),
                    CustomerConfigDomain = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteSectionGallerys", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SiteSectionGallerys_CustomerConfigs_CustomerConfigDomain",
                        column: x => x.CustomerConfigDomain,
                        principalTable: "CustomerConfigs",
                        principalColumn: "Domain",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SiteSectionHeros",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Image = table.Column<string>(type: "text", nullable: false),
                    OrderUrl = table.Column<string>(type: "text", nullable: false),
                    CustomerConfigDomain = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteSectionHeros", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SiteSectionHeros_CustomerConfigs_CustomerConfigDomain",
                        column: x => x.CustomerConfigDomain,
                        principalTable: "CustomerConfigs",
                        principalColumn: "Domain",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Translations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Key = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false),
                    LanguageCode = table.Column<string>(type: "text", nullable: false),
                    CustomerConfigDomain = table.Column<string>(type: "text", nullable: false)
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

            migrationBuilder.CreateTable(
                name: "MenuItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MenuCategoryId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Price = table.Column<decimal>(type: "numeric", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Tags = table.Column<string>(type: "text", nullable: true),
                    Image = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MenuItems_MenuCategorys_MenuCategoryId",
                        column: x => x.MenuCategoryId,
                        principalTable: "MenuCategorys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CustomerConfigs_CustomerId",
                table: "CustomerConfigs",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_MenuCategorys_CustomerConfigDomain",
                table: "MenuCategorys",
                column: "CustomerConfigDomain");

            migrationBuilder.CreateIndex(
                name: "IX_MenuItems_MenuCategoryId",
                table: "MenuItems",
                column: "MenuCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_OpeningHours_CustomerConfigDomain",
                table: "OpeningHours",
                column: "CustomerConfigDomain");

            migrationBuilder.CreateIndex(
                name: "IX_SectionVisibility_CustomerConfigDomain",
                table: "SectionVisibility",
                column: "CustomerConfigDomain",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SiteSectionAbouts_CustomerConfigDomain",
                table: "SiteSectionAbouts",
                column: "CustomerConfigDomain",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SiteSectionGallerys_CustomerConfigDomain",
                table: "SiteSectionGallerys",
                column: "CustomerConfigDomain");

            migrationBuilder.CreateIndex(
                name: "IX_SiteSectionHeros_CustomerConfigDomain",
                table: "SiteSectionHeros",
                column: "CustomerConfigDomain",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Translations_CustomerConfigDomain",
                table: "Translations",
                column: "CustomerConfigDomain");

            migrationBuilder.CreateIndex(
                name: "IX_Users_CustomerId",
                table: "Users",
                column: "CustomerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MenuItems");

            migrationBuilder.DropTable(
                name: "OpeningHours");

            migrationBuilder.DropTable(
                name: "SectionVisibility");

            migrationBuilder.DropTable(
                name: "SiteSectionAbouts");

            migrationBuilder.DropTable(
                name: "SiteSectionGallerys");

            migrationBuilder.DropTable(
                name: "SiteSectionHeros");

            migrationBuilder.DropTable(
                name: "Translations");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "MenuCategorys");

            migrationBuilder.DropTable(
                name: "CustomerConfigs");

            migrationBuilder.DropTable(
                name: "Customers");
        }
    }
}
