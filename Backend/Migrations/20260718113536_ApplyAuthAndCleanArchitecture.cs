using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class ApplyAuthAndCleanArchitecture : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CreatedAt",
                table: "SupportTickets",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            // ⚠️ السطر ده اللي ضفناه عشان يحل مشكلة الداتا القديمة اللي أطول من 14 حرف
            migrationBuilder.Sql("UPDATE \"Customers\" SET \"NationalId\" = SUBSTRING(\"NationalId\", 1, 14) WHERE \"NationalId\" IS NOT NULL AND LENGTH(\"NationalId\") > 14;");

            migrationBuilder.AlterColumn<string>(
                name: "NationalId",
                table: "Customers",
                type: "character varying(14)",
                maxLength: 14,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<bool>(
                name: "IsEmailVerified",
                table: "Customers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "Customers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VerificationToken",
                table: "Customers",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsEmailVerified",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "Password",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "VerificationToken",
                table: "Customers");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedAt",
                table: "SupportTickets",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "NationalId",
                table: "Customers",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(14)",
                oldMaxLength: 14);
        }
    }
}