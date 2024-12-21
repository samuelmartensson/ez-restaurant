﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace backend.Migrations
{
    [DbContext(typeof(RestaurantContext))]
    [Migration("20241221132824_AddCustomerConfigSiteSectionHeroRelationship")]
    partial class AddCustomerConfigSiteSectionHeroRelationship
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.0");

            modelBuilder.Entity("Customer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Subscription")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Customers");
                });

            modelBuilder.Entity("CustomerConfig", b =>
                {
                    b.Property<string>("Domain")
                        .HasColumnType("TEXT");

                    b.Property<string>("Adress")
                        .HasColumnType("TEXT");

                    b.Property<int>("CustomerId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Email")
                        .HasColumnType("TEXT");

                    b.Property<string>("Font")
                        .HasColumnType("TEXT");

                    b.Property<int>("HeroType")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Logo")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Phone")
                        .HasColumnType("TEXT");

                    b.Property<string>("SiteMetaTitle")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("SiteName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Theme")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Domain");

                    b.HasIndex("CustomerId");

                    b.ToTable("CustomerConfigs");
                });

            modelBuilder.Entity("Database.Models.User", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("TEXT");

                    b.Property<int>("CustomerId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("CustomerId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("MenuItem", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Category")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("CustomerConfigDomain")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<string>("Image")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<decimal>("Price")
                        .HasColumnType("TEXT");

                    b.Property<string>("Tags")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("CustomerConfigDomain");

                    b.ToTable("MenuItems");
                });

            modelBuilder.Entity("OpeningHour", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<TimeSpan>("CloseTime")
                        .HasColumnType("TEXT");

                    b.Property<string>("CustomerConfigDomain")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("Day")
                        .HasColumnType("INTEGER");

                    b.Property<TimeSpan>("OpenTime")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("CustomerConfigDomain");

                    b.ToTable("OpeningHour");
                });

            modelBuilder.Entity("SiteSectionHero", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("CustomerConfigDomain")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("HeroImage")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("CustomerConfigDomain")
                        .IsUnique();

                    b.ToTable("SiteSectionHeros");
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

            modelBuilder.Entity("MenuItem", b =>
                {
                    b.HasOne("CustomerConfig", "CustomerConfig")
                        .WithMany("MenuItems")
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

            modelBuilder.Entity("SiteSectionHero", b =>
                {
                    b.HasOne("CustomerConfig", "CustomerConfig")
                        .WithOne("SiteSectionHero")
                        .HasForeignKey("SiteSectionHero", "CustomerConfigDomain")
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
                    b.Navigation("MenuItems");

                    b.Navigation("OpeningHours");

                    b.Navigation("SiteSectionHero");
                });
#pragma warning restore 612, 618
        }
    }
}