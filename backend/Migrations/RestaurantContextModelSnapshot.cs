﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    [DbContext(typeof(RestaurantContext))]
    partial class RestaurantContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Customer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<bool>("IsFirstSignIn")
                        .HasColumnType("boolean");

                    b.Property<int>("Subscription")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("SubscriptionExpireAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.ToTable("Customers");
                });

            modelBuilder.Entity("CustomerConfig", b =>
                {
                    b.Property<string>("Domain")
                        .HasColumnType("text");

                    b.Property<string>("Adress")
                        .HasColumnType("text");

                    b.Property<string>("Currency")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("CustomDomain")
                        .HasColumnType("text");

                    b.Property<int>("CustomerId")
                        .HasColumnType("integer");

                    b.Property<string>("DefaultLanguage")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .HasColumnType("text");

                    b.Property<string>("FacebookUrl")
                        .HasColumnType("text");

                    b.Property<string>("Font")
                        .HasColumnType("text");

                    b.Property<int>("HeroType")
                        .HasColumnType("integer");

                    b.Property<string>("InstagramUrl")
                        .HasColumnType("text");

                    b.Property<string>("Languages")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Logo")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("MapUrl")
                        .HasColumnType("text");

                    b.Property<string>("Phone")
                        .HasColumnType("text");

                    b.Property<string>("SiteMetaTitle")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SiteName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Theme")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ThemeColorConfig")
                        .HasColumnType("text");

                    b.Property<string>("TiktokUrl")
                        .HasColumnType("text");

                    b.HasKey("Domain");

                    b.HasIndex("CustomerId");

                    b.ToTable("CustomerConfigs");
                });

            modelBuilder.Entity("Database.Models.User", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<int>("CustomerId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("CustomerId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("MenuCategory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("CustomerConfigDomain")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Order")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("CustomerConfigDomain");

                    b.ToTable("MenuCategorys");
                });

            modelBuilder.Entity("MenuItem", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<string>("Image")
                        .HasColumnType("text");

                    b.Property<int>("MenuCategoryId")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Order")
                        .HasColumnType("integer");

                    b.Property<decimal>("Price")
                        .HasColumnType("numeric");

                    b.Property<string>("Tags")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("MenuCategoryId");

                    b.ToTable("MenuItems");
                });

            modelBuilder.Entity("NewsArticle", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("CustomerConfigDomain")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("Date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Image")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("Published")
                        .HasColumnType("boolean");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.HasIndex("CustomerConfigDomain");

                    b.ToTable("NewsArticles");
                });

            modelBuilder.Entity("OpeningHour", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<TimeSpan>("CloseTime")
                        .HasColumnType("interval");

                    b.Property<string>("CustomerConfigDomain")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Day")
                        .HasColumnType("integer");

                    b.Property<bool>("IsClosed")
                        .HasColumnType("boolean");

                    b.Property<string>("Label")
                        .HasColumnType("text");

                    b.Property<TimeSpan>("OpenTime")
                        .HasColumnType("interval");

                    b.HasKey("Id");

                    b.HasIndex("CustomerConfigDomain");

                    b.ToTable("OpeningHours");
                });

            modelBuilder.Entity("SectionVisibility", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<bool>("ContactFormVisible")
                        .HasColumnType("boolean");

                    b.Property<string>("CustomerConfigDomain")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("CustomerConfigDomain")
                        .IsUnique();

                    b.ToTable("SectionVisibility");
                });

            modelBuilder.Entity("SiteSectionAbout", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("CustomerConfigDomain")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Image")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("CustomerConfigDomain")
                        .IsUnique();

                    b.ToTable("SiteSectionAbouts");
                });

            modelBuilder.Entity("SiteSectionGallery", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("CustomerConfigDomain")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Image")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("CustomerConfigDomain");

                    b.ToTable("SiteSectionGallerys");
                });

            modelBuilder.Entity("SiteSectionHero", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("CustomerConfigDomain")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Image")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("OrderUrl")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("CustomerConfigDomain")
                        .IsUnique();

                    b.ToTable("SiteSectionHeros");
                });

            modelBuilder.Entity("Translation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("CustomerConfigDomain")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Key")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("LanguageCode")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Value")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("CustomerConfigDomain");

                    b.ToTable("Translations");
                });

            modelBuilder.Entity("CustomerConfig", b =>
                {
                    b.HasOne("Customer", "Customer")
                        .WithMany("CustomerConfigs")
                        .HasForeignKey("CustomerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Customer");
                });

            modelBuilder.Entity("Database.Models.User", b =>
                {
                    b.HasOne("Customer", "Customer")
                        .WithMany("Users")
                        .HasForeignKey("CustomerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Customer");
                });

            modelBuilder.Entity("MenuCategory", b =>
                {
                    b.HasOne("CustomerConfig", "CustomerConfig")
                        .WithMany("MenuCategorys")
                        .HasForeignKey("CustomerConfigDomain")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CustomerConfig");
                });

            modelBuilder.Entity("MenuItem", b =>
                {
                    b.HasOne("MenuCategory", "MenuCategory")
                        .WithMany("MenuItems")
                        .HasForeignKey("MenuCategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("MenuCategory");
                });

            modelBuilder.Entity("NewsArticle", b =>
                {
                    b.HasOne("CustomerConfig", "CustomerConfig")
                        .WithMany("NewsArticles")
                        .HasForeignKey("CustomerConfigDomain")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CustomerConfig");
                });

            modelBuilder.Entity("OpeningHour", b =>
                {
                    b.HasOne("CustomerConfig", "CustomerConfig")
                        .WithMany("OpeningHours")
                        .HasForeignKey("CustomerConfigDomain")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CustomerConfig");
                });

            modelBuilder.Entity("SectionVisibility", b =>
                {
                    b.HasOne("CustomerConfig", "CustomerConfig")
                        .WithOne("SectionVisibility")
                        .HasForeignKey("SectionVisibility", "CustomerConfigDomain")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CustomerConfig");
                });

            modelBuilder.Entity("SiteSectionAbout", b =>
                {
                    b.HasOne("CustomerConfig", "CustomerConfig")
                        .WithOne("SiteSectionAbout")
                        .HasForeignKey("SiteSectionAbout", "CustomerConfigDomain")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CustomerConfig");
                });

            modelBuilder.Entity("SiteSectionGallery", b =>
                {
                    b.HasOne("CustomerConfig", "CustomerConfig")
                        .WithMany("SiteSectionGallery")
                        .HasForeignKey("CustomerConfigDomain")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CustomerConfig");
                });

            modelBuilder.Entity("SiteSectionHero", b =>
                {
                    b.HasOne("CustomerConfig", "CustomerConfig")
                        .WithOne("SiteSectionHero")
                        .HasForeignKey("SiteSectionHero", "CustomerConfigDomain")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CustomerConfig");
                });

            modelBuilder.Entity("Translation", b =>
                {
                    b.HasOne("CustomerConfig", "CustomerConfig")
                        .WithMany("Translations")
                        .HasForeignKey("CustomerConfigDomain")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CustomerConfig");
                });

            modelBuilder.Entity("Customer", b =>
                {
                    b.Navigation("CustomerConfigs");

                    b.Navigation("Users");
                });

            modelBuilder.Entity("CustomerConfig", b =>
                {
                    b.Navigation("MenuCategorys");

                    b.Navigation("NewsArticles");

                    b.Navigation("OpeningHours");

                    b.Navigation("SectionVisibility")
                        .IsRequired();

                    b.Navigation("SiteSectionAbout");

                    b.Navigation("SiteSectionGallery");

                    b.Navigation("SiteSectionHero");

                    b.Navigation("Translations");
                });

            modelBuilder.Entity("MenuCategory", b =>
                {
                    b.Navigation("MenuItems");
                });
#pragma warning restore 612, 618
        }
    }
}
