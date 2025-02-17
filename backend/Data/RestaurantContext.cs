using Database.Models;
using Microsoft.EntityFrameworkCore;

public class RestaurantContext : DbContext
{
    public RestaurantContext(DbContextOptions<RestaurantContext> options)
        : base(options)
    { }
    public required DbSet<Customer> Customers { get; set; }
    public required DbSet<CustomerConfig> CustomerConfigs { get; set; }
    public required DbSet<MenuCategory> MenuCategorys { get; set; }
    public required DbSet<MenuItem> MenuItems { get; set; }
    public required DbSet<User> Users { get; set; }
    public required DbSet<SiteSectionAbout> SiteSectionAbouts { get; set; }
    public required DbSet<SiteSectionGallery> SiteSectionGallerys { get; set; }
    public required DbSet<SiteSectionHero> SiteSectionHeros { get; set; }
    public required DbSet<OpeningHour> OpeningHours { get; set; }
    public required DbSet<Translation> Translations { get; set; }
    public required DbSet<NewsArticle> NewsArticles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Customer>().HasKey(c => c.Id);
        modelBuilder.Entity<CustomerConfig>().HasKey(c => c.Domain);
        modelBuilder.Entity<MenuCategory>().HasKey(c => c.Id);
        modelBuilder.Entity<MenuItem>().HasKey(c => c.Id);
        modelBuilder.Entity<User>().HasKey(c => c.Id);
        modelBuilder.Entity<OpeningHour>().HasKey(c => c.Id);
        modelBuilder.Entity<Translation>().HasKey(c => c.Id);
        modelBuilder.Entity<NewsArticle>().HasKey(c => c.Id);

        modelBuilder.Entity<SectionVisibility>().HasKey(c => c.Id);
        modelBuilder.Entity<SiteSectionHero>().HasKey(c => c.Id);
        modelBuilder.Entity<SiteSectionAbout>().HasKey(c => c.Id);
        modelBuilder.Entity<SiteSectionGallery>().HasKey(c => c.Id);

        modelBuilder.Entity<Customer>()
            .HasMany(c => c.CustomerConfigs)
            .WithOne(cf => cf.Customer)
            .HasForeignKey(c => c.CustomerId);

        modelBuilder.Entity<Customer>()
            .HasMany(c => c.Users)
            .WithOne(u => u.Customer)
            .HasForeignKey(c => c.CustomerId);

        modelBuilder.Entity<CustomerConfig>()
            .HasMany(cf => cf.Translations)
            .WithOne(c => c.CustomerConfig)
            .HasForeignKey(c => c.CustomerConfigDomain);

        modelBuilder.Entity<CustomerConfig>()
            .HasMany(cf => cf.NewsArticles)
            .WithOne(c => c.CustomerConfig)
            .HasForeignKey(c => c.CustomerConfigDomain);

        modelBuilder.Entity<CustomerConfig>()
            .HasMany(cf => cf.MenuCategorys)
            .WithOne(c => c.CustomerConfig)
            .HasForeignKey(c => c.CustomerConfigDomain);

        modelBuilder.Entity<CustomerConfig>()
            .HasMany(c => c.SiteSectionGallery)
            .WithOne(c => c.CustomerConfig)
            .HasForeignKey(c => c.CustomerConfigDomain);

        modelBuilder.Entity<CustomerConfig>()
            .HasMany(cf => cf.OpeningHours)
            .WithOne(c => c.CustomerConfig)
            .HasForeignKey(c => c.CustomerConfigDomain);

        modelBuilder.Entity<CustomerConfig>()
            .HasOne(c => c.SectionVisibility)
            .WithOne(c => c.CustomerConfig)
            .HasForeignKey<SectionVisibility>(c => c.CustomerConfigDomain);

        modelBuilder.Entity<CustomerConfig>()
            .HasOne(c => c.SiteSectionHero)
            .WithOne(c => c.CustomerConfig)
            .HasForeignKey<SiteSectionHero>(c => c.CustomerConfigDomain);

        modelBuilder.Entity<CustomerConfig>()
            .HasOne(c => c.SiteSectionAbout)
            .WithOne(c => c.CustomerConfig)
            .HasForeignKey<SiteSectionAbout>(c => c.CustomerConfigDomain);

        modelBuilder.Entity<MenuCategory>()
            .HasMany(cf => cf.MenuItems)
            .WithOne(c => c.MenuCategory)
            .HasForeignKey(c => c.MenuCategoryId);

    }

}